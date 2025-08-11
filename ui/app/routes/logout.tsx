import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { getSession, destroySession, destroyUserSession } from "~/lib/session";

export let action = async ({ request }: ActionFunctionArgs) => {
    let session = await getSession(request.headers.get("cookie"));
    return redirect("/login", {
        headers: {
            "Set-Cookie": await destroySession(session)
        }
    })
};

export default function Logout() {
    return null;
}
