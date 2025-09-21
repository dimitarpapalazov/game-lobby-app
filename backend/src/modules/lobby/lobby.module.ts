import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Lobby } from "./lobby.entity.js";
import { User } from "../user/user.entity.js";
import { CqrsModule } from "@nestjs/cqrs";
import { LobbyService } from "./lobby.service.js";
import { CreateLobbyHandler } from "./commands/handlers/create-lobby.handler.js";
import { JoinLobbyHandler } from "./commands/handlers/join-lobby.handler.js";
import { LeaveLobbyHandler } from "./commands/handlers/leave-lobby.handler.js";
import { GetLobbiesHandler } from "./queries/handlers/get-lobbies.handler.js";
import { LobbyController } from "./lobby.controller.js";
import { GetLobbyHandler } from "./queries/handlers/get-lobby.handler.js";
import { KafkaModule } from "../../kafka/kafka.module.js";
import { LobbyCreatedHandler, PlayerJoinedHandler, PlayerLeftHandler } from "./event-handlers/lobby.event-handlers.js";

@Module({
    imports: [TypeOrmModule.forFeature([Lobby, User]), CqrsModule, KafkaModule],
    providers: [
        LobbyService,
        CreateLobbyHandler,
        JoinLobbyHandler,
        LeaveLobbyHandler,
        GetLobbyHandler,
        GetLobbiesHandler,
        LobbyCreatedHandler,
        PlayerJoinedHandler,
        PlayerLeftHandler
    ],
    controllers: [LobbyController]
})
export class LobbyModule {}