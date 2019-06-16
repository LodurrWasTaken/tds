import Controls from './controls';
import { BaseActor, Position } from './types';
import Projectile from './projectile';
import Actor from './actor';
import Gameplay from './gameplay';

export default class Engine {
    static canvas: HTMLCanvasElement;
    static ctx: CanvasRenderingContext2D;
    static actors: BaseActor[];
    static update: Function;
    static controls: Controls;
    static lastTime: number;
    static playerPositions: Array<Position>;
    static gameplay: Gameplay;

    static initialize(): void {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 1200;
        this.canvas.height = 700;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.lastTime = Date.now();

        this.actors = [];
        this.update = null;

        this.playerPositions = [
            { x: 40, y: 40 },
            { x: this.canvas.width - 100, y: 40 },
            { x: this.canvas.width - 100, y: this.canvas.height - 100 },
            { x: 40, y: this.canvas.height - 100 }
        ];

        this.controls = new Controls();
        this.gameplay = new Gameplay();

        this.tick();
    }

    static tick(): void {
        // background
        this.ctx.fillStyle = '#303030';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        let newTime = Date.now();
        let dtime = (newTime - this.lastTime) / 1000;

        this.actors.forEach((actor, i) => {
            if (actor instanceof Projectile) {
                // check borders
                // destroy projectile if out of boundaries
                if (actor.position.x + actor.size.width > this.canvas.width ||
                    actor.position.x < 0 ||
                    actor.position.y + actor.size.height > this.canvas.height ||
                    actor.position.y < 0
                ) {
                    actor.shouldExist = false;
                    actor = null;
                    this.actors.splice(i, 1);
                    return;
                }
            }
            if (actor instanceof Actor) {
                !actor.shouldExist ? this.gameplay.removePlayersAlive(actor.name) : this.gameplay.addPlayersAlive(actor.name);
            }
            if (actor.shouldExist) {
                actor.draw(this.ctx, dtime, this.controls.mouseCoords);
            }
        });

        if (this.update) {
            this.update(dtime, this.ctx);
        }
        
        // first round hardcode
        if (
            !this.gameplay.isRestarting
            && !this.gameplay.beginPlay
            && this.gameplay.getPlayersAliveLength() > 1
        ) {
            if (this.gameplay.isReady()) {
                this.gameplay.isRestarting = true;
                this.gameplay.round++;
                setTimeout(() => {
                    this.gameplay.beginPlay = true;
                    this.gameplay.isRestarting = false;
                }, 3000);
            }
        }

        this.lastTime = newTime;
        window.requestAnimationFrame(this.tick.bind(this));
    }

    static addActor(actor: BaseActor): void {
        this.actors.push(actor);
        if (actor instanceof Actor) {
            this.gameplay.addPlayersAlive(actor.name);
        }
    }

    static removeActor(actorId: string): void {
        for (let i = 0; i < this.actors.length; i++) {
            if (this.actors[i].id === actorId) {
                this.actors[i] = null;
                this.actors.splice(i, 1);
            }
        }
    }

    static restart(): void {
        this.gameplay.round++;
        this.gameplay.beginPlay = false;

        for (let i = 0; i < this.actors.length; i++) {
            this.actors[i].position = this.playerPositions[i];
        }

        setTimeout(() => {
            for (let i = 0; i < this.actors.length; i++) {
                if (this.actors[i] instanceof Actor) {
                    (<Actor>this.actors[i]).reanimate();
                }
            }
            this.gameplay.beginPlay = true;
            this.gameplay.isRestarting = false;
        }, 3000);
    }
}