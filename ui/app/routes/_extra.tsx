// import { WebsocketContext } from './websocket-context';

// export default function DashboardLayout() {
//   const location = useLocation();
//   const { username } = useAuthContext();

//   return (
//     <WebsocketContext>
//       <SocketComponent>
//         <Header />
//         <div className="flex h-screen overflow-hidden">
//           <Sidebar />
//           <main className="w-full pt-16">
//             <ScrollArea className="h-full">
//               <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//                 {location.pathname === "/dashboard" && (
//                   <div className="flex items-center justify-between space-y-2">
//                     <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
//                       Welcome {username},&nbsp;&nbsp;here are your highlights
//                     </h2>
//                   </div>
//                 )}
//                 <Outlet />
//               </div>
//               <ToastContainer />
//             </ScrollArea>
//           </main>
//         </div>
//       </SocketComponent>
//     </WebsocketContext>
//   );
// }

// function SocketComponent({ children }: { children: ReactNode }) {
//   const socket = useWebsocket();
  
//   const onMessage = useCallback((message: any) => {
//     const data = JSON.parse(message?.data);
//     console.log(data);
//   }, []);

//   useEffect(() => {
//     socket?.addEventListener("message", onMessage);
//     socket?.addEventListener("error", err => console.log(err));
    
//     return () => {
//       socket?.removeEventListener("message", onMessage);
//     };
//   }, [socket, onMessage]);

//   return <>{children}</>;
// }