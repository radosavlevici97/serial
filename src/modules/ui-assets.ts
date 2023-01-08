import * as PIXI from "pixi.js";
import { Application, Sprite, Spritesheet, Texture } from "pixi.js";
import { LoadBundle } from "./load-bundle";
import { Names } from "./names";
import { Reels } from "./reels";

export class UiAssets {
    private _spritesheet: Spritesheet;
    private _bundle: LoadBundle;
    private _app: Application;

    private _buttonSprite: Sprite;
    private _buttonStaticTexture: Texture;
    private _pragmaticTexture: Texture;
    private _pragmaticLogoSprite: Sprite;

    private _slot: Reels;
    constructor(slot: Reels, bundle, app: Application) {
        this._bundle = bundle;
        this._app = app;
        this._slot = slot;
        this.initUiAssetsSpriteSheet();
    }
    private async initUiAssetsSpriteSheet(): Promise<void> {
        this._spritesheet = new PIXI.Spritesheet(
            PIXI.BaseTexture.from(
                "assets/ui/" +
                this._bundle.bundleValue.mainScreen.uiAssetsSheet.data.meta.image
            ),
            this._bundle.bundleValue.mainScreen.uiAssetsSheet.data
        );

        await this._spritesheet.parse();
        this.initUiAssetsTextures();
        this.initUiAssetsSprites();
        this.setReelsButton();
    }
    public initUiAssetsTextures() {
        this._buttonStaticTexture =
            this.spritesheet.textures[Names.SpriteNames.SPIN_BUTTON_STATIC];
        this._pragmaticTexture =
            this.spritesheet.textures[Names.SpriteNames.PRAGMATIC];
    }
    public initUiAssetsSprites(): void {
        this._buttonSprite = new Sprite(this._buttonStaticTexture);
        this._buttonSprite.anchor.set(0.5);
        this._buttonSprite.y = this._app.screen.height / 2;
        this._buttonSprite.x =
            this._app.screen.width - this._buttonSprite.height / 1.5;
        this._buttonSprite["interactive"] = true;
        this._buttonSprite["cursor"] = "pointer";
        this._buttonSprite["on"]("pointerup", () => {
            this.turnOffButton();
            this._slot.startPlay(this.turnOnButton.bind(this));
        });

        this._pragmaticLogoSprite = new Sprite(this._pragmaticTexture);
        this._pragmaticLogoSprite.scale.set(0.5);
        this._pragmaticLogoSprite.x =
            this._app.screen.width - this._pragmaticLogoSprite.width;
        this._app.stage.addChild(this._buttonSprite);
        this._app.stage.addChild(this._pragmaticLogoSprite);
    }

    public turnOffButton(): void {
        this._buttonSprite.visible=false;
    }
    public turnOnButton(): void {
        this._buttonSprite.visible=true;
    }

    private setReelsButton(): void {
        this._slot.buttonCallback = this.turnOnButton;
    }
    public get spritesheet() {
        return this._spritesheet;
    }
}