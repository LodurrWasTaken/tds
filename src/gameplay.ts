export default class Gameplay {
    public beginPlay: boolean;
    public playersReady: { [key: string]: number };
    public scores: { [key: string]: number };
    public round: number;
    public isRestarting: boolean;
    private playersAlive: { [key: string]: boolean };

    constructor() {
        this.beginPlay = false;
        this.round = 0;
        this.playersReady = {};
        this.playersAlive = {};
        this.scores = {};
        this.isRestarting = false;
    }

    public addPlayer(playerName: string): void {
        this.playersAlive[playerName] = true;
        this.playersReady[playerName] = 0;
        this.scores[playerName] = 0;
    }

    public removePlayersAlive(playerName: string): void {
        this.playersAlive[playerName] = false;
    }
    public addPlayersAlive(playerName: string): void {
        this.playersAlive[playerName] = true;
    }

    public setReady(name: string): void {
        this.playersReady[name] = 1;
    }

    public isReady(): boolean {
        let values = Object.values(this.playersReady);
        let sum = values.reduce((acc: number, val: number) => acc + val, 0);

        return sum === values.length;
    }

    public getPlayersAliveLength(): number {
        return Object.values(this.playersAlive).reduce(
            (count: number, isAlive: boolean) => (isAlive ? ++count : count),
            0,
        );
    }

    public getPlayersLength(): number {
        return Object.keys(this.playersAlive).length;
    }

    public addScore(playerName: string): void {
        this.scores[playerName]++;
    }
}
