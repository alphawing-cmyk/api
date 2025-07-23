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
import { SymbolSection } from "~/components/features/dashboard/symbols/SymbolSection";
import { parseFormValue } from "~/lib/utils";
import { useLoaderData } from "@remix-run/react";
import { a } from "react-spring";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  let data = {};
  let res;
  let cookieHeader;

  switch (formData.get("action")) {
    case "add_symbol":
      data = {
        symbol: parseFormValue(formData.get("symbol")),
        name: parseFormValue(formData.get("name")),
        industry: parseFormValue(formData.get("industry")),
        market: parseFormValue(formData.get("market")),
        market_cap: parseFormValue(formData.get("market_cap")),
        alt_names:  parseFormValue(formData.get("alt_names")),
      };

      res = await ApiClient(
        "settings",
        "POST",
        "/symbol/add/single",
        request,
        data
      );
      break;

    case "edit_symbol":
      data = {
        id: parseFormValue(formData.get("id")),
        symbol: parseFormValue(formData.get("symbol")),
        name: parseFormValue(formData.get("name")),
        industry: parseFormValue(formData.get("industry")),
        market: parseFormValue(formData.get("market")),
        market_cap: parseFormValue(formData.get("market_cap")),
        alt_names: parseFormValue(formData.get("alt_names")),
      };

      res = await ApiClient(
        "settings",
        "POST",
        "/symbol/update",
        request,
        data
      );
      break;
    case "delete_symbol":
      data = {
        id: parseFormValue(formData.get("id")),
      };

      res = await ApiClient(
        "settings",
        "DELETE",
        "/symbol/delete",
        request,
        data
      );
      break;
    default:
      console.log("You hit default");
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
        message: "Successfully added in ticker.",
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
  } else if (typeof res === "object" && "success" in res && !res.success) {
    return Response.json(
      {
        success: false,
        action: formData.get("action"),
        message: "message" in res.data ? res.data.message : "",
      },
      {
        status: 400,
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
        message: "Could not delete symbol, please try again.",
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

    // Fetch Ticker Records
    const tickerRecordsResponse = await ApiClient(
      "settings",
      "GET",
      `/symbol/symbols?page=${page}&size=${size}&${params}`,
      request,
      null
    );

    // Extract cookie header if present
    const cookieHeader =
      tickerRecordsResponse &&
      "cookieHeader" in tickerRecordsResponse &&
      tickerRecordsResponse.cookieHeader;
    null;

    // Tickers
    let tickers =
      "success" in tickerRecordsResponse &&
      tickerRecordsResponse.success &&
      "symbolRecords" in tickerRecordsResponse.data
        ? tickerRecordsResponse.data.symbolRecords
        : {
            items: [{}],
            total: 0,
            page: 0,
            size: 0,
            pages: 0,
          };

    return Response.json(
      { tickers },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Loader error:", error);
    return redirect("/login");
  }
}

const Symbols = () => {
  const { tickers } = useLoaderData<typeof loader>();

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
              <BreadcrumbPage>Symbol Explorer</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between space-y-2">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 dark:text-white">
            Symbol Explorer
          </h2>
        </div>

        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <SymbolSection data={tickers} />
        </div>
      </div>
    </>
  );
};

export default Symbols;
