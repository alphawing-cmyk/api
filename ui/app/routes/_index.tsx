import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import Navbar from "~/components/features/home/components/Navbar";
import Features from "~/components/features/home/sections/Features";
import Hero from "~/components/features/home/sections/Hero";
import Pricing from "~/components/features/home/sections/Pricing";
import Signup from "~/components/features/home/sections/Signup";
import Statistics from "~/components/features/home/sections/Statistics";
import Tech from "~/components/features/home/sections/Tech";
import { reviews } from "~/components/features/home/data/reviews";
import Reviews from "~/components/features/home/sections/Reviews";
import { getApiUrl } from "~/lib/utils";
import Footer from "~/components/features/home/sections/Footer";
import BottomStatus from "~/components/features/home/sections/BottomStatus";

export const meta: MetaFunction = () => {
  return [
    { title: "Alpha Wing" },
    { name: "description", content: "Automated Trading Platform" },
  ];
};

export async function loader() {
  try {

    const data = {
      owner: "alphawing-cmyk",
      repo: "Alpha-Wing",
    };

    const res = await fetch(getApiUrl('py') + "/misc/github/repo", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    let commitCount = await res.json();
    return Response.json({
      status: "success",
      ok: true,
      data: commitCount,
      error: undefined,
      _action: "fetchCommits"
    });
  } catch (err) {
    return Response.json({
      status: "failed",
      ok: false,
      error: err,
      _action: "fetchCommits"
    },
      {
        status: 404
      });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const formAction = formData.get("_action");

  switch (formAction) {
    case "createReviewLogin": {

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

      let responseJson = await res.json();

      return Response.json({
        _action: "createReviewLogin",
        ok: true,
        message: "Logged in from review section",
        role: responseJson.data.role,
        accessToken: responseJson.data.accessToken,
        refreshToken: responseJson.data.refreshToken,
      },
        {
          status: 200
        });
    }
    case "submitReview": {
      return Response.json({
        _action: "submitReview",
        ok: true,
        message: "Submitted Review"
      },
        {
          status: 200
        });
    }
    default: {
      return Response.json({
        _action: undefined,
        ok: false,
        message: "Form is not found based on the action name"
      },
        {
          status: 500
        });
    }
  }
}


export default function Index() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Signup />
      <Tech />
      <Statistics />
      <Pricing />
      <Reviews reviews={reviews} />
      <Footer />
      <BottomStatus />
    </>
  );
}
