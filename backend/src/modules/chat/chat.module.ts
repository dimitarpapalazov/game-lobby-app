import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatMessage } from "./chat-message.entity.js";
import { User } from "../user/user.entity.js";
import { Lobby } from "../lobby/lobby.entity.js";
import { ChatService } from "./chat.service.js";
import { GetRecentMessagesHandler } from "./queries/handlers/get-recent-messages.handler.js";
import { SendMassageHandler } from "./commands/handlers/send-message.handler.js";
import { ChatController } from "./chat.controller.js";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "../../kafka/kafka.module.js";
import { SendMessageEventHandler } from "./event-handlers/chat.event-handlers.js";

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessage, User, Lobby]),
    CqrsModule,
    KafkaModule,
  ],
  providers: [
    ChatService,
    SendMassageHandler,
    GetRecentMessagesHandler,
    SendMessageEventHandler,
  ],
  controllers: [ChatController],
})
export class ChatModule {}