import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { LobbyService } from "./lobby.service.js";

@Controller('lobbies')
export class LobbyController {
    constructor (private readonly lobbyService: LobbyService) {}

    @Post('create')
    async createLobby(@Body() body: { name: string, creatorId: number }) {
        return this.lobbyService.createLobby(body.name, body.creatorId);
    }

    @Post(':id/join')
    async joinLobby(@Param('id') id: number, @Body('userId') userId: number) {
        return this.lobbyService.joinLobby(id, userId);
    }

    @Post(':id/leave')
    async leaveLobby(@Param('id') id: number, @Body('userId') userId: number) {
        return this.lobbyService.leaveLobby(id, userId);
    }

    @Get()
    async getLobbies() {
        return this.lobbyService.getLobbies();
    }

    @Get(':id')
    async getLobby(@Param('id') id: number) {
        return this.lobbyService.getLobby(id);
    }
}