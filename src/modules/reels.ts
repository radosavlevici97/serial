import * as PIXI from "pixi.js";
import {
    Application,
    Sprite,
    Spritesheet,
} from "pixi.js";
import { LoadBundle } from "./load-bundle";
import { Names } from "./names";
import _ from "lodash";
import { Symbol } from "./symbols";
import { SymbolsTextures } from "./symbols-textures";
import { ObjectPool } from "./object-pool";
import { Types } from "./types";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
export class Reels {
    private _reelsSpriteSheet: Spritesheet;
    private _bundle: LoadBundle;
    private _app: Application;
    private _reelsSprite: Sprite;
    private _overgroundSprite: Sprite;
    private _betLamp: Sprite;
    private _leftItem:Sprite;
    private _symbolsSpriteSheet: Spritesheet;
    private _symbolsBlurSpriteSheet: Spritesheet;
    private _reelContainer: PIXI.Container;
    private _reels: Array<Types.reelType> = [];
    private _reelMask: PIXI.Graphics;
    private _symbolsPool: ObjectPool<Symbol>;
    private _running: boolean = false;
    public buttonCallback: Function;

    private _callbackReelsLoaded: Function;
    constructor(initReels: Function, bundle, app: Application) {
        this._bundle = bundle;
        this._app = app;
        this._callbackReelsLoaded = initReels;
        this.initSpriteSheet();
    }
    private async initSpriteSheet(): Promise<void> {
        this._reelsSpriteSheet = new PIXI.Spritesheet(
            PIXI.BaseTexture.from(
                "assets/reels/" +
                this._bundle.bundleValue.mainScreen.reelsSheet.data.meta.image
            ),
            this._bundle.bundleValue.mainScreen.reelsSheet.data
        );
        this._symbolsBlurSpriteSheet = new PIXI.Spritesheet(
            PIXI.BaseTexture.from(
                "assets/symbols/" +
                this._bundle.bundleValue.mainScreen.symbolsSheet.data.meta.image
            ),
            this._bundle.bundleValue.mainScreen.symbolsSheet.data
        );

        await this._reelsSpriteSheet.parse();
        this.initReelsSprite();
        this.initOvergroundSprite();
        this.initBetLamp();
        await this._symbolsBlurSpriteSheet.parse();
        this.initReels();
        this.initSymbolsTextures();
        this.createObjectPool();
        this.createReelMask();
        this.initLeftItem();
        this._app.stage.addChild(this._overgroundSprite);
        this._callbackReelsLoaded();
    }

    private initReelsSprite(): void {
        this._reelsSprite = new Sprite(
            this._reelsSpriteSheet.textures[Names.SpriteNames.REELS]
        );
        this._reelsSprite.anchor.set(0.5);
        //this._reelsSprite.scale.set(0.8);
        this._reelsSprite.x = this._app.screen.width / 2+10;
        this._reelsSprite.y = this._app.screen.height / 2 + 25;
        this._app.stage.addChild(this._reelsSprite);
    }

    private initOvergroundSprite(): void {
        this._overgroundSprite = new Sprite(
            this._reelsSpriteSheet.textures[Names.SpriteNames.OVERGROUND]
        );
        this._overgroundSprite.anchor.set(0.5);
        //this._overgroundSprite.scale.set(0.8);
        this._overgroundSprite.x = this._app.screen.width / 2;
        this._overgroundSprite.y = this._app.screen.height / 2 - 5 + 25;
    }

    private initBetLamp(): void {
        this._betLamp = new Sprite(
            this._reelsSpriteSheet.textures[Names.SpriteNames.BETLAMP]
        );
        this._betLamp.anchor.set(0.5);
        //this._betLamp.scale.set(0.8);
        //-this._reelsSprite.width/5/2-2*this._reelsSprite.width/5
        //-this._betLamp.height-this._reelsSprite.height
        this._betLamp.x = this._reelsSprite.x-this._betLamp.width;
        this._betLamp.y = this._reelsSprite.y-50;
        this._app.stage.addChild(this._betLamp);
        this._app.stage.addChild(this._reelsSprite);
    }
    private initLeftItem(): void {
        this._leftItem = new Sprite(
            this._reelsSpriteSheet.textures[Names.SpriteNames.LEFTITEM]
        );
        this._leftItem.anchor.set(0.5);
        //this._leftItem.scale.set(0.8);
        //-this._reelsSprite.width/5/2-2*this._reelsSprite.width/5
        //-this._leftItem.height-this._reelsSprite.height
        this._leftItem.x = this._reelsSprite.x-this._leftItem.width/1.5-2-this._reelsSprite.width/2;
        this._leftItem.y = this._reelsSprite.y-50;
        this._app.stage.addChild(this._leftItem);
    }

    public initReels(): void {
        this._reelContainer = new PIXI.Container();
        this._reels = [];
    }

    public initSymbolsTextures(): void {
        _.each(_.range(1, Names.Misc.NUMBER_OF_SYMBOLS + 1), (index) => {
            SymbolsTextures.blurTextures.push(
                this._symbolsBlurSpriteSheet.textures[
                Names.SpriteNames.SYMBOL + index + ".png"
                    ]
            );
        });
    }

    public createObjectPool(): void {
        this._symbolsPool = new ObjectPool(50, Symbol);
        _.each(_.range(0, 5), (index) => {
            const rc = new PIXI.Container<any>();
            rc.x = (index * this._reelsSprite.width) / 5;
            this._reelContainer.addChild(rc);
            const reel: Types.reelType = {
                container: rc,
                symbols: [],
                position: 0,
                previousPosition: 0,
            };
            _.each(_.range(0, Names.Misc.NUMBER_OF_SYMBOLS_PER_WHEEL), (index2) => {
                const symbol: Symbol = this._symbolsPool.get();
                symbol.width = Names.Misc.SYMBOL_WIDTH;
                symbol.height = Names.Misc.SYMBOL_HEIGHT;
                symbol.y = (index2 * this._reelsSprite.height) / 4 +symbol.height/2;
                symbol.x = Math.round((this._reelsSprite.width / 5 - symbol.width) / 2);
                reel.symbols.push(symbol);
                rc.addChild(symbol);
            });
            this._reels.push(reel);
        });
        this._reelContainer.pivot.set(0.5, 0.5);
        this._reelContainer.x = this._reelsSprite.x - this._reelContainer.width / 2;
        this._reelContainer.y =
            this._reelsSprite.y - this._reelContainer.height / 2;
        this._app.stage.addChild(this._reelContainer);
        // Listen for animate update.

        this._app.ticker.add(() => {
            for (let i = 0; i < this._reels.length; i++) {
                const reel: Types.reelType = this._reels[i];
                reel.previousPosition = reel.position;
                for (let j = 0; j < this._reels[i].symbols.length; j++) {
                    let symbol: Symbol = reel.symbols[j];
                    const prevY = symbol.y;
                    symbol.y =
                        ((reel.position + j) % reel.symbols.length) * symbol.height -
                        symbol.height/2;
                    if (symbol.y < 0 && prevY > symbol.height) {
                        const newSymbol = this._symbolsPool.get(true);
                        let data = {
                            texture: symbol.getBlurSprite.texture,
                            id: symbol.id,
                        };
                        symbol.blurSpriteTexture = newSymbol.getBlurSprite.texture;
                        symbol.id = newSymbol.id;
                        newSymbol.blurSpriteTexture = data.texture;
                        newSymbol.id = data.id;
                        this._symbolsPool.recycle(newSymbol);
                        symbol.width = Names.Misc.SYMBOL_WIDTH;
                        symbol.height = Names.Misc.SYMBOL_HEIGHT;
                        symbol.x = Math.round((Names.Misc.SYMBOL_WIDTH - symbol.width) / 2);
                    }
                }
            }
        });
    }

    private createReelMask() {
        this._reelMask = new PIXI.Graphics();
        this._app.stage.addChild(this._reelMask);
        this._reelMask.lineStyle(2, 0xffffff, 1);
        this._reelMask.beginFill(0xffffff);
        this._reelMask.drawRect(
            this._reelsSprite.x - this._reelsSprite.width / 2,
            this._reelsSprite.y - this._reelsSprite.height / 2,
            this._reelsSprite.width,
            this._reelsSprite.height
        );
        this._reelMask.endFill();
        this._reelContainer.mask = this._reelMask;
    }

    public startPlay(callback: Function): void {
        // Function to start playing.

        if (this._running) return;
        this._running = true;
        for (let i = 0; i < this._reels.length; i++) {
            const r: Types.reelType = this._reels[i];
            const target = r.position + Names.Misc.TARGET_VALUE;
            const time = 1.34;
            gsap.registerPlugin(CustomEase);
            gsap.to(r, {
                position: target+(i*4),
                //17.9
                duration: time+(i*0.0558333333*4),
                //delay: i * 0.05,
                ease:CustomEase.create("custom", "M0,0 C0.178,0.178 0.142,0.144 0.178,0.178 0.26,0.256 0.178,0.179 0.5,0.5 0.664,0.664 0.709,0.708 0.762,0.758 0.8,0.794 0.762,0.758 1,1 "),
               // ease:"back.inOut(0.0)",
                onComplete: () => {
                    i === this._reels.length - 1 ? this.reelsComplete(callback) : null;
                },
            });
        }
    }

    // Reels done handler.
    public reelsComplete(callback) {
        this._running = false;
        callback();
    }
}