import HeaderCustom from "~/components/common/HeaderCustom";
import FooterCustom from "~/components/common/FooterCustom";
import { ActionFunctionArgs } from "@remix-run/node";
import { getApiUrl } from "~/lib/utils";
import ForgotForm from "~/components/features/forgot/ForgotForm";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  let res = await fetch((getApiUrl("py") as string) + "/forgot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: formData.get("email"),
      origin: formData.get("origin"),
    }),
  });

  if (res.ok) {
    return Response.json({ success: true });
  } else {
    return Response.json({ success: false });
  }
}

export default function Forgot() {
  return (
    <>
      <HeaderCustom showNavigation={false} />
      <div className="flex flex-col items-center justify-center w-full h-full min-h-[80vh] bg-white">
        <ForgotForm />
      </div>
      <FooterCustom />
    </>
  );
}