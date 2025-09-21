import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Lobby } from "../../lobby.entity.js";
import { Repository } from "typeorm";
import { GetLobbiesQuery } from "../get-lobbies.query.js";

@QueryHandler(GetLobbiesQuery)
export class GetLobbiesHandler implements IQueryHandler<GetLobbiesQuery> {
    constructor(@InjectRepository(Lobby) private lobbyRepo: Repository<Lobby>) {}

    async execute(_: GetLobbiesQuery): Promise<Lobby[]> {
        return this.lobbyRepo.find({ relations: ['players'] });
    }
}