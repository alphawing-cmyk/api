import { Outlet, useLoaderData } from "@remix-run/react";
import Header from "~/components/features/dashboard/common/Header";
import Sidebar from "~/components/features/dashboard/common/Sidebar";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { useLocation } from "@remix-run/react";
// import { useWebsocket } from "~/context/WebsocketContext";
import { Toaster } from "~/components/ui/toaster";
import { Toaster as ToasterSonner } from "~/components/ui/sonner";
import { loader } from "../dashboard._index";



export default function DashboardLayout() {
  const location = useLocation();
  const data = useLoaderData<typeof loader>();


  // ---------------Websocket--------------------
  //   const socket = useWebsocket();

  //   const onMessage = useCallback((message: any) => {
  //      const data = JSON.parse(message?.data);
  //      console.log(data);
  //   },[]);

  //   useEffect(() => {
  //     socket?.addEventListener("message", onMessage);
  //     socket?.addEventListener("error", err => { console.log(err);  })
  //     return () => {
  //       socket?.removeEventListener("message", onMessage);
  //     }
  //   }, [socket, onMessage]);

  // ---------------------------------------------
  return (
     <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="w-full pt-16">
          <ScrollArea className="h-full" type="scroll">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
              {location.pathname === "/dashboard" ? (
                <div className="flex items-center justify-between space-y-2">
                  <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    Welcome {data?.username},&nbsp;&nbsp;here are your highlights
                  </h2>
                </div>
              ) : (
                <></>
              )}
              <Outlet />
            </div>
            <Toaster />
            <ToasterSonner />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </main>
      </div>
    </>
  );
}

