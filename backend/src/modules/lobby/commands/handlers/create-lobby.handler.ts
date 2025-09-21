import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateLobbyCommand } from "../create-lobby.command.js";
import { InjectRepository } from "@nestjs/typeorm";
import { Lobby } from "../../lobby.entity.js";
import { Repository } from "typeorm";
import { User } from "../../../user/user.entity.js";

@CommandHandler(CreateLobbyCommand)
export class CreateLobbyHandler implements ICommandHandler<CreateLobbyCommand> {
    constructor(
        @InjectRepository(Lobby) private lobbyRepo: Repository<Lobby>,
        @InjectRepository(User) private userRepo: Repository<User>
    ) {}

    async execute(command: CreateLobbyCommand): Promise<Lobby> {
        const { name, creatorId } = command;
        const creator = await this.userRepo.findOne({ where: { id: creatorId }});

        if (!creator) {
            throw new Error('User not found');
        }

        const lobby = this.lobbyRepo.create({ name, players: [creator] });
        return this.lobbyRepo.save(lobby);
    }
}