class BattlePage extends egret.DisplayObjectContainer {

    private spriteBackTown: egret.Bitmap;
    public hitContainer: HitContainer;

    private _radio: number = .8;

    private hitCount: number = 0;
    private hitTime: number = 0;
    private hitTween1;
    private hitTween2;

    public timeKeeper: TimeKeeper;

    public expBar: ProcessBar;
    public skillBar: SkillBar;

    private bloodLayer: egret.DisplayObjectContainer;
    private hpBarLayer: egret.DisplayObjectContainer;

    constructor() {
        super();
        var width = UIManager.gameWidth;
        var height = UIManager.gameHeight;

        this.bloodLayer = new egret.DisplayObjectContainer();
        this.addChild(this.bloodLayer);

        this.hpBarLayer = new egret.DisplayObjectContainer();
        this.addChild(this.hpBarLayer);

        let title = new egret.Bitmap();
        title.texture = RES.getRes("ui2/gameUI.json#scene_100000.png");
        title.x = (width - title.width) * .5;
        title.x = 0;
        title.y = 0;
        title.scaleX = title.scaleY = this._radio;
        this.addChild(title);

        let spriteBackTown = this.spriteBackTown = new egret.Bitmap();
        spriteBackTown.texture = RES.getRes("ui2/gameUI.json#fh.png");
        spriteBackTown.x = width - spriteBackTown.width + 20;
        spriteBackTown.y = height - spriteBackTown.height - 100;
        spriteBackTown.scaleX = spriteBackTown.scaleY = 0.8;
        this.addChild(spriteBackTown);

        let hitContainer = this.hitContainer = new HitContainer();
        hitContainer.scaleX = hitContainer.scaleY = this._radio;
        hitContainer.x = 20;
        hitContainer.y = height * 0.3;
        this.addChild(hitContainer);
        this.hitContainer.visible = false;

        let timeKeeper = this.timeKeeper = new TimeKeeper();
        timeKeeper.x = width - timeKeeper.width / this._radio - 80;
        timeKeeper.y = 7;
        timeKeeper.scaleX = timeKeeper.scaleY = this._radio;
        this.addChild(timeKeeper);

        this.expBar = new ProcessBar("ui2/gameUI.json#hpbar_bg.png", "ui/gameUI.json#expbar.png");
        this.expBar.height = 10;
        this.expBar.width = 96 * 4;
        this.expBar.x = (width - this.expBar.width) / 2;
        this.expBar.y = (height - this.expBar.height);
        this.addChild(this.expBar);

        this.skillBar = new SkillBar(96, 96);
        var playerItem = egret3d.logicManager.currentGameRoom.playerItem;
        //初始化玩家技能;
        this.skillBar.addSkillButton(playerItem.skill_1_id, "skilla.png", egret3d.KeyCode.Key_Q);
        this.skillBar.addSkillButton(playerItem.skill_2_id, "skillb.png", egret3d.KeyCode.Key_W);
        this.skillBar.addSkillButton(playerItem.skill_3_id, "skillc.png", egret3d.KeyCode.Key_E);
        this.skillBar.addSkillButton(playerItem.skill_4_id, "skilld.png", egret3d.KeyCode.Key_R);
        this.skillBar.x = width * 0.5 - this.skillBar.width * 0.5;
        this.skillBar.y = height - this.skillBar.height - 10;
        this.addChild(this.skillBar);

        spriteBackTown.touchEnabled = true;
    }

    onEnterPage(): void {
        this.spriteBackTown.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
    }

    onLeavePage(): void {
        this.spriteBackTown.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);

        // remove hp bar
        for (const hpBar of this.hpBarList) {
            if (hpBar.hpBar.parent) {
                hpBar.hpBar.parent.removeChild(hpBar.hpBar);
            }
        }
        this.hpBarList.length = 0;

        this.timeKeeper.stop();
        this.timeKeeper.reset();

        this.hitContainer.clear();
    }

    private onButtonClick(e: egret.TouchEvent): void {
        if (e.target === this.spriteBackTown) {
            this.timeKeeper.stop();
            egret3d.logicManager.exit();
        }
    }

    private bloodList: Array<Blood> = [];
    blood(target: egret3d.GameActor, num: number) {
        var blood = new Blood();
        blood.createNumberView(num);
        blood.pos3D = target.position.clone();
        blood.pos3D.y += 200;
        this.bloodLayer.addChild(blood);
        blood.pos3DTo2DFun = egret3d.Scene.root.camera3D.object3DToScreenRay;
        blood.camera = egret3d.Scene.root.camera3D;

        var pt: egret3d.Vector3D = egret3d.Scene.root.camera3D.object3DToScreenRay(blood.pos3D);
        var stage = this.bloodLayer.stage;
        if (stage) {
            blood.x = pt.x;
            blood.y = pt.y;
        } else {
            blood.x = -100;
            blood.y = -100;
        }

        this.bloodList.push(blood);
    }

    private hpBarList: Array<any> = [];
    addHpBar(target: egret3d.GameActor, hpBar: egret.DisplayObject): void {
        this.hpBarList.push({ target: target, hpBar: hpBar });
        this.hpBarLayer.addChild(hpBar);;
        var pos = egret3d.Scene.root.camera3D.object3DToScreenRay(target.position);
        hpBar.x = pos.x;
        hpBar.y = pos.y;
    }

    update(time: number, delay: number): void {
        for (const blood of this.bloodList) {
            if (blood.complete) {
                var index: number = this.bloodList.indexOf(blood);
                this.bloodList.splice(index, 1);
                this.bloodLayer.removeChild(blood);
            } else {
                blood.update(time, delay);
            }
        }

        for (const hpBar of this.hpBarList) {
            var pos = hpBar.target.position.clone();
            if (hpBar.target.groupID === 0) pos.y += 100;
            pos.y += 150;
            // 实时计算坐标很耗性能
            pos = egret3d.Scene.root.camera3D.object3DToScreenRay(pos);
            var stage = this.bloodLayer.stage;
            if (stage) {
                // 黑科技来处理坐标适配，这里应该有更好的方法
                // var p = stage.$screen["webTouchHandler"].getLocation({pageX: pos.x, pageY: pos.y, identifier: 0});
                hpBar.hpBar.x = pos.x - hpBar.hpBar.width / 2;
                hpBar.hpBar.y = pos.y;
            }
        }
    }
}