import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetRecentMessagesQuery } from "../get-recent-messages.query.js";
import { ChatMessage } from "../../chat-message.entity.js";
import { Inject } from "@nestjs/common";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@QueryHandler(GetRecentMessagesQuery)
export class GetRecentMessagesHandler implements IQueryHandler<GetRecentMessagesQuery> {
    constructor(
        @Inject(CACHE_MANAGER) private cache: Cache,
        @InjectRepository(ChatMessage) private msgRepo: Repository<ChatMessage>,
    ) {}

    async execute(query: GetRecentMessagesQuery): Promise<ChatMessage[]> {
        const { lobbyId } = query;
        const key = `chat:lobby:${lobbyId}`;
        const cached = await this.cache.get<any[]>(key);

        if (cached) {
            console.log('Redis hit for recent messages');
            return cached;
        }
        
        const messages = await this.msgRepo.find({
            where: { lobby: { id: lobbyId } },
            relations: ['sender'],
            order: { createdAt: 'DESC' },
            take: 50
        });

        const ordered = messages.reverse();
        await this.cache.set(key, ordered, 60_000);
        return ordered;
    }
}