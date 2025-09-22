import { Body, Controller, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../user/guards/jwt-auth.guard.js";
import { ChatService } from "./chat.service.js";

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post(':lobbyId')
    async sendMessage(
        @Param('lobbyId') lobbyId: number,
        @Request() req,
        @Body('content') content: string,
    ) {
        return this.chatService.sendMessage(lobbyId, req.user.id, content);
    }

    @Get(':lobbyId')
    async getRecentMessages(@Param('lobbyId') lobbyId: number) {
        return this.chatService.getRecentMessages(lobbyId);
    }
}