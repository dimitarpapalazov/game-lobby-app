import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { SendMessageCommand } from "../send-message.command.js";
import { Inject } from "@nestjs/common";
import { Lobby } from "../../../lobby/lobby.entity.js";
import { Repository } from "typeorm";
import { ChatMessage } from "../../chat-message.entity.js";
import { User } from "../../../user/user.entity.js";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { SendMessageEvent } from "../../events/send-message.event.js";
import { InjectRepository } from "@nestjs/typeorm";

@CommandHandler(SendMessageCommand)
export class SendMassageHandler implements ICommandHandler<SendMessageCommand> {
    constructor(
        @InjectRepository(ChatMessage) private msgRepo: Repository<ChatMessage>,
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Lobby) private lobbyRepo: Repository<Lobby>,
        private readonly eventBus: EventBus,
        @Inject(CACHE_MANAGER) private cache: Cache,
    ) {}

    async execute(command: SendMessageCommand): Promise<ChatMessage> {
        const { lobbyId, userId, content } = command;
        const lobby = await this.lobbyRepo.findOne({ where: { id: lobbyId }});
        const user = await this.userRepo.findOne({ where: { id: userId }});

        if (!lobby || !user) {
            throw new Error('Lobby or user not found');
        }

        const message = this.msgRepo.create({ lobby, sender: user, content });
        const saved = await this.msgRepo.save(message);
        const key = `chat:lobby:${lobbyId}`;
        let cached = (await this.cache.get<any>(key)) || [];
        cached.push(saved);
        
        if (cached.length > 50) {
            cached = cached.slice(-50);
        }

        await this.cache.set(key, cached, 60_000);
        this.eventBus.publish(new SendMessageEvent(lobbyId, userId, content, saved.createdAt));
        return saved;
    }
}