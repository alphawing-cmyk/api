import HeaderCustom from "~/components/common/HeaderCustom";
import LoginForm from "~/components/features/login/LoginForm";
import FooterCustom from "~/components/common/FooterCustom";
import { ActionFunctionArgs } from "@remix-run/node";
import { getApiUrl } from "~/lib/utils";
import { getSession, setUserSession } from "~/lib/session";


export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  let res = await fetch(getApiUrl("py") as string + "/login", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      {
        username: formData.get("username"),
        password: formData.get("password")
      })
  });

  if (res.status === 200) {

    let { data } = await res.json();

    const cookieData = {
      role: data.role,
      username: data.username,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      email: data.email,
    };

    let session = await getSession(request.headers.get('Cookie'));
    let cookieHeader = await setUserSession(session, cookieData);


    return Response.json(
      {
        ok: true,
        data: cookieData,
        env: process.env.NODE_ENV
      }, {
      status: 200,
      headers: {
        "Set-Cookie": cookieHeader
      }
    });
  } else {
    return Response.json({
      ok: false,
      data: {},
      env: process.env.NODE_ENV
    }, { status: res.status });
  }
}

export default function Login() {
  return (
    <>
      <HeaderCustom showNavigation={false} />
      <div className="flex flex-col items-center justify-center w-full h-full min-h-[80vh] bg-white">
        <LoginForm />
      </div>
      <FooterCustom />
    </>
  );
}