import * as PIXI from "pixi.js";

export class LoadBundle {
    private _bundle;
    private _bundleName;
    private _callbackBundleLoaded:Function;
    constructor(manifestLoaded:Function) {
        this._callbackBundleLoaded= manifestLoaded;
    }
    public async loadBundle():Promise<void> {
        this._bundle= (await PIXI.Assets.loadBundle([this._bundleName]));
        this._callbackBundleLoaded();
    }


    public get bundleValue(){
        return this._bundle;
    }
    public set setBundleName(name:string){
        this._bundleName=name;
    }
}