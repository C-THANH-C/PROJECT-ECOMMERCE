import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store'
@Global()
@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                store: redisStore,
                host: configService.get("HOST_REDIS"),
                port: configService.get("PORT_REDIS"),
                auth_pass: configService.get("PASS_REDIS"),
                ttl: 60
            }
            ),
            inject: [ConfigService],
            isGlobal: true
        })
    ],
    exports: [CacheModule]
})
export class RedisModule { }
