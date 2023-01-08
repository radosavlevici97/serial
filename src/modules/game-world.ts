import * as PIXI from 'pixi.js';

import {Application} from "pixi.js";
import {LoadManifest} from "./load-manifest";
import {LoadBundle} from "./load-bundle";
import {Names} from "./names";
import {Background} from "./background";
import {Reels} from "./reels";
import {UiAssets} from "./ui-assets";

export class SlotGame {
    private app: PIXI.Application;
    private _bundle;

    private _slot;

    public startApplication(){
        // Create the Pixi.js renderer and stage
        this.app = new Application({
            width: 1920,
            height: 1080,
            view:window.document.getElementById('gameCanvas') as HTMLCanvasElement
        });
        this.loadManifest();
    }

    public  loadManifest():void {
        new LoadManifest(this.loadBundle.bind(this));
    }

    public loadBundle():void{
        this._bundle = new LoadBundle(this.initModules.bind(this));
        this._bundle.setBundleName=Names.BundlesNames.MAIN_SCREEN;
        this._bundle.loadBundle();

    }

    public initModules():void{
        this.initBackground();
    }
    public initBackground():void{
        new Background(this.initReels.bind(this),this._bundle,this.app);
    }
    public initReels():void{
        this._slot= new Reels(this.initUiAssets.bind(this), this._bundle, this.app);
    }

    public initUiAssets():void{
        new UiAssets(this._slot, this._bundle, this.app);
    }
}


