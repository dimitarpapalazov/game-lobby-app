import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Lobby } from "../lobby/lobby.entity.js";
import { User } from "../user/user.entity.js";

@Entity()
export class ChatMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Lobby, (lobby) => lobby.id, { onDelete: 'CASCADE' })
    lobby: Lobby;

    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
    sender: User;

    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date;
}