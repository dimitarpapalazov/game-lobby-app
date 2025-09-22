import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SendMessageEvent } from "../events/send-message.event.js";
import { Inject } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

@EventsHandler(SendMessageEvent)
export class SendMessageEventHandler implements IEventHandler<SendMessageEvent> {
    constructor(@Inject('KAFKA_SERVICE') private readonly kafka: ClientKafka) {}

    async handle(event: SendMessageEvent) {
        this.kafka.emit('chat.message.sent', event)
    }
}