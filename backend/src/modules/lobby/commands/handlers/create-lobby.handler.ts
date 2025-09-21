import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CreateLobbyCommand } from "../create-lobby.command.js";
import { InjectRepository } from "@nestjs/typeorm";
import { Lobby } from "../../lobby.entity.js";
import { Repository } from "typeorm";
import { User } from "../../../user/user.entity.js";
import { LobbyCreatedEvent } from "../../events/lobby-created.event.js";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject } from "@nestjs/common";

@CommandHandler(CreateLobbyCommand)
export class CreateLobbyHandler implements ICommandHandler<CreateLobbyCommand> {
    constructor(
        @InjectRepository(Lobby) private lobbyRepo: Repository<Lobby>,
        @InjectRepository(User) private userRepo: Repository<User>,
        private readonly eventBus: EventBus,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async execute(command: CreateLobbyCommand): Promise<Lobby> {
        const { name, creatorId } = command;
        const creator = await this.userRepo.findOne({ where: { id: creatorId }});

        if (!creator) {
            throw new Error('User not found');
        }

        const lobby = this.lobbyRepo.create({ name, players: [creator] });
        const saved = await this.lobbyRepo.save(lobby);
        this.eventBus.publish(new LobbyCreatedEvent(saved.id, saved.name));
        await this.cacheManager.set(`lobby:${saved.id}`, saved, 60_000);
        return saved;
    }
}