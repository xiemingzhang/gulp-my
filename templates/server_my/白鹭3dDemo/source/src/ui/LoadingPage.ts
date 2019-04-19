class LoadingPage extends egret.DisplayObjectContainer {

    private loadingProgress: ProcessBar;
    private totalProgress: ProcessBar;
    private _count: number;
    private _total: number;
    constructor(private fileURLs: string[], private callbackFun: Function, private callbackObj: any) {

        super();
        let bgImage = "ui/bg.jpg";
        this.once(egret.Event.ADDED_TO_STAGE, () => {
            this.onAdd(bgImage);
        }, this);


    }
    private onAdd(bgImage: string) {
        var wid = this.stage.stageWidth;
        var hei = this.stage.stageHeight;
        if (bgImage) {
            var bg = new egret.Bitmap();
            bg.texture = RES.getRes(bgImage);
            // bg.width = wid * 2;
            // bg.height = hei;
            // bg.x = -Math.floor(wid / 2);
            this.addChild(bg);
        }

        this.totalProgress = new ProcessBar("ui/gameUI.json#hpbar_bg.png", "ui/gameUI.json#expbar.png");
        this.totalProgress.width = wid - 100;
        this.totalProgress.height = 10;
        this.totalProgress.ratio = 0;
        this.totalProgress.x = 50;
        this.totalProgress.y = (hei - this.totalProgress.height) * 0.5 - 10;
        this.addChild(this.totalProgress);
    }



    onEnterPage(): void {
        this.fileURLs = this.fileURLs.map(item => item.replace("resource/", ""));
        console.log(this.fileURLs)
        this._count = 0;
        this._total = this.fileURLs.length;

        Promise.all(this.fileURLs.map(item => RES.getResAsync(item, this.onOnceComplete, this))).then(() => {
            this.onTotalLoadComplete();
        });
    }


    onLeavePage(): void {
        this._count = 0;
        this._total = 0;
        this.callbackFun = null;
        this.callbackObj = null;
    }

    private onOnceComplete(): void {
        this._count++;
        this.totalProgress.ratio = this._count / this._total;
    }

    private onTotalLoadComplete(): void {
        if (this.callbackFun) {
            //this._callbackFun.call(this._callbackObj, this._loader)

            let loader = {
                getAsset: (url) => {
                    url = url.replace("resource/", "");
                    RES.profile();
                    let r = RES.getRes(url);
                    return r;
                }
            }

            setTimeout(() => this.callbackFun.call(this.callbackObj, loader), 100);
        }
    }
}