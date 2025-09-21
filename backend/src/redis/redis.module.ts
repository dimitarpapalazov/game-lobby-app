import { CacheModule } from "@nestjs/cache-manager";
import { Global, Module } from "@nestjs/common";
import { redisStore } from "cache-manager-redis-store";

@Module({
    imports: [
        CacheModule.registerAsync({
            isGlobal: true,
            useFactory: async () => ({
                store: await redisStore({
                    socket: { host: 'localhost', port: 6379 },
                    ttl: 60
                })
            })
        })
    ],
    exports: [CacheModule]
})

export class RedisModule {}