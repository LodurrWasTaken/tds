import * as io from './assets/lib/socket.io';
import { ActorUpdate, ProjectileSpawn, PlayerInfo, LobbyInfo } from './types';

export default class Network {
    static client: SocketIOClient.Socket;

    static connect(url: string, cb: Function): void {
        this.client = io(url);
        this.client.on('connect', () => {
            cb({
                event: 'connect',
                payload: this.client.id
            });
        });
        this.client.on('createLobby', (playerInfo: PlayerInfo) => {
            cb({
                event: 'createLobby',
                payload: playerInfo
            });
        });
        this.client.on('newPlayer', (player: PlayerInfo) => {
            cb({
                event: 'newPlayer',
                payload: player
            });
        });
        this.client.on('newLobby', (lobbyId: string) => {
            cb({
                event: 'newLobby',
                payload: [lobbyId]
            });
        });
        this.client.on('joinLobby', (payload: LobbyInfo) => {
            cb({
                event: 'joinLobby',
                payload
            });
        });
        this.client.on('onConnection', (rooms: string[]) => {
            cb({
                event: 'onConnection',
                payload: rooms
            });
        });
        this.client.on('onDisconnect', (socketId: string) => {
            cb({
                event: 'onDisconnect',
                payload: socketId
            });
        });
        this.client.on('actorUpdate', (payload: ActorUpdate) => {
            cb({
                event: 'actorUpdate',
                payload
            });
        });
        this.client.on('projectileSpawn', (payload: ProjectileSpawn) => {
            cb({
                event: 'projectileSpawn',
                payload
            });
        });
        this.client.on('playerReady', (playerName: string) => {
            cb({
                event: 'playerReady',
                payload: playerName
            });
        });
    }

    static sendUpdate(payload: ActorUpdate): void {
        this.client.emit('actorUpdate', payload);
    }

    static sendSpawn(payload: ProjectileSpawn): void {
        this.client.emit('projectileSpawn', payload);
    }

    static createLobby(playerName: string): void {
        this.client.emit('createLobby', playerName);
    }

    static joinLobby(lobbyName: string, playerName: string): void {
        this.client.emit('joinLobby', { lobbyId: lobbyName, name: playerName });
    }

    static updateReadyStatus(playerName: string): void {
        this.client.emit('playerReady', playerName);
    }
}