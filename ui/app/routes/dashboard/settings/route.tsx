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
import { SettingsSection } from "~/components/features/dashboard/settings/SettingsSection";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  let res;
  let cookieHeader;

  switch (formData.get("action")) {
    case "update_user":
      const data = {
        firstName: formData.get("first_name"),
        lastName: formData.get("last_name"),
        email: formData.get("email"),
        company: formData.get("company"),
        password: formData.get("password"),
      };

      res = await ApiClient("settings", "PUT", "/update", request, data);
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

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    let data = {};
    let res;
    let cookieHeader;
    res = await ApiClient("settings", "GET", "/identify/all", request, null);

    const user =
      "success" in res && res.success && "data" in res.data
        ? res.data.data
        : undefined;

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
        { user },
        {
          status: 200,
          headers: cookieHeader ? { "Set-Cookie": cookieHeader } : undefined,
        }
      );
    }
  } catch (error) {
    console.error("Loader error:", error);
    return redirect("/login");
  }
}

const Settings = () => {
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
              <BreadcrumbPage>User Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between space-y-2">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 dark:text-white">
            User Settings
          </h2>
        </div>

        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <SettingsSection />
        </div>
      </div>
    </>
  );
};

export default Settings;
