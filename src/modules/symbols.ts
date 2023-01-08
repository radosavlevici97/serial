import * as PIXI from "pixi.js";
import {Application, Container, Sprite, Spritesheet} from "pixi.js";
import {LoadBundle} from "./load-bundle";
import {Names} from "./names";
import {SymbolsTextures} from "./symbols-textures";
import * as _ from 'lodash';
export class Symbol extends Container {
    private _symbolSprite:Sprite;
    private _symbolBlurSprite:Sprite;
    private _id:number;
    //TODO ar trebui sa schimb parametrii din object pool, sa nu mai fie doar un array ci sa fie niste proprietati individuale ;)
    constructor(random?:boolean, id?:number) {
        super();
        this._id = id;
        this.createNormalSprite(random);
        this.createBlurSprite(random);
        this.createSymbolHolder();
    }

    private createNormalSprite(random?:boolean):void{
    }

    private createBlurSprite(random?:boolean):void{
        const randomNumber:number = Math.floor(Math.random() * 11);
        this._symbolBlurSprite = new Sprite(SymbolsTextures.blurTextures[randomNumber]);
        this._id=randomNumber;
        //this._symbolBlurSprite.anchor.set(0.5);
    }

    private createSymbolHolder():void{
        this.addChild(this._symbolBlurSprite);

    }



    public get id(){
        return this._id;
    }
    public set id(value:number){
        this._id=value;
    }
    public set blurSpriteTexture(texture){
        this._symbolBlurSprite.texture = texture;
    }
    public get getBlurSprite(){
        return this._symbolBlurSprite;
    }
}