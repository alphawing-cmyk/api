import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { AccountSection } from "~/components/features/dashboard/accounts/AccountSection";
import ApiClient from "~/lib/apiClient";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  let data = {};
  let res;
  let cookieHeader;

  switch (formData.get("action")) {
    case "add_account":
      data = {
        account_num: formData.get("account_num"),
        nickname: formData.get("nickname"),
        broker: formData.get("broker"),
        date_opened: formData.get("date_opened"),
        initial_balance: formData.get("initial_balance"),
        current_balance: formData.get("current_balance"),
        account_type: formData.get("account_type"),
        auto_trade: formData.get("auto_trade") === "true" ? true : false,
      };

      console.log(data);

      res = await ApiClient("py", "POST", "/account/client/add", request, data);
      break;
    case "delete_account":
      data = {
        id: formData.get("id"),
      };
      res = await ApiClient(
        "py",
        "DELETE",
        "/account/client/delete",
        request,
        data
      );
      break;

    case "edit_account":
      data = {
        id: formData.get("id"),
        accountNum: formData.get("accountNum"),
        nickname: formData.get("nickname"),
        broker: formData.get("broker"),
        dateOpened: formData.get("dateOpened"),
        initialBalance: formData.get("initialBalance"),
        currentBalance: formData.get("currentBalance"),
        accountType: formData.get("accountType"),
        autoTrade: formData.get("autoTrade") === "true" ? true : false,
      };
      res = await ApiClient(
        "py",
        "PUT",
        "/account/client/update",
        request,
        data
      );
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

    const res = await ApiClient(
      "py",
      "GET",
      `/account/client/all?page=${page}&size=${size}&${params}`,
      request,
      null
    );
    let cookieHeader;
    let accounts: TableData = {
      items: [{}],
      total: 0,
      page: 0,
      size: 0,
      pages: 0,
    };
    let brokers;


    if (
      res &&
      "data" in res &&
      "success" in res &&
      "items" in res.data &&
      res.success === true &&
      "total" in res.data &&
      "page" in res.data &&
      "size" in res.data &&
      "pages" in res.data
    ) {

    let data = res.data;
     accounts = {
        items: data.items as [{}],
        total: data.total as number,
        page: data.page as number,
        size: data.size as number,
        pages: data.pages as number,
      };

      console.log(accounts);

    }

    if ("cookieHeader" in res && res.cookieHeader !== null && res.success) {
      cookieHeader = res.cookieHeader;
    }

    const res1 = await ApiClient(
      "py",
      "GET",
      "/account/brokers",
      request,
      null
    );

    if ("data" in res1 && "brokers" in res1.data && res1.success) {
      brokers = res1.data.brokers;
    }

    if ("cookieHeader" in res1 && res1.cookieHeader !== null && res1.success) {
      cookieHeader = res1.cookieHeader;
    }

    return Response.json(
      {
        accounts: accounts,
        brokers: brokers,
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
  } catch {
    return redirect("/login");
  }
}

const Accounts = () => {
  const { accounts } = useLoaderData<typeof loader>();

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
              <BreadcrumbPage>Accounts</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between space-y-2">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 dark:text-white">
            Account Manager
          </h2>
        </div>

        <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
          <AccountSection data={accounts} />
        </div>
      </div>
    </>
  );
};

export default Accounts;
