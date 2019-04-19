class RoomPage extends egret.DisplayObjectContainer {

    private mapItem: Array<MapItem1> = [];

    private backBut: egret.Bitmap;

    constructor() {
        super();
        var wid = UIManager.gameWidth;
        var hei = UIManager.gameHeight;

        let bgImage = new egret.Bitmap();
        bgImage.texture = RES.getRes("ui/bg.jpg");
        // bgImage.width = wid * 2;
        // bgImage.height = hei;
        // bgImage.x = -Math.floor(bgImage.width / 3);
        this.addChild(bgImage);

        let titleImage = new egret.Bitmap();
        titleImage.texture = RES.getRes("ui/ui.json#title");
        titleImage.x = wid * 0.5 - titleImage.width * 0.5;
        titleImage.y = 100;
        this.addChild(titleImage);

        // let titleImage1 = new egret.Bitmap();
        // titleImage1.texture = RES.getRes("ui/gameUI.json#levelname.png");
        // titleImage1.x = wid * 0.5 - titleImage1.width * 0.5;
        // titleImage1.y = 0;
        // this.addChild(titleImage1);

        // let backBut = this.backBut = new egret.Bitmap();
        // backBut.texture = RES.getRes("ui/gameUI.json#back.png");
        // backBut.x = 10;
        // backBut.y = 10;
        // this.addChild(backBut);

        var keys = egret3d.TableManager.getSceneTableItemKeys();
        var len = keys.length;
        egret3d.logicManager.setLocalStorageItem(keys[0], "false");
        //Test;
        var disX = 40;
        var disY = 280;
        for (var i: number = 0; i < len; i++) {
            var mapItem: MapItem1 = new MapItem1("pic" + (i + 1) + "", Math.min(i + 1, 4), egret3d.logicManager.getLocalStorageItem(keys[i]) != "false");
            mapItem.sceneID = parseInt(keys[i]);
            mapItem.x = disX + Math.floor(i % 2) * (310);
            mapItem.y = disY + Math.floor(i / 2) * (230);
            this.addChild(mapItem);
            this.mapItem.push(mapItem);

            mapItem.touchEnabled = true;
        }
        // this.backBut.touchEnabled = true;

    }


    public onEnterPage(): void {
        // this.backBut.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);

        var keys = egret3d.TableManager.getSceneTableItemKeys();
        var len = this.mapItem.length;
        for (var i = 0; i < len; i++) {
            this.mapItem[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
            this.mapItem[i].lock = egret3d.logicManager.getLocalStorageItem(keys[i]) != "false";
        }
    }

    public onLeavePage(): void {
        // this.backBut.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);

        for (var i = 0, l = this.mapItem.length; i < l; i++) {
            this.mapItem[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
        }
    }

    private onButtonClick(e: egret.TouchEvent): void {
        if (e.target === this.backBut) {
            uiManager.showPage(new LoginPage());
        } else {
            for (var i = 0, l = this.mapItem.length; i < l; i++) {
                if (e.target === this.mapItem[i]) {
                    if (this.mapItem[i].lock === false) {
                        uiManager.removePage();
                        egret3d.sceneManager.changeScene(this.mapItem[i].sceneID);
                    }
                }
            }
        }
    }
}

class MapItem1 extends egret.DisplayObjectContainer {

    private _lock: egret.Bitmap;

    public sceneID: number = 100000;

    constructor(image: string, level: number, lock: boolean) {
        super();

        let bg = new egret.Bitmap();
        bg.texture = RES.getRes("ui/ui.json#" + image);
        this.addChild(bg);
        bg.x = 10;
        bg.y = 10;

        let frame = new egret.Bitmap();
        frame.texture = RES.getRes("ui/ui.json#bk");
        this.addChild(frame);


        this.lock = lock;

        if (level > 0) {
            var startArray: egret.Bitmap[] = [];
            for (var i: number = 0; i < level; i++) {
                var start: egret.Bitmap = new egret.Bitmap();
                start.texture = RES.getRes("ui/ui.json#star");
                start.anchorOffsetX = start.width / 2;

                start.x = frame.width / 2 - (level - 1) / 2 * (start.width + 2) + i * (start.width + 2);
                start.y = 0;
                startArray.push(start);
            }
            startArray.reverse();
            for (var i: number = 0; i < startArray.length; i++) {
                this.addChild(startArray[i]);
            }
        }

        this.width = bg.width;
    }

    public set lock(value: boolean) {
        if (!this.lock) {
            this._lock = new egret.Bitmap();
            this._lock.texture = RES.getRes("ui/ui.json#suo");
            this._lock.x = this.width * 0.5 - this._lock.width * 0.5;
            this._lock.y = this.height * 0.5 - this._lock.height * 0.5;
            this.addChild(this._lock);
        }
        this._lock.visible = value;
    }

    public get lock(): boolean {
        return this._lock && this._lock.visible;
    }
}