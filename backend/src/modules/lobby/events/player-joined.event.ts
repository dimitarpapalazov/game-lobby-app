export class PlayerJoinedLobbyEvent {
    constructor(public readonly lobbyId: number, public readonly userId: number) {}
}