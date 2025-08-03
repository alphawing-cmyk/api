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
import { useLoaderData } from "@remix-run/react";
import { AddSymbol } from "./_actions/addSymbol";
import { DeleteSymbol } from "./_actions/deleteSymbol";
import { EditSymbol } from "./_actions/editSymbol";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const actionType = formData.get("action");
  let res: any;
  let cookieHeader;

  switch (actionType) {
    case "add_symbol":
      res = await AddSymbol(request, formData);
      break;
    case "edit_symbol":
      res = await EditSymbol(request, formData);
      break;
    case "delete_symbol":
      res = await DeleteSymbol(request, formData);
      break;
    default:
      console.log("Unknown action type:", actionType);
  }

  if (
    typeof res === "object" &&
    "cookieHeader" in res &&
    res.cookieHeader !== null &&
    res.success
  ) {
    cookieHeader = res.cookieHeader;
  }

  if (typeof res === "object" && "success" in res) {
    return Response.json(
      {
        success: res.success,
        action: actionType,
        message: res.success
          ? "Successfully added in ticker."
          : res.data?.message || "Action failed",
      },
      {
        status: res.success ? 200 : 400,
        headers: cookieHeader ? { "Set-Cookie": cookieHeader } : undefined,
      }
    );
  }

  return Response.json(
    {
      success: false,
      action: actionType,
      message: "Could not process symbol action, please try again.",
    },
    { status: 500 }
  );
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
      "py",
      "GET",
      `/symbol/all?page=${page}&size=${size}&${params}`,
      request,
      null
    );

    console.log(tickerRecordsResponse);

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
      "data" in tickerRecordsResponse
        ? tickerRecordsResponse.data
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
        headers: cookieHeader
          ? {
              "Set-Cookie": cookieHeader,
            }
          : undefined,
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
