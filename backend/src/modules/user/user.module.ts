import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity.js";
import { JwtModule } from "@nestjs/jwt";
import { UserController } from "./user.controller.js";
import { UserService } from "./user.service.js";

@Module({
    imports:[
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: 'your_jwt_secret', // replace with env variable later
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})

export class UserModule {};