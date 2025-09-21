import { Controller, Inject, OnModuleInit } from "@nestjs/common";
import { ClientKafka, MessagePattern, Payload } from "@nestjs/microservices";
import { LobbyGateway } from "../gateway/lobby.gateway.js";

@Controller()
export class LobbyListener implements OnModuleInit {
    constructor(
        @Inject('KAFKA_SERVICE') private readonly kafka: ClientKafka,
        private readonly lobbyGateway: LobbyGateway
    ) {}

    async onModuleInit() {
        this.kafka.subscribeToResponseOf('lobby.created');
        this.kafka.subscribeToResponseOf('lobby.player.joined');
        this.kafka.subscribeToResponseOf('lobby.player.left');
        await this.kafka.connect();
    }

    @MessagePattern('lobby.created')
    handleLobbyCreated(@Payload() message: any) {
        console.log('Lobby created:', message.value);
        this.lobbyGateway.emit('lobby.created', message.value);
    }

    @MessagePattern('lobby.player.joined')
    handlePlayerJoined(@Payload() message: any) {
        console.log('Player joined:', message.value);
        this.lobbyGateway.emit('lobby.player.joined', message.value);
    }

    @MessagePattern('lobby.player.left')
    handlePlayerLeft(@Payload() message: any) {
        console.log('Player left:', message.value);
        this.lobbyGateway.emit('lobby.player.left', message.value);
    }
}