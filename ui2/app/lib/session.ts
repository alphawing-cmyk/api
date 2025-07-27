import { createCookieSessionStorage, Session } from "@remix-run/node";
import { createThemeSessionResolver } from "remix-themes";

const storage = createCookieSessionStorage({
  cookie: {
    name: 'remix',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: "/",
    secrets: ["123"],
    domain: (process.env.NODE_ENV === 'production') ? 
              'https://alpha-wing.com' : undefined,
  },
});

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: 'theme',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: "/",
    secrets: ["123"],
    domain: (process.env.NODE_ENV === 'production') ? 
          'https://alpha-wing.com' : undefined,
  },
});

export const { getSession, commitSession, destroySession } = storage;

export async function getUserFromSession(session: Session) {
  return session.get("user");
}

export async function setUserSession(session: Session, user: object) {
  session.set('user', user);
  return await commitSession(session);
}

export async function destroyUserSession(session: Session) {
  session.unset('user');
  return await commitSession(session);
}

export const themeSessionResolver = createThemeSessionResolver(themeStorage);
