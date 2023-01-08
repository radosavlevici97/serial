import * as PIXI from "pixi.js";
import {Names} from "./names";

export class SymbolsTextures{
    private static _normalTextures:Array<PIXI.Texture> = [];
    private static _blurTextures:Array<PIXI.Texture> = [];


    public static get normalTextures(){
        return this._normalTextures;
    }
    public static get blurTextures(){
        return this._blurTextures;
    }
}