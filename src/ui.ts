import { Position } from './types';

export default class UI {
    static rooms = document.getElementById('rooms');
    static mainScreen = document.getElementById('main-screen');
    static createLobbyBtn = document.getElementById('createLobbyBtn');
    static nameInput = document.getElementById('name');
    static waitingRoom = document.getElementById('waiting-room');
    static readyBtn = document.getElementById('ready-btn');
    static playersList = document.getElementById('players');
    static colorSelect = document.getElementById('color');
    static scoreboard = document.getElementById('scoreboard');

    static colors = ['pink', 'green', 'blue', 'yellow'];

    static hideMainScreen() {
        this.mainScreen.classList.add('hidden');
    }

    static fillRooms(rooms: string[]): void {
        rooms.forEach((room: string) => {
            this.rooms.insertAdjacentHTML('beforeend', `<li>${room}</li>`);
        });
    }

    static fillWaitingRoom(players: {[key: string]: number}): void {
        this.playersList.innerHTML = '';
        for (let key in players) {
            this.playersList.insertAdjacentHTML('beforeend', `<li>${key}<span class="${players[key] ? 'green' : 'red'}">${players[key] ? 'READY' : 'NOT READY'}</span></li>`);
        }
    }

    static showWaitingRoom(): void {
        this.waitingRoom.classList.remove('hidden');
    }

    static hideWaitingRoom(): void {
        this.waitingRoom.classList.add('hidden');
    }

    static drawEndScreen(ctx: CanvasRenderingContext2D, position: Position): void {
        ctx.save();
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText('YOU DIED', position.x , position.y);
        ctx.restore();
    }

    static drawAmmo(ctx: CanvasRenderingContext2D, text: string, position: Position): void {
        ctx.save();
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText(
            text,
            position.x,
            position.y
        );
        ctx.restore();
    }

    static getPlayerName(): string {
        return (<HTMLInputElement>this.nameInput).value;
    }

    static drawRound(ctx: CanvasRenderingContext2D, round: number, position: Position): void {
        ctx.save();
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText(
            `ROUND ${round}`,
            position.x,
            position.y
        );
        ctx.restore();
    }

    static showScoreboard(scores: { [key: string]: number }, mainPlayer: string): void {
        if (this.scoreboard.classList.contains('hidden')) {
            this.scoreboard.classList.remove('hidden');
            let content = '';
            for (let playerName in scores) {
                if (playerName !== mainPlayer) {
                    content += `<li><span>${playerName}</span><span>${scores[playerName]}</span></li>`
                } else {
                    content += `<li class="red"><span>${playerName}</span><span>${scores[playerName]}</span></li>`
                }
            }
            this.scoreboard.innerHTML = content;
        }
    }
    static hideScoreboard(): void {
        if (!this.scoreboard.classList.contains('hidden')) {
            this.scoreboard.classList.add('hidden');
        }
    }
}