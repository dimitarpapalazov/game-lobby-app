import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetLobbyQuery } from "../get-lobby.query.js";
import { InjectRepository } from "@nestjs/typeorm";
import { Lobby } from "../../lobby.entity.js";
import { Repository } from "typeorm";

@QueryHandler(GetLobbyQuery)
export class GetLobbyHandler implements IQueryHandler<GetLobbyQuery> {
    constructor(@InjectRepository(Lobby) private lobbyRepo: Repository<Lobby>) {}

    async execute(query: GetLobbyQuery): Promise<Lobby|null> {
        return this.lobbyRepo.findOne({
            where: { id: query.lobbyId },
            relations: ['players']
        });
    }
}