import HeaderCustom from "~/components/common/HeaderCustom";
import FooterCustom from "~/components/common/FooterCustom";
import { ActionFunctionArgs } from "@remix-run/node";
import { getApiUrl } from "~/lib/utils";
import RegisterForm from "~/components/features/register/RegisterForm";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  let res = await fetch((getApiUrl("settings") as string) + "/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: formData.get("username"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirm_password"),
      firstName: formData.get("first_name"),
      lastName: formData.get("last_name"),
      email: formData.get("email"),
      company: formData.get("company"),
      role: "demo"
    }),
  });

  if (res.status === 200) {
    let { data } = await res.json();

    return Response.json(
      {
        success: true,
        data,
      },
      {
        status: 200,
      }
    );
  } else {
    return Response.json(
      {
        success: false,
        data: {},
      },
      { status: res.status }
    );
  }
}

export default function Register() {
  return (
    <>
      <HeaderCustom showNavigation={false} />
      <div className="flex flex-col items-center justify-center w-full h-full min-h-[80vh] bg-white">
        <RegisterForm />
      </div>
      <FooterCustom />
    </>
  );
}
