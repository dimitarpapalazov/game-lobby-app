export class CreateLobbyCommand {
    constructor(public readonly name: string, public readonly creatorId: number) {}
}