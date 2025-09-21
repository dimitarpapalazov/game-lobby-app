import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Lobby } from "../../lobby.entity.js";
import { Repository } from "typeorm";
import { User } from "src/modules/user/user.entity.js";
import { LeaveLobbyCommand } from "../leave-lobby.command.js";
import { PlayerLeftLobbyEvent } from "../../events/player-left-lobby.event.js";

@CommandHandler(LeaveLobbyCommand)
export class LeaveLobbyHandler implements ICommandHandler<LeaveLobbyCommand> {
    constructor(
        @InjectRepository(Lobby) private lobbyRepo: Repository<Lobby>,
        private readonly eventBus: EventBus
    ) {}

    async execute(command: LeaveLobbyCommand): Promise<Lobby> {
        const { lobbyId, userId } = command;

        const lobby = await this.lobbyRepo.findOne({
            where: { id: lobbyId },
            relations: ['players']
        });

        if (!lobby) {
            throw new Error('Lobby not found');
        }
        
        lobby.players = lobby.players.filter(player => player.id !== userId);
        const saved = await this.lobbyRepo.save(lobby);
        this.eventBus.publish(new PlayerLeftLobbyEvent(saved.id, userId));
        return saved;
    }
}