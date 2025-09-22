export class SendMessageEvent {
    constructor(
        public readonly lobbyId: number, 
        public readonly userId: number,
        public readonly content: string,
        public readonly createdAt: Date,
    ) {}
}