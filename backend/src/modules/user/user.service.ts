import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity.js";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "node_modules/bcryptjs/index.js";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>, 
        private jwtService: JwtService,
        @Inject(CACHE_MANAGER) private readonly redisClient: Cache) 
        {}

    async createUser(email: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({ email, password: hashedPassword });
        return this.userRepository.save(user);
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        return isPasswordValid ? user : null;
    }

    async login(user: User) {
        const payload = { sub: user.id, email: user.email };
        const access_token = this.jwtService.sign(payload);
        this.redisClient.set(`user:${user.id}:token`, access_token, 3600);
        return { access_token, userId: user.id };
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async logout(userId: number) {
        this.redisClient.del(`user:${userId}:token`);
        return { message: 'Logged out successfully' };
    }

    async isTokenValid(userId: number, token: string): Promise<boolean> {
        const storedToken = await this.redisClient.get(`user:${userId}:token`);
        return storedToken === token;
    }
}