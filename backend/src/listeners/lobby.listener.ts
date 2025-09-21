import { Controller, Inject, OnModuleInit } from "@nestjs/common";
import { ClientKafka, MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class LobbyListener implements OnModuleInit {
    constructor(@Inject('KAFKA_SERVICE') private readonly kafka: ClientKafka) {}

    async onModuleInit() {
        this.kafka.subscribeToResponseOf('lobby.created');
        this.kafka.subscribeToResponseOf('lobby.player.joined');
        this.kafka.subscribeToResponseOf('lobby.player.left');
        await this.kafka.connect();
    }

    @MessagePattern('lobby.created')
    handleLobbyCreated(@Payload() message: any) {
        console.log('Lobby created:', message.value);
    }

    @MessagePattern('lobby.player.joined')
    handlePlayerJoined(@Payload() message: any) {
        console.log('Player joined:', message.value);
    }

    @MessagePattern('lobby.player.left')
    handlePlayerLeft(@Payload() message: any) {
        console.log('Player left:', message.value);
    }
}