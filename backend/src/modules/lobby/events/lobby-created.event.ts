export class LobbyCreatedEvent {
    constructor(public readonly lobbyId: number, public readonly name: string) {}
}