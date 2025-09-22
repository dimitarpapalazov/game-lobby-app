import { Body, Controller, Get, Param, Post, Request } from "@nestjs/common";
import { ChatService } from "./chat.service.js";

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post(':lobbyId')
    async sendMessage(
        @Param('lobbyId') lobbyId: number,
        @Body('userId') userId: number,
        @Body('content') content: string,
    ) {
        return this.chatService.sendMessage(lobbyId, userId, content);
    }

    @Get(':lobbyId')
    async getRecentMessages(@Param('lobbyId') lobbyId: number) {
        return this.chatService.getRecentMessages(lobbyId);
    }
}