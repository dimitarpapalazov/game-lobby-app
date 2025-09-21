import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module.js';
import { RedisModule } from './redis/redis.module.js';
import { LobbyModule } from './modules/lobby/lobby.module.js';

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
    LobbyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
