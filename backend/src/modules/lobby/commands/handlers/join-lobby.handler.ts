import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Lobby } from "../../lobby.entity.js";
import { Repository } from "typeorm";
import { User } from "../../../user/user.entity.js";
import { JoinLobbyCommand } from "../join-lobby.command.js";
import { PlayerJoinedLobbyEvent } from "../../events/player-joined.event.js";

@CommandHandler(JoinLobbyCommand)
export class JoinLobbyHandler implements ICommandHandler<JoinLobbyCommand> {
    constructor(
        @InjectRepository(Lobby) private lobbyRepo: Repository<Lobby>,
        @InjectRepository(User) private userRepo: Repository<User>,
        private readonly eventBus: EventBus
    ) {}

    async execute(command: JoinLobbyCommand): Promise<Lobby> {
        const { lobbyId, userId } = command;

        const lobby = await this.lobbyRepo.findOne({
            where: { id: lobbyId },
            relations: ['players']
        });

        if (!lobby) {
            throw new Error('Lobby not found');
        }

        const user = await this.userRepo.findOne({ where: { id: userId }});

        if (!user) {
            throw new Error('User not found');
        }

        lobby.players.push(user);
        const saved = await this.lobbyRepo.save(lobby);
        this.eventBus.publish(new PlayerJoinedLobbyEvent(saved.id, user.id));
        return saved;
    }
}