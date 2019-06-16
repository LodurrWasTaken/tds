export default class Sound {
    static shot = new Audio('./assets/sound/rifle_shot.mp3');
    static reload = new Audio('./assets/sound/reload.mp3');
    static impact = new Audio('./assets/sound/shot_impact.mp3');
    static empty = new Audio('./assets/sound/empty.mp3');
    static dead = new Audio('./assets/sound/dead.mp3');
    
    static played = false;

    static playDead(): void {
        if (!this.played) {
            this.dead.play();
            this.played = true;
        }
    }
}