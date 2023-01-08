import * as PIXI from 'pixi.js';
import gsap from "gsap";
import {Application} from "pixi.js";
import {LoadManifest} from "./load-manifest";
import {LoadBundle} from "./load-bundle";
import {Names} from "./names";
import {Background} from "./background";
import {Reels} from "./reels";
import {UiAssets} from "./ui-assets";
import {AssetsInfoCommand} from "./asset-info-command";

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

    private  loadManifest():void {
        new LoadManifest(this.loadBundle.bind(this));
    }

    private loadBundle():void{
        this._bundle = new LoadBundle(this.initModules.bind(this));
        this._bundle.setBundleName=Names.BundlesNames.MAIN_SCREEN;
        this._bundle.loadBundle();

    }

    private initModules():void{
        this.initBackground();
    }
    private initBackground():void{
        new Background(this.initReels.bind(this),this._bundle,this.app);
    }
    private initReels():void{
        this._slot= new Reels(this.initUiAssets.bind(this), this._bundle, this.app);
    }

    private initUiAssets():void{
        new UiAssets(this.initAssetsInfo.bind(this),this._slot, this._bundle, this.app);
    }
    private initAssetsInfo():void{
        const delaycall = gsap.delayedCall(1, ()=>{
            new AssetsInfoCommand();
            delaycall.kill();
        });
    }

}


