import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { User } from "../user/user.entity.js";

@Entity()
export class Lobby {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ default: false })
    isActive: boolean

    @ManyToMany(() => User)
    @JoinTable()
    players: User[];
}