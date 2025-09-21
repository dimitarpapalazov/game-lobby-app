import { Global, Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Global()
@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'KAFKA_SERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'game-platform',
                        brokers: ['localhost:9092']
                    },
                    consumer: {
                        groupId: 'game-consumer'
                    }
                }
            }
        ])
    ],
    exports: [ClientsModule],
})
export class KafkaModule {}