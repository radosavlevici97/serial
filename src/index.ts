import {SlotGame} from "./modules/game-world";
import * as PIXI from 'pixi.js';

new class Main {
    private game: SlotGame;

    constructor() {
        //PIXI inspector works only on Chrome
        if (window.hasOwnProperty('__PIXI_INSPECTOR_GLOBAL_HOOK__')) {
            window['PIXI'] = PIXI;
        }
        this.game = new SlotGame();
        this.game.startApplication();
    };
};