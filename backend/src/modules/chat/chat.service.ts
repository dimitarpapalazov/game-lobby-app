import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { SendMessageCommand } from "./commands/send-message.command.js";
import { GetRecentMessagesQuery } from "./queries/get-recent-messages.query.js";

@Injectable()
export class ChatService {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    async sendMessage(lobbyId: number, userId: number, content: string) {
        return this.commandBus.execute(new SendMessageCommand(lobbyId, userId, content));
    }

    async getRecentMessages(lobbyId: number) {
        return this.queryBus.execute(new GetRecentMessagesQuery(lobbyId));
    }
}