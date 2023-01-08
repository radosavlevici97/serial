import * as PIXI from "pixi.js";
import {Application, Sprite, Spritesheet} from "pixi.js";
import {LoadBundle} from "./load-bundle";
import {Names} from "./names";

export class Background {
    private _spritesheet:Spritesheet;
    private _bundle:LoadBundle;
    private _app:Application;

    private _backgroundSprite:Sprite;

    private _callbackBackgroundLoaded:Function;
    constructor(initReels:Function,bundle,app:Application) {
        this._bundle=bundle;
        this._app=app;
        this._callbackBackgroundLoaded= initReels;
        this.initBackgroundSpriteSheet();
    }
    private async initBackgroundSpriteSheet():Promise<void> {
        this._spritesheet = new PIXI.Spritesheet(
            PIXI.BaseTexture.from("assets/background/" + this._bundle.bundleValue.mainScreen.backgroundSheet.data.meta.image),
            this._bundle.bundleValue.mainScreen.backgroundSheet.data
        );


        await this._spritesheet.parse();
        this.initBackgroundSprite();



        this._callbackBackgroundLoaded();
    }

    public initBackgroundSprite():void{
        this._backgroundSprite =  new Sprite(this.spritesheet.textures[Names.SpriteNames.BACKGROUND]);
        this._backgroundSprite.anchor.set(0.5);
        this._backgroundSprite.x = this._app.screen.width / 2;
        this._backgroundSprite.y = this._app.screen.height / 2;
        this._app.stage.addChild(this._backgroundSprite);
    }

    public get spritesheet(){
        return this._spritesheet;
    }
}