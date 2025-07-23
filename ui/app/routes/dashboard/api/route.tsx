import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import ApiClient from "~/lib/apiClient";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ApiSection } from "~/components/features/dashboard/api/ApiSection";
import { parseFormValue, convertUTCToLocal } from "~/lib/utils";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  let data = {};
  let res;
  let cookieHeader;

  switch (formData.get("action")) {
    case "add_api_link":
      data = {
        serviceLevel: parseFormValue(formData.get("serviceLevel")),
        apiKey: parseFormValue(formData.get("apiKey")),
        secret: parseFormValue(formData.get("secret")),
        accessToken: parseFormValue(formData.get("accessToken")),
        refreshToken: parseFormValue(formData.get("refreshToken")),
        expiration: parseFormValue(formData.get("expiration")),
        state: parseFormValue(formData.get("state")),
        scope: parseFormValue(formData.get("scope")),
        platform: parseFormValue(formData.get("platform")),
        userId: parseFormValue(formData.get("userId")),
        nickname: parseFormValue(formData.get("nickname")),
        status: parseFormValue(formData.get("status")),
      };
      res = await ApiClient("settings", "POST", "/api/add", request, data);
      break;

    case "edit_api_link":
      data = {
        id: parseFormValue(formData.get("id")),
        serviceLevel: parseFormValue(formData.get("serviceLevel")),
        apiKey: parseFormValue(formData.get("apiKey")),
        secret: parseFormValue(formData.get("secret")),
        accessToken: parseFormValue(formData.get("accessToken")),
        refreshToken: parseFormValue(formData.get("refreshToken")),
        expiration: parseFormValue(formData.get("expiration")),
        state: parseFormValue(formData.get("state")),
        scope: parseFormValue(formData.get("scope")),
        platform: parseFormValue(formData.get("platform")),
        userId: parseFormValue(formData.get("userId")),
        nickname: parseFormValue(formData.get("nickname")),
        status: parseFormValue(formData.get("status")),
      };
      res = await ApiClient("settings", "PUT", "/api/update", request, data);
      break;
    case "delete_api_link":
      data = {
        id: formData.get("id"),
      };
      res = await ApiClient("settings", "DELETE", "/api/delete", request, data);
      break;

    default:
      break;
  }

  if (
    typeof res === "object" &&
    "cookieHeader" in res &&
    res.cookieHeader !== null &&
    res.success
  ) {
    cookieHeader = res.cookieHeader;
  }

  if (typeof res === "object" && "success" in res && res.success) {
    return Response.json(
      {
        success: true,
        action: formData.get("action"),
      },
      {
        status: 200,
        headers: cookieHeader
          ? {
              "Set-Cookie": cookieHeader,
            }
          : undefined,
      }
    );
  } else {
    return Response.json(
      {
        success: false,
        action: formData.get("action"),
      },
      {
        status: 500,
      }
    );
  }
}

export type TableData = {
  items: [{ [key: string]: any }];
  total: number;
  page: number;
  size: number;
  pages: number;
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const page = url.searchParams.get("page") || "1";
    const size = url.searchParams.get("size") || "10";
    const params = url.searchParams.get("params") || "";

    // Fetch Api Account Service Types
    const serviceTypesResponse = await ApiClient(
      "settings",
      "GET",
      "/api/serviceTypes",
      request,
      null
    );

    // Fetch Platforms
    const platformsResponse = await ApiClient(
      "settings",
      "GET",
      "/account/brokers",
      request,
      null
    );

    // Fetch Api Records
    const apiRecordsResponse = await ApiClient(
      "settings",
      "GET",
      `/api/all?page=${page}&size=${size}&${params}`,
      request,
      null
    );

    // Fetch Stats
    const apiStatsResponse = await ApiClient(
      "settings",
      "GET",
      `/api/stats`,
      request,
      null
    );

    // Extract cookie header if present
    const cookieHeader =
      (serviceTypesResponse &&
        "cookieHeader" in serviceTypesResponse &&
        serviceTypesResponse.cookieHeader) ||
      (platformsResponse &&
        "cookieHeader" in platformsResponse &&
        platformsResponse.cookieHeader) ||
      (apiRecordsResponse &&
        "cookieHeader" in apiRecordsResponse &&
        apiRecordsResponse.cookieHeader) ||
      (apiStatsResponse &&
        "cookieHeader" in apiStatsResponse &&
        apiStatsResponse.cookieHeader);
    null;

    // Process Service Types
    const serviceTypes =
      "success" in serviceTypesResponse &&
      serviceTypesResponse.success &&
      "serviceTypes" in serviceTypesResponse.data
        ? serviceTypesResponse.data.serviceTypes
        : undefined;

    // Platforms
    const platforms =
      "success" in platformsResponse &&
      platformsResponse.success &&
      "data" in platformsResponse &&
      "brokers" in platformsResponse.data
        ? platformsResponse.data.brokers
        : undefined;

    // Api Records
    let apiConnections =
      "success" in apiRecordsResponse &&
      apiRecordsResponse.success &&
      "apiRecords" in apiRecordsResponse.data
        ? apiRecordsResponse.data.apiRecords
        : undefined;

    if (
      apiConnections &&
      typeof apiConnections === "object" &&
      "items" in apiConnections &&
      Array.isArray(apiConnections.items)
    ) {
      apiConnections.items = apiConnections.items.map((cx) => {
        return {
          ...cx,
          expiration: convertUTCToLocal(cx.expiration, "yyyy-MM-dd'T'HH:mm:ss"),
        };
      });
    }

    // Api stats
    const apiStats =
      "success" in apiStatsResponse &&
      apiStatsResponse.success &&
      "stats" in apiStatsResponse.data
        ? apiStatsResponse.data.stats
        : undefined;


    return Response.json(
      { serviceTypes, platforms, apiConnections, apiStats },
      {
        status: 200,
        headers: cookieHeader ? { "Set-Cookie": cookieHeader } : undefined,
      }
    );
  } catch (error) {
    console.error("Loader error:", error);
    return redirect("/login");
  }
}

const Api = () => {
  const { apiConnections } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex-1 space-y-4 p-1 md:p-8 pt-6 overflow-x-auto">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Api Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between space-y-2">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 dark:text-white">
            Api Manager
          </h2>
        </div>

        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <ApiSection data={apiConnections} />
        </div>
      </div>
    </>
  );
};

export default Api;
