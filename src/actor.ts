import { Position, Size, BaseActor, Ammo } from './types';
import Sprite from './sprite';

export default class Actor extends BaseActor {
    public sprite: Sprite;
    public movementSpeed: number;
    public hp: number;
    public audio: HTMLAudioElement;
    public ammo: Ammo;
    public name: string;
    private reloadDelay: number;
    private isReloading: boolean;

    constructor(
        position: Position = { x: 0, y: 0 },
        size: Size = { width: 30, height: 30 },
        sprite: Sprite,
        id: string,
        name: string,
        playable: boolean = false
    ) {
        super(position, size, sprite, id, playable);

        this.movementSpeed = 200;
        this.hp = 100;
        this.ammo = {
            loaded: 1,
            remaining: 30
        }
        this.reloadDelay = 1000;
        this.name = name;
    }

    draw(ctx: CanvasRenderingContext2D, dtime?: number, mouseCoords?: Position): void {
        ctx.save();
        // draw name
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(
            this.name,
            this.position.x,
            this.position.y - this.size.height / 2,
            100
        );

        // draw healthbar
        ctx.fillStyle = 'red';
        ctx.fillRect(
            this.position.x + this.size.width / 2 - 25,
            this.position.y - this.size.height / 2.8,
            this.hp / 2,
            5
        );
        ctx.strokeRect(
            this.position.x + this.size.width / 2 - 25 - 2,
            this.position.y - this.size.height / 2.8 - 1,
            52,
            7
        );

        this.sprite.rotateDraw(ctx, mouseCoords);
        
        ctx.restore();
    }

    private move(x: number, y: number): void {
        // check borders
        if (this.position.x + x + this.size.width > window.innerWidth ||
            this.position.x + x < 0 ||
            this.position.y + y + this.size.height > window.innerHeight ||
            this.position.y + y < 0
        ) {
            return;
        }

        this.position.x += x;
        this.position.y += y;
    }

    public moveLeft(dtime: number): void {
        this.move(-(dtime * this.movementSpeed), 0);
    }
    public moveRight(dtime: number): void {
        this.move(dtime * this.movementSpeed, 0);
    }
    public moveUp(dtime: number): void {
        this.move(0, -(dtime * this.movementSpeed));
    }
    public moveDown(dtime: number): void {
        this.move(0, dtime * this.movementSpeed);
    }

    public registerHit(damage: number): void {
        this.hp -= damage;
    }

    public depleteAmmo(): void {
        this.ammo.loaded = 0;
    }

    public reload(audio: HTMLAudioElement): void {
        if (!this.ammo.loaded && this.ammo.remaining && !this.isReloading) {
            this.isReloading = true;
            audio.play();
            setTimeout(() => {
                this.ammo = {
                    loaded: 1,
                    remaining: --this.ammo.remaining
                }
                this.isReloading = false;
            }, this.reloadDelay);
        }
    }

    public reanimate(): void {
        this.hp = 100;
        this.shouldExist = true;
        this.ammo = {
            loaded: 1,
            remaining: 30
        }
        this.size = {
            width: 60,
            height: 60
        }
    }
}