import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Lobby } from "../../lobby.entity.js";
import { Repository } from "typeorm";
import { User } from "src/modules/user/user.entity.js";
import { LeaveLobbyCommand } from "../leave-lobby.command.js";

@CommandHandler(LeaveLobbyCommand)
export class LeaveLobbyHandler implements ICommandHandler<LeaveLobbyCommand> {
    constructor(@InjectRepository(Lobby) private lobbyRepo: Repository<Lobby>) {}

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
        return this.lobbyRepo.save(lobby);
    }
}