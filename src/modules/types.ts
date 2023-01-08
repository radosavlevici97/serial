import * as PIXI from 'pixi.js';
export namespace Types {
    export type reelType = {
        container: PIXI.Container,
        symbols: Array<any>,
        position: number,
        previousPosition: number,
    }
}