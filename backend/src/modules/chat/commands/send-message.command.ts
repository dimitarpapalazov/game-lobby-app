export class SendMessageCommand {
    constructor(public readonly lobbyId: number, public readonly userId: number, public readonly content: string) {}
}