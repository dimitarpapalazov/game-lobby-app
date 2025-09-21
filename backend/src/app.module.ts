import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module.js';
import { RedisModule } from './redis/redis.module.js';
import { LobbyModule } from './modules/lobby/lobby.module.js';
import { LobbyGateway } from './gateway/lobby.gateway.js';
import { LobbyListener } from './listeners/lobby.listener.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    RedisModule,
    LobbyModule,
  ],
  controllers: [AppController, LobbyListener],
  providers: [AppService, LobbyGateway],
})
export class AppModule {}
