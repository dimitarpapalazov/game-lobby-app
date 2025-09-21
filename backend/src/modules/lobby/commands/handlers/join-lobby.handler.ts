import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Lobby } from "../../lobby.entity.js";
import { Repository } from "typeorm";
import { User } from "../../../user/user.entity.js";
import { JoinLobbyCommand } from "../join-lobby.command.js";

@CommandHandler(JoinLobbyCommand)
export class JoinLobbyHandler implements ICommandHandler<JoinLobbyCommand> {
    constructor(
        @InjectRepository(Lobby) private lobbyRepo: Repository<Lobby>,
        @InjectRepository(User) private userRepo: Repository<User>
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
        return this.lobbyRepo.save(lobby);
    }
}