import {
    createContext,
    useState,
    useEffect,
    ReactNode,
    useContext,
} from "react";


const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;
export const SocketContext = createContext<WebSocket | null>(null);

export const useWebsocket = () => {
    const socket = useContext(SocketContext);
    return socket;
};

export const WebsocketContext = ({ children }: { children: ReactNode }) => {
    const [ws, setWs] = useState<WebSocket>(() => {
        const accessToken = localStorage.getItem("accessToken");
        return new WebSocket(`${websocketUrl}/${accessToken}`);
    });
    const accessToken = localStorage.getItem("accessToken") ?
        localStorage.getItem("accessToken") : null;
    const url = `${websocketUrl}/${accessToken}`;
    const [retryCount, setRetryCount] = useState<number>(0);


    useEffect(() => {
        const onClose = () => {
            if (retryCount < 10) {
                setTimeout(() => {
                    setWs(new WebSocket(url));
                    setRetryCount(retryCount + 1);
                }, 1000);
            }
        };

        ws.addEventListener("close", onClose);

        return () => {
            ws.removeEventListener("close", onClose);
        };
    }, [ws, setWs]);

    return (
    <SocketContext.Provider value={ws}>
        {children}
    </SocketContext.Provider>);
};
