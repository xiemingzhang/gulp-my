class CDButton1 extends egret.Sprite {

    private maskRect: egret.Rectangle;
    private maskTexture: egret.Shape;
    private cdTime: number = 1000;
    private currTime: number = 0;

    constructor(downICO: string, upICO: string, maskICO: string, buttonWidth: number, buttonHeight: number) {
        super();

        this.width = buttonWidth;
        this.height = buttonHeight;

        let bgButton = new egret.Bitmap();
        bgButton.texture = RES.getRes("ui/gameUI.json#" + upICO);
        // TODO down
        bgButton.width = buttonWidth;
        bgButton.height = buttonHeight;
        this.addChild(bgButton);

        let maskTexture = this.maskTexture = new egret.Shape();
        maskTexture.graphics.beginFill(0x000000, 0.75);
        maskTexture.graphics.drawRect(0, 0, buttonWidth, buttonHeight);
        maskTexture.graphics.endFill();
        // maskTexture.texture = RES.getRes("ui/gameUI.json#" + maskICO);
        // maskTexture.alpha = 0.75;
        maskTexture.width = buttonWidth;
        maskTexture.height = buttonHeight;
        maskTexture.mask = this.maskRect = new egret.Rectangle(0, 0, buttonWidth, buttonHeight);
        this.addChild(maskTexture);

        let topBox = new egret.Bitmap();
        topBox.texture = RES.getRes("ui/gameUI.json#SkillBox.png");
        topBox.width = buttonWidth;
        topBox.height = buttonHeight;
        this.addChild(topBox);

        this.touchEnabled = true;

        this.clearTime();
    }

    bindKeyboard(bindKeyboard: egret3d.KeyCode): void {
        //
    }

    unbindKeyboard(): void {
        //
    }

    canUse(): boolean {
        return !this.maskTexture.visible;
    }

    startTime(time: number): void {
        this.currTime = 0;
        this.cdTime = time;

        this.maskTexture.visible = true;

        TweenLite.to(this.maskRect, this.cdTime / 1000, {
            y: this.height,
            onUpdate: () => {
                this.maskRect.height = this.height - this.maskRect.y;
                this.maskTexture.mask = this.maskRect;
            },
            onComplete: () => {
                this.maskTexture.visible = false;
                this.clearTime();
            }
        });
    }

    clearTime(): void {
        this.currTime = 0;
        this.maskRect.x = 0;
        this.maskRect.y = 0;
        this.maskRect.width = this.width;
        this.maskRect.height = this.height;
        this.maskTexture.mask = this.maskRect;
        if (this.maskTexture.visible) {
            this.maskTexture.visible = false;
        }
    }
}

class SkillBar extends egret.Sprite {

    private skillsId: number[] = [];
    private skillsButton: CDButton1[] = [];

    private skillButtonWidth: number = 64;
    private skillButtonHeight: number = 64;

    constructor(skillButtonWidth: number = 64, skillButtonHeight: number = 64) {
        super();

        this.skillButtonWidth = skillButtonWidth;
        this.skillButtonHeight = skillButtonHeight;
    }

    addSkillButton(skillsId: number, icon: string, bindKeyboard: egret3d.KeyCode = 0): CDButton1 {
        var cdButton: CDButton1 = new CDButton1(icon, icon, icon, this.skillButtonWidth, this.skillButtonHeight);

        if (bindKeyboard > 0) {
            cdButton.bindKeyboard(bindKeyboard);
        }

        this.skillsId.push(skillsId);
        this.skillsButton.push(cdButton);

        cdButton.x = this.skillButtonWidth * (this.skillsButton.length - 1);

        this.addChild(cdButton);

        this.width = this.skillButtonWidth * this.skillsButton.length;

        cdButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onClick, this);

        return cdButton;
    }

    private onClick(e: egret.TouchEvent): void {
        console.log("skill")
        egret3d.logicManager.cancelMove = true;

        var index: number = this.skillsButton.indexOf(e.target);
        var cdButton: CDButton1 = this.skillsButton[index];

        if (!cdButton.canUse()) {
            //console.log("cd 冷却中");
            return;
        }

        new egret3d.ProtagonistLogic();
        var actor: egret3d.GameActor = egret3d.logicManager.currentGameRoom.gameController.mainActor;
        var perform = <egret3d.ProtagonistLogic>actor.performer;

        var enemyActors: egret3d.GameActor[] = [];

        actor.findNearEnemy(enemyActors);

        if (enemyActors.length > 0 && !actor.lockSkills) {

            //查找离主角最近的敌对单位;
            enemyActors.sort(function (a: egret3d.GameActor, b: egret3d.GameActor): number {
                return egret3d.Vector3D.distance(actor.position, a.position) < egret3d.Vector3D.distance(actor.position, b.position) ? -1 : 1;
            });

            switch (index) {
                case 0:
                    //perform.proAttackLogic.cast_skill1();
                    //perform.proAttackLogic.normalAttack();
                    actor.runAction(new egret3d.ActionSequence([
                        new egret3d.ActionAttackTarget(enemyActors[0], actor.itemConfig.skill_1_id),
                        new egret3d.ActionRepeat(new egret3d.ActionAttackTarget(enemyActors[0], actor.itemConfig.skill_0_id), -1)
                    ]));
                    this.skillsButton[index].startTime(egret3d.TableManager.findSkillsTableItem(actor.itemConfig.skill_1_id).cd_time);
                    break;
                case 1:
                    actor.runAction(new egret3d.ActionSequence([
                        new egret3d.ActionAttackTarget(enemyActors[0], actor.itemConfig.skill_2_id),
                        new egret3d.ActionRepeat(new egret3d.ActionAttackTarget(enemyActors[0], actor.itemConfig.skill_0_id), -1)
                    ]));
                    this.skillsButton[index].startTime(egret3d.TableManager.findSkillsTableItem(actor.itemConfig.skill_2_id).cd_time);
                    break;
                case 2:
                    //perform.proAttackLogic.cast_skill3();
                    actor.runAction(new egret3d.ActionSequence([
                        new egret3d.ActionAttackTarget(enemyActors[0], actor.itemConfig.skill_3_id),
                        new egret3d.ActionRepeat(new egret3d.ActionAttackTarget(enemyActors[0], actor.itemConfig.skill_0_id), -1)
                    ]));
                    this.skillsButton[index].startTime(egret3d.TableManager.findSkillsTableItem(actor.itemConfig.skill_3_id).cd_time);
                    break;
                case 3:
                    //perform.proAttackLogic.cast_skill4();
                    actor.runAction(new egret3d.ActionSequence([
                        new egret3d.ActionAttackTarget(enemyActors[0], actor.itemConfig.skill_4_id),
                        new egret3d.ActionRepeat(new egret3d.ActionAttackTarget(enemyActors[0], actor.itemConfig.skill_0_id), -1)
                    ]));
                    this.skillsButton[index].startTime(egret3d.TableManager.findSkillsTableItem(actor.itemConfig.skill_4_id).cd_time);
                    break;
            }
        }
    }
}