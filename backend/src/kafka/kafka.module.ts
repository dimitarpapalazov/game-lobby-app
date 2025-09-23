import { Global, Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

const kafkaBrokers = (process.env.KAFKA_BROKER || 'kafka:9092').split(',');

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
                        brokers: kafkaBrokers
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