import Engine from './engine';
import Network from './network';
import Actor from './actor';
import Sprite from './sprite';
import Projectile from './projectile';
import { NetworkCallback, ActorUpdate, ProjectileSpawn, PlayerInfo, LobbyInfo, BaseActor } from './types';
import Sound from './sound';
import UI from './ui';
import { HOST, PORT } from './config/env';

Engine.initialize();

UI.createLobbyBtn.addEventListener('click', () => {
    Network.createLobby(UI.getPlayerName());
});
UI.rooms.addEventListener('click', (e: any) => {
    if (e.target.tagName === 'LI') {
        Network.joinLobby(e.target.innerText, UI.getPlayerName());
    }
});
UI.readyBtn.addEventListener('click', () => {
    Engine.gameplay.setReady((<Actor>Engine.actors[0]).name);
    UI.fillWaitingRoom(Engine.gameplay.playersReady);
    Network.updateReadyStatus((<Actor>Engine.actors[0]).name);
});

Network.connect(`${HOST}:${PORT}`, (data: NetworkCallback) => {
    switch (data.event) {
        case 'onConnection': {
            UI.fillRooms(data.payload);

            break;
        }

        case 'createLobby': {
            init(<PlayerInfo>data.payload, 0, (<HTMLSelectElement>UI.colorSelect).value);
            UI.colors.splice(UI.colors.indexOf((<HTMLSelectElement>UI.colorSelect).value, 1));
            UI.hideMainScreen();
            UI.showWaitingRoom();
            Engine.gameplay.addPlayer((<Actor>Engine.actors[0]).name);
            UI.fillWaitingRoom(Engine.gameplay.playersReady);

            break;
        }

        case 'joinLobby': {
            UI.hideMainScreen();
            let { playerInfo, players } = <LobbyInfo>data.payload;
            init(playerInfo, players.length, (<HTMLSelectElement>UI.colorSelect).value);
            UI.colors.splice(UI.colors.indexOf((<HTMLSelectElement>UI.colorSelect).value, 1));
            UI.showWaitingRoom();

            players.forEach(({ socketId, name, ready }: PlayerInfo, index: number) => {
                Engine.gameplay.addPlayer(name);
                const foe = new Actor(
                    Engine.playerPositions[index],
                    { width: 60, height: 60 },
                    new Sprite(`./assets/survivor/rifle/shoot/survivor-shoot_rifle_0_${UI.colors.pop()}.png`),
                    socketId,
                    name
                );

                Engine.addActor(foe);
                if (ready) Engine.gameplay.setReady(name);
            });

            Engine.gameplay.addPlayer((<Actor>Engine.actors[0]).name);
            UI.fillWaitingRoom(Engine.gameplay.playersReady);

            break;
        }

        case 'newLobby': {
            UI.fillRooms(data.payload);

            break;
        }

        case 'newPlayer': {
            let { socketId, name } = <PlayerInfo>data.payload;
            Engine.gameplay.addPlayer(name);
            UI.fillWaitingRoom(Engine.gameplay.playersReady);

            const foe = new Actor(
                Engine.playerPositions[Engine.gameplay.getPlayersLength()],
                { width: 60, height: 60 },
                new Sprite(`./assets/survivor/rifle/shoot/survivor-shoot_rifle_0_${UI.colors.pop()}.png`),
                socketId,
                name
            );

            Engine.addActor(foe);

            break;
        }

        case 'playerReady': {
            Engine.gameplay.setReady(data.payload);
            UI.fillWaitingRoom(Engine.gameplay.playersReady);

            break;
        }

        case 'onDisconnect': {
            Engine.removeActor(data.payload);
            break;
        }

        case 'actorUpdate': {
            let { socketId, position, amplitude, hp } = <ActorUpdate>data.payload;
            if (socketId === Engine.actors[0].id) return;

            Engine.actors.forEach(actor => {
                if (actor.id === socketId) {
                    actor.position = position;
                    actor.sprite.amplitude = amplitude;
                    (<Actor>actor).hp = hp;
                }
            });

            break;
        }

        case 'projectileSpawn': {
            let { socketId, position, mouseCoords } = <ProjectileSpawn>data.payload;
            if (socketId === Engine.actors[0].id) return;

            Engine.addActor(
                new Projectile(
                    { ...position },
                    { width: 10, height: 10 },
                    { ...mouseCoords },
                    new Sprite('./assets/ammo.svg'),
                    socketId
                )
            );
            Sound.shot.play();
            
            break;
        }
    }
});

function init({ socketId, name }: PlayerInfo, positionIndex: number, color: string) {
    const player = new Actor(
        Engine.playerPositions[positionIndex],
        { width: 60, height: 60 },
        new Sprite(`./assets/survivor/rifle/shoot/survivor-shoot_rifle_0_${color}.png`),
        socketId,
        name,
        true
    );

    Engine.addActor(player);
    
    Engine.update = (dtime: number, ctx: CanvasRenderingContext2D) => {
        
        if (Engine.gameplay.beginPlay) {
            if (Engine.actors[0].shouldExist) {
                // movement
                if (Engine.controls.isKeyPressed('KeyA')) {
                    (<Actor>Engine.actors[0]).moveLeft(dtime);
                }
                if (Engine.controls.isKeyPressed('KeyD')) {
                    (<Actor>Engine.actors[0]).moveRight(dtime);
                }
                if (Engine.controls.isKeyPressed('KeyS')) {
                    (<Actor>Engine.actors[0]).moveDown(dtime);
                }
                if (Engine.controls.isKeyPressed('KeyW')) {
                    (<Actor>Engine.actors[0]).moveUp(dtime);
                }

                // scoreboard
                Engine.controls.isKeyPressed('Tab') ? UI.showScoreboard(Engine.gameplay.scores, (<Actor>Engine.actors[0]).name) : UI.hideScoreboard();
            } else {
                // player dies
                UI.drawEndScreen(ctx, {
                    x: Engine.canvas.width / 2.5,
                    y: Engine.canvas.height / 2
                });
                Sound.playDead();
            }
            
            // if projectile overlaps players
            for (let i = 0; i < Engine.actors.length; i++) {
                if (Engine.actors[i] instanceof Projectile) {
                    for (let j = 0; j < Engine.actors.length; j++) {
                        if (Engine.actors[j] instanceof Actor) {
                            if (Engine.actors[i].projectileOwnerId === Engine.actors[j].id) continue;
    
                            let aX1 = Engine.actors[i].position.x;
                            let aX2 = Engine.actors[i].position.x + Engine.actors[i].size.width;
                            let aY1 = Engine.actors[i].position.y;
                            let aY2 = Engine.actors[i].position.y + Engine.actors[i].size.height;
                            let bX1 = Engine.actors[j].position.x;
                            let bX2 = Engine.actors[j].position.x + Engine.actors[j].size.width;
                            let bY1 = Engine.actors[j].position.y;
                            let bY2 = Engine.actors[j].position.y + Engine.actors[j].size.height;
    
                            if (aX1 < bX2 && aX2 > bX1 && aY1 < bY2 && aY2 > bY1) {
                                (<Actor>Engine.actors[j]).registerHit((<Projectile>Engine.actors[i]).damage);
                                if ((<Actor>Engine.actors[j]).hp < 1) {
                                    (<Actor>Engine.actors[j]).shouldExist = false;
                                    (<Actor>Engine.actors[j]).size = { width: 0, height: 0 };
                                    
                                    for (let k = 0; k < Engine.actors.length; k++) {
                                        if (Engine.actors[k].id === Engine.actors[i].projectileOwnerId) {
                                            Engine.gameplay.addScore((<Actor>Engine.actors[k]).name);
                                            break;
                                        }
                                    }
                                }
                                Engine.removeActor(Engine.actors[i].id);
                                Sound.impact.play();
    
                                break;
                            }
                        }
                    }
                }
            }
        
            if (Engine.actors[0].shouldExist) {
                // shooting
                Engine.controls.onClick((x: number, y: number, shouldWait: boolean) => {
                    if (shouldWait) {
                        Sound.empty.play();
                    } else {
                        if (!(<Actor>Engine.actors[0]).ammo.loaded) {
                            Sound.empty.play();
                            return;
                        }
                        Sound.shot.play();
    
                        Engine.addActor(
                            new Projectile(
                                { x: (<Actor>Engine.actors[0]).position.x + (<Actor>Engine.actors[0]).size.width / 2, y: (<Actor>Engine.actors[0]).position.y + (<Actor>Engine.actors[0]).size.height / 2  },
                                { width: 10, height: 10 },
                                { x, y },
                                new Sprite('./assets/ammo.svg'),
                                (<Actor>Engine.actors[0]).id
                            )
                        );
    
                        Network.sendSpawn({
                            socketId: (<Actor>Engine.actors[0]).id,
                            position: {
                                x: (<Actor>Engine.actors[0]).position.x + (<Actor>Engine.actors[0]).size.width / 2,
                                y: (<Actor>Engine.actors[0]).position.y + (<Actor>Engine.actors[0]).size.height / 2
                            },
                            mouseCoords: { x, y }
                        });
    
                        (<Actor>Engine.actors[0]).depleteAmmo();
                    }
                });

                // send player's data to others
                Network.sendUpdate({
                    socketId: Engine.actors[0].id,
                    position: Engine.actors[0].position,
                    amplitude: Engine.actors[0].sprite.amplitude,
                    hp: (<Actor>Engine.actors[0]).hp
                });

                // reload
                if (Engine.controls.isKeyPressed('KeyR')) {
                    (<Actor>Engine.actors[0]).reload(Sound.reload);
                }

                // draw ammo
                UI.drawAmmo(
                    ctx,
                    `${(<Actor>Engine.actors[0]).ammo.loaded} / ${(<Actor>Engine.actors[0]).ammo.remaining}`,
                    {
                        x: Engine.canvas.width - 80,
                        y: Engine.canvas.height - 40
                    }
                );
            }

            // check players alive
            if (!Engine.gameplay.isRestarting) {
                if (Engine.gameplay.getPlayersAliveLength() === 1) {
                    Engine.gameplay.isRestarting = true;
                    setTimeout(() => {
                        Engine.restart();
                    }, 3000);
                }
            }
        } else {
            if (Engine.gameplay.round === 1 && !UI.waitingRoom.classList.contains('hidden')) {
                UI.hideWaitingRoom();
            }
            UI.drawRound(
                ctx,
                Engine.gameplay.round,
                {
                    x: Engine.canvas.width / 2.5,
                    y: Engine.canvas.height / 2
                }
            );
        }
    };
}