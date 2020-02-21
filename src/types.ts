import Sprite from './sprite';

export interface Position {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface Input {
    [key: string]: boolean;
}

export abstract class BaseActor {
    public position: Position;
    public size: Size;
    public id: string;
    public playable: boolean;
    public sprite: Sprite;
    public projectileOwnerId: string;
    public shouldExist: boolean;

    constructor(
        position: Position,
        size: Size,
        sprite: Sprite,
        id: string,
        playable: boolean,
        projectileOwnerId?: string,
    ) {
        this.position = position;
        this.size = size;
        this.id = id;
        this.playable = playable;
        this.sprite = sprite;
        this.sprite.setParent(this);
        this.projectileOwnerId = projectileOwnerId;
        this.shouldExist = true;
    }

    abstract draw(
        ctx: CanvasRenderingContext2D,
        deltaTime: number,
        mouseCoords?: Position,
    ): void;
}

export interface NetworkCallback {
    event: string;
    payload: any;
}

export interface ActorUpdate {
    socketId: string;
    position: Position;
    amplitude: number;
    hp: number;
}

export interface ProjectileSpawn {
    socketId: string;
    position: Position;
    mouseCoords: Position;
}

export interface Ammo {
    loaded: number;
    remaining: number;
}

export interface PlayerInfo {
    socketId: string;
    name: string;
    ready: boolean;
}

export interface LobbyInfo {
    playerInfo: PlayerInfo;
    players: PlayerInfo[];
}
