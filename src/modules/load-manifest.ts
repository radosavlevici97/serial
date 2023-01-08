import * as PIXI from "pixi.js";

export class LoadManifest {
    private _manifest;
    private _callbackManifestLoaded:Function;
    constructor(loadBundle:Function) {
        this._callbackManifestLoaded= loadBundle;
        this.initManifest();
    }
    private async initManifest():Promise<void> {
        this._manifest= await PIXI.Assets.init({manifest: "assets/manifest.json"});
        this._callbackManifestLoaded();
    }


    public get manifest(){
        return this._manifest;
    }
}