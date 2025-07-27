import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Toaster } from "./components/ui/toaster";
import { Toaster as ToasterSonner } from "~/components/ui/sonner";
import "./tailwind.css";
import { themeSessionResolver } from "./lib/session";
import { useLoaderData } from "@remix-run/react";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
  Theme,
} from "remix-themes";
import clsx from "clsx";
import { useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request);

  return Response.json({
    theme: getTheme(),
    ENV: {
      NODE_ENV: process.env.NODE_ENV,
    },
  });
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();

  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  );
}

export function App() {
  const data = useLoaderData<typeof loader>();
  const [theme, setTheme] = useTheme();
  const location = useLocation();

  useEffect(() => {
    if (
      theme === "dark" &&
      (location.pathname === "/login" ||
        location.pathname === "/register" ||
        location.pathname === "/forgot" ||
        location.pathname === "/privacy" ||
        location.pathname === "/")
    ) {
      setTheme(Theme.LIGHT);
    }
  }, [location]);

  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body>
        <Outlet />
        <Toaster />
        <ToasterSonner />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
