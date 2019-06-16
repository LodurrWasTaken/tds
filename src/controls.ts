import { Input, Position } from './types';

export default class Controls {
    public input: Input;
    public mouseCoords: Position;
    private clicked: boolean;
    private delay: number;
    private shouldWait: boolean;

    constructor() {
        this.input = {};
        this.mouseCoords = { x: 0, y: 0 };
        this.delay = 1400;
        this.shouldWait = false;

        document.addEventListener('keydown', e => {
            if (e.code === 'Tab') e.preventDefault();
            this.input[e.code] = true;
        });

        document.addEventListener('keyup', e => {
            this.input[e.code] = false;
        });

        document.addEventListener('mousemove', e => {
            this.mouseCoords.x = e.clientX;
            this.mouseCoords.y = e.clientY;
        });

        document.addEventListener('click', e => {
            if ((<HTMLElement>e.target).tagName === 'CANVAS') {
                this.clicked = true;
            }
        });
    }

    public isKeyPressed(key: string): boolean {
        return this.input[key];
    }

    public onClick(cb: Function): void {
        if (this.clicked) {
            cb(this.mouseCoords.x, this.mouseCoords.y, this.shouldWait);
            this.clicked = false;
        }
    }
}