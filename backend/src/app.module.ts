import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module.js';
import { RedisModule } from './redis/redis.module.js';
import { LobbyModule } from './modules/lobby/lobby.module.js';
import { LobbyGateway } from './gateway/lobby.gateway.js';
import { LobbyListener } from './listeners/lobby.listener.js';
import { ChatModule } from './modules/chat/chat.module.js';

const username = process.env.POSTGRES_USER || 'postgres';
const password = process.env.POSTGRES_PASSWORD || 'postgres';
const database = process.env.POSTGRES_DB || 'postgres';
const url = process.env.DATABASE_URL;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username,
      password,
      database,
      autoLoadEntities: true,
      synchronize: true,
      url
    }),
    UserModule,
    RedisModule,
    LobbyModule,
    ChatModule
  ],
  controllers: [AppController, LobbyListener],
  providers: [AppService, LobbyGateway],
})
export class AppModule {}
