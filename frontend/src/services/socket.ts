import { io, type Socket } from "socket.io-client"

let socket: Socket | null = null;

export const getSocket = () => {
    if (socket) {
        return socket;
    }

    socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000', {
        transports: ['websocket'],
        autoConnect: true,
        auth: {
            token: typeof window !== undefined ? localStorage.getItem('token') : null,
        }
    });
    
    return socket;
}