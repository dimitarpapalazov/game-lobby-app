import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
@Injectable()
export class LobbyGateway {
    @WebSocketServer()
    server: Server;

    emit(event: string, data: any) {
        this.server.emit(event, data);
    }
}