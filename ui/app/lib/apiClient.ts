import {  getApiUrl, ApiType } from "./utils";
import { setUserSession, getSession } from "./session";
import { redirect, TypedResponse } from "@remix-run/node";

export type UrlMethod = "GET" | "POST" | "DELETE" | "PUT";
export type ApiReturnType = {
  success: boolean,
  cookieHeader: string | null;
  data: Response;
}

const ApiClient = async (
  service: ApiType,
  method: UrlMethod,
  endpoint: string,
  request: Request,
  data: object | undefined | null
): Promise<ApiReturnType| TypedResponse<never>> => {
  let apiUrl = getApiUrl(service);
  apiUrl = endpoint.at(0) === "/" ? apiUrl + endpoint : apiUrl + "/" + endpoint;

  let config: RequestInit = {
    method,
    credentials: "include",
    headers: {
      ...(request.headers.get("cookie") && { cookie: request.headers.get("cookie")! }),
      ...((method === "DELETE" || method === "POST" || method === "PUT") && { 'Content-Type': 'application/json' }),
    },
    ...(data && { body: JSON.stringify(data) })
  };

  let res = await fetch(apiUrl, config);

  if (res.ok) {
    return {
      success: res.ok,
      data: await res.json(),
      cookieHeader: null,
    }
  }

  if (res.status === 401) {
    let res = await fetch(getApiUrl("settings") + "/refresh", {
      method: "POST",
      credentials: "include",
      headers: {
        ...(request.headers.get("cookie") && { cookie: request.headers.get("cookie")! }),
      },
    });

    
    if(res.ok){
      let tokenData = await res.json();

      const cookieData = {
        role: tokenData.role,
        username: tokenData.username,
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        email: tokenData.email,
      };
  
      let session = await getSession(request.headers.get('Cookie'));
      let cookieHeader = await setUserSession(session, cookieData);
  
      config.headers = {
        ...config.headers,
        cookie: cookieHeader
      };
  
      res           = await fetch(apiUrl, config);
      let reqData   = await res.json();
  
      return {
        success: res.ok,
        data: reqData,
        cookieHeader, 
      }
    } else {
        throw redirect("/login", 302);
    }
  }
  return {
    success: res.ok,
    data: await res.json(),
    cookieHeader: null
  }
};

export default ApiClient;