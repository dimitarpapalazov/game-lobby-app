import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { LobbyCreatedEvent } from "../events/lobby-created.event.js";
import { PlayerJoinedLobbyEvent } from "../events/player-joined.event.js";
import { PlayerLeftLobbyEvent } from "../events/player-left-lobby.event.js";

@EventsHandler(LobbyCreatedEvent)
export class LobbyCreatedHandler implements IEventHandler<LobbyCreatedEvent> {
    constructor(@Inject('KAFKA_SERVICE') private readonly kafka: ClientKafka) {}

    async handle(event: LobbyCreatedEvent) {
        this.kafka.emit('lobby.created', event);
    }
}

@EventsHandler(PlayerJoinedLobbyEvent)
export class PlayerJoinedHandler implements IEventHandler<PlayerJoinedLobbyEvent> {
    constructor(@Inject('KAFKA_SERVICE') private readonly kafka: ClientKafka) {}

    async handle(event: PlayerJoinedLobbyEvent) {
        this.kafka.emit('lobby.player.joined', event);
    }
}

@EventsHandler(PlayerLeftLobbyEvent)
export class PlayerLeftHandler implements IEventHandler<PlayerLeftLobbyEvent> {
    constructor(@Inject('KAFKA_SERVICE') private readonly kafka: ClientKafka) {}

    async handle(event: PlayerLeftLobbyEvent) {
        this.kafka.emit('lobby.player.left', event);
    }
}