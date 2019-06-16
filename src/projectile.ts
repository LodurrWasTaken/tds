import { BaseActor, Position, Size } from './types';
import Sprite from './sprite';

export default class Projectile extends BaseActor {
    public coords: Position;
    public movementSpeed: number;
    public damage: number;

    constructor(position: Position, size: Size, coords: Position, sprite: Sprite, id: string) {
        super(position, size, sprite, id + Math.random().toString(36).substr(2, 9), false, id);

        this.coords = coords;
        this.movementSpeed = 900;
        this.damage = 25;
    }

    draw(ctx: CanvasRenderingContext2D, dtime: number): void {
        ctx.save();

        this.sprite.rotateDraw(ctx, this.coords);

        let vector = {
            x: this.coords.x - this.position.x,
            y: this.coords.y - this.position.y
        };
        let magnitude = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
        let velocity = {
            x: this.movementSpeed / magnitude * vector.x,
            y: this.movementSpeed / magnitude * vector.y
        };

        this.position.x += velocity.x * dtime;
        this.position.y += velocity.y * dtime;

        this.coords.x += velocity.x * dtime;
        this.coords.y += velocity.y * dtime;

        ctx.restore();
    }
}