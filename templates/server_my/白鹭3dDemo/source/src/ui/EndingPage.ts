class EndingPage extends egret.DisplayObjectContainer {
    constructor() {
        super();

        let bg = new egret.Bitmap();
        bg.texture = RES.getRes("ui/gameUI.json#endingPanel.png");
        this.addChild(bg);

        let leaveBtn = new egret.Bitmap();
        leaveBtn.texture = RES.getRes("ui/gameUI.json#leaveBtnUp.png");
        leaveBtn.x = 319;
        leaveBtn.y = 367;
        this.addChild(leaveBtn);

        leaveBtn.touchEnabled = true;

        leaveBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            egret3d.logicManager.exit();
            uiManager.leaveEnding();
        }, this)
    }
}