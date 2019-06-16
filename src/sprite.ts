import { Position, BaseActor } from './types';
import Projectile from './projectile';

export default class Sprite {
    private sprite: HTMLImageElement;
    public parent: BaseActor;
    public amplitude: number;

    constructor(spriteSrc: string, amplitude: number = 0) {
        this.sprite = new Image();
        this.sprite.src = spriteSrc;
        this.amplitude = amplitude;
    }

    public rotateDraw(ctx: CanvasRenderingContext2D, mouseCoords: Position, amplitude?: number): void {
        ctx.translate(
            this.parent.position.x + this.parent.size.width / 2,
            this.parent.position.y + this.parent.size.height / 2
        );

        if (this.parent.playable || this.parent instanceof Projectile) {
            this.amplitude = Math.atan2(
                mouseCoords.y - (this.parent.position.y + this.parent.size.height / 2),
                mouseCoords.x - (this.parent.position.x + this.parent.size.width / 2)
            );
        }

        ctx.rotate(this.amplitude);
        ctx.drawImage(
            this.sprite,
            -(this.parent.size.width / 2),
            -(this.parent.size.height / 2),
            this.parent.size.width,
            this.parent.size.height
        );
    }

    public setParent(actor: BaseActor): void {
        this.parent = actor;
    }
}