class LoginPage extends egret.DisplayObjectContainer {

    private enterGameButton: egret.Bitmap;

    constructor() {
        super();
        this.once(egret.Event.ADDED_TO_STAGE, this.onAdd, this);
    }
    private onAdd() {

        var wid = UIManager.gameWidth;
        var hei = UIManager.gameHeight;

        let bgImage = new egret.Bitmap();
        bgImage.texture = RES.getRes("ui/bg.jpg");

        // bgImage.width = wid * 2;
        // bgImage.height = hei;
        // bgImage.x = -Math.floor(wid / 2);
        this.addChild(bgImage);

        let gameName = new egret.Bitmap();
        gameName.texture = RES.getRes("ui/ui.json#logo");
        gameName.x = wid * 0.5 - gameName.width * 0.5;
        gameName.y = hei * 0.5 - gameName.height * 0.5 - gameName.height;
        this.addChild(gameName);

        let newGameBut = this.enterGameButton = new egret.Bitmap();
        newGameBut.texture = RES.getRes("ui/ui.json#menu");
        newGameBut.x = wid * 0.5 - newGameBut.width * 0.5;
        newGameBut.y = gameName.y + gameName.height + 220;
        this.addChild(newGameBut);


        let powerByEgret3D = new egret.Bitmap();
        powerByEgret3D.texture = RES.getRes("ui/gameUI.json#powerByEgert3D.png");
        powerByEgret3D.x = bgImage.width - powerByEgret3D.width;
        powerByEgret3D.y = this.stage.stageHeight - powerByEgret3D.height;
        this.addChild(powerByEgret3D);

        this.enterGameButton.touchEnabled = true;

        this.enterGameButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
    }

    private onButtonClick(e: egret.TouchEvent): void {
        switch (e.target) {
            case this.enterGameButton:
                let room = new RoomPage();
                uiManager.showPage(room);
                break;
        }
    }

}
