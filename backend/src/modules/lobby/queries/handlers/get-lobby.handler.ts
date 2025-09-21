import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetLobbyQuery } from "../get-lobby.query.js";
import { InjectRepository } from "@nestjs/typeorm";
import { Lobby } from "../../lobby.entity.js";
import { Repository } from "typeorm";
import { Inject } from "@nestjs/common";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";

@QueryHandler(GetLobbyQuery)
export class GetLobbyHandler implements IQueryHandler<GetLobbyQuery> {
    constructor(
        @InjectRepository(Lobby) private lobbyRepo: Repository<Lobby>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async execute(query: GetLobbyQuery): Promise<Lobby|null> {
        const cached = await this.cacheManager.get<Lobby>(`lobby:${query.lobbyId}`);

        if (cached) {
            console.log('Redis hit for lobby', query.lobbyId);
            return cached;
        }

        const lobby = await this.lobbyRepo.findOne({
            where: { id: query.lobbyId },
            relations: ['players']
        });

        if (lobby) {
            await this.cacheManager.set(`lobby:${query.lobbyId}`, lobby, 60_000);
        }

        return lobby;
    }
}