import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateLobbyCommand } from "./commands/create-lobby.command.js";
import { JoinLobbyCommand } from "./commands/join-lobby.command.js";
import { LeaveLobbyCommand } from "./commands/leave-lobby.command.js";
import { GetLobbyQuery } from "./queries/get-lobby.query.js";
import { GetLobbiesQuery } from "./queries/get-lobbies.query.js";

@Injectable()
export class LobbyService {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    async createLobby(name: string, creatorId: number) {
        return this.commandBus.execute(new CreateLobbyCommand(name, creatorId));
    }

    async joinLobby(lobbyId: number, userId: number) {
        return this.commandBus.execute(new JoinLobbyCommand(lobbyId, userId));
    }

    async leaveLobby(lobbyId: number, userId: number) {
        return this.commandBus.execute(new LeaveLobbyCommand(lobbyId, userId));
    }

    async getLobby(lobbyId: number) {
        return this.queryBus.execute(new GetLobbyQuery(lobbyId));
    }

    async getLobbies() {
        return this.queryBus.execute(new GetLobbiesQuery());
    }
}