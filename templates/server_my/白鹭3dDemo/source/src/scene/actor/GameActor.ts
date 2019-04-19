module egret3d {

    export class ActorData {
        //力量
        public strength: number = 0;
        //敏捷
        public agility: number = 0;
        //智力
        public intelligence: number = 0;
        //生命值;
        public hp: number = 0;
        //最大生命值;
        public max_hp: number = 0;
        //法术值;
        public mp: number = 0;
        public max_mp: number = 0;
        //攻击力
        public attack: number = 0;
        //防御
        public defense: number = 0;
        //暴击率
        public crit: number = 0;
        //经验值;
        public exp: number = 0;
        //等级;
        public level: number = 1;
        //是否暴击
        public isCrit: boolean = false;
        //暴击伤害
        public critDamage: number = 0;
        //攻击速度
        public attack_speed: number = 0;
        //攻击范围
        public attack_range: number = 0;
        //移动速度
        public moveSpeed: number = 0;
        //生命回复速度
        public healingRate: number = 0;
        //蓝回复速度
        public manarate: number = 0;

        private data: UnitItem;
        public initData(data: UnitItem) {
            this.data = data; 
            this.strength = data.strength;
            this.agility = data.agility;
            this.intelligence = data.intelligence;
            //this.attack_speed = data.attack_speed;
            //this.attack_range = data.attack_range;
            //this.moveSpeed = data.moveSpeed;

            //this.hp = data.hp; 
            //this.max_hp = data.hp;
            //this.mp = data.mp; 
            //this.attack = data.attack; 
            //this.crit = data.crit;
            //this.critDamage = data.critDamage;
            //this.defense = data.defense;
            this.exp = 0;
            this.level = data.level;

            this.update();
            this.hp = this.max_hp ; 
        }

        //升级 升三维，改变三维
        //三维影响攻击，速度，血量等
        public update() {
            var self = this; 
            //力量：
            //每点增加25点最大生命值
            //每点增加0.05的生命恢复速度
            //每点增加1的攻击力（力量英雄）
            self.max_hp = self.strength * 25;
            self.healingRate = self.strength * 0.05;
            if (self.data.primettribute == "strength" )
                self.attack = self.strength  ;

            //敏捷：
            //每点增加0.3的护甲
            //每点增加0.02的攻击速度
            //每点增加1的攻击力（敏捷英雄）
            self.defense = self.agility * 0.3; 
            self.attack_speed = self.data.attack_speed + self.agility * 0.1 * 0.1; 
            self.critDamage = self.agility * 0.02;
            self.crit = self.agility * 0.11;
            self.moveSpeed = self.data.moveSpeed + self.moveSpeed * 0.3;
           //this.actorData.moveSpeed = this.upgradeConfig.moveSpeed;

            if (self.data.primettribute == "agility")
                self.attack = self.agility;
              
            //智力：
            //每点增加15点最大魔法值
            //每点增加0.05的魔法恢复速度
            //每点增加1的攻击力（智力英雄）
            self.max_mp = self.intelligence * 15;
            self.manarate = self.intelligence * 0.05;
            if (self.data.primettribute == "intelligence")
                self.attack = self.intelligence;

            self.hp = self.max_hp;//this.upgradeConfig.hp - (this.actorData.max_hp - this.actorData.hp);
            self.mp = self.max_mp;
           //this.actorData.attack = this.upgradeConfig.attack;
           //this.actorData.defense = this.upgradeConfig.defense;
           //this.actorData.crit = this.upgradeConfig.crit;
           //this.actorData.attack_speed = this.upgradeConfig.attack_speed;
           //this.actorData.moveSpeed = this.upgradeConfig.moveSpeed;
        }

    }

    export class StateStruct{
        id: number;
        animCount: number = 0 ;
        animStates: string[];
        reset: boolean;
        speed: number;
        effects: string[];
        effectTimes: number[];
        audios: string[];
        audioTimes: number[];
    }

    export class GameActor extends Actor {

        private static _globalCount: number = 0;

        public actorData: ActorData;
        public detailActorData: ActorData;

        private animMoveSpeed: number = 1.0;

        public lookJoint: Joint;
        public role: Role;
        public animLock: boolean = false;
        public gameRoom: GameRoom;
        public lockMove: boolean;
        public lockSkills: boolean;
        public lookObj: Object3D = new Object3D;
        public itemConfig: UnitItem;
        public upgradeConfig: UpgradeItem;
        public performer: LogicPerformer;
        public groupID: number = 0; // 0是自己，1是中立，2是敌人
        public distance: number = 0;
        public actorId: number;
        public useLookJoint: boolean = false;

        private shadow: Mesh;

        private lights: LightGroup;
        // private _hpBar: gui.UIProgressBar;
        // private _titleView:DisplayObject;//用于放置血条. 名字.等级等gui信息
        // private _lvNameText: gui.UITextField;
        private _hpRestoreTime: number;

        private _titleView:egret.Sprite;//用于放置血条. 名字.等级等gui信息
        private _hpBar:ProcessBar;
        private _lvNameText:egret.TextField;

        constructor() {
            super();
            this.actorId = ++GameActor._globalCount;

            this.actorData = new ActorData();
            this.detailActorData = new ActorData();

            this.lockMove = false;
            this.lockSkills = false;

            var texture = RES.getRes("ShadowPlane.png");
            this.shadow = new Mesh(new PlaneGeometry(150, 150, 1, 1), new TextureMaterial(texture));
            this.shadow.tag.name = "decal";
            this.addChild(this.shadow);
            this.shadow.y = 10;
            this.shadow.material.blendMode = BlendMode.ALPHA;
            this.shadow.material.alpha = 0.7;
            this._hpRestoreTime = 1000;

            //this.lights = new LightGroup();
            ////var dir: DirectLight = new DirectLight(new Vector3D(0.0, -1.0, 0.5));
            //var dir: DirectLight = sceneManager.currentScene.findObject3D("_Directionallight") as DirectLight;
            //this.lights.addLight(dir);
        }

        //被添加到了场景中;
        public onBeAdded(): void {
            this._titleView.visible = true;
            this.lockMove = false;
        }

        //从场景中移除了;
        public onBeRemove(): void {
            this._titleView.visible = false;
            if (sceneManager.currentScene) {
                var nav: NavGrid = sceneManager.currentScene.nav;
                if (nav.getUserData(nav.xToGridX(this.x), nav.yToGridY(this.z)) == this.actorId) {
                    nav.setUserData(nav.xToGridX(this.x), nav.yToGridY(this.z), 0);
                }
            }
        }

        //复活;
        public rebirth(): void {
            this.runAction(null);
            this.actorData.hp = this.actorData.max_hp;
            this.detailActorData.hp = this.detailActorData.max_hp;
            this.role.skeletonAnimation.play("Idle");
            this.updateActorData();
        }

        private getNumbers(s: string): number[]{
            var tmp = s.split(",");
            var tmp2: number[] = [];

            for (var i: number = 0; i < tmp.length; i++){
                tmp2.push(Number(tmp[i]));
            }
            return tmp2;
        }
        //state ******************************************************************
        //state ******************************************************************
        private states: { [key: number]: StateStruct } = {};
        public initConfig() {
            //获取 技能
            //var att = TableManager.findSkillsTableItem(this.itemConfig.skill_0_id);
            //var skil_0: SkillsItem = TableManager.findSkillsTableItem(this.itemConfig.skill_1_id);
            //var skil_1: SkillsItem = TableManager.findSkillsTableItem(this.itemConfig.skill_2_id);
            //var skil_2: SkillsItem = TableManager.findSkillsTableItem(this.itemConfig.skill_3_id);
            //var skil_3: SkillsItem = TableManager.findSkillsTableItem(this.itemConfig.skill_4_id);
            var skillArray: SkillsItem[] = [
                TableManager.findSkillsTableItem(this.itemConfig.skill_0_id),
                TableManager.findSkillsTableItem(this.itemConfig.skill_1_id),
                TableManager.findSkillsTableItem(this.itemConfig.skill_2_id),
                TableManager.findSkillsTableItem(this.itemConfig.skill_3_id),
                TableManager.findSkillsTableItem(this.itemConfig.skill_4_id),
            ];

            for (var i: number = 0; i < skillArray.length; i++) {
                var att: SkillsItem = skillArray[i];
                if (att) {
                    var stateStruct: StateStruct = new StateStruct();
                    stateStruct.id = att.id;
                    stateStruct.animStates = att.animation_name.split(",");
                    stateStruct.reset = true;
                    stateStruct.speed = att.speed;
                    stateStruct.effects = att.effect_play_name == "" ? [] : att.effect_play_name.split(",");
                    stateStruct.effectTimes = this.getNumbers(att.effect_play_delay);
                    stateStruct.audios = att.sound_name == "" ? [] : att.sound_name.split(",");
                    stateStruct.audioTimes = this.getNumbers(att.sound_play_delay);
                    this.states[stateStruct.id] = stateStruct;
                }
            }

            //创建cast state
        }
        private castState;
        public cast(skill: number, isCrit: boolean ) {
            var castState:StateStruct = this.castState; 
            castState = this.states[skill];
            if (castState) {
                //切换动作
                if (castState.animCount + 1 >= castState.animStates.length)
                    castState.animCount = 0;
                else
                    castState.animCount++;
                this.changeState(castState.animStates[castState.animCount], castState.speed * this.actorData.attack_speed >= 1 ? castState.speed * this.actorData.attack_speed : 1, castState.reset);
                for (var i: number = 0; i < castState.effects.length; i++) {
                    var id = i ;
                    //特效节奏
                    timemer.timing(castState.effectTimes[i], this.playSkill_effect, this, castState, id);
                }
                for (var i: number = 0; i < castState.audios.length; i++) {
                    //特效节奏
                    timemer.timing(castState.audioTimes[i], this.playAudio, this, castState.audios[i]);
                }
            }
        }

        public hit(effectName: string) {
            var self = this;
            if (self.itemConfig.hit_effect_bone.length <= 0) {
                return;
            }
            var effect = effectManager.getEffect(effectName);
            if (effect) {
                var camera: Camera3D = gameCameraManager.currentCamera;
                effect.play(1, true);
                self.parent.addChild(effect);
                self.position.subtract(camera.position, Vector3D.HELP_0);
                Vector3D.HELP_0.normalize();
                Vector3D.HELP_0.scaleBy(100);

                effect.x = -Vector3D.HELP_0.x + self.x + self.lookObj.x;
                effect.y = -Vector3D.HELP_0.y + self.y + self.lookObj.y;
                effect.z = -Vector3D.HELP_0.z + self.z + self.lookObj.z;
            }
        }

        public playAudio(name: string) {
            audio.audioManager.play("resource/sound/" + name);
        }

        //播放 第一个技能动画特效
        private playSkill_effect(state: StateStruct, id: number) {
            var name = state.effects[id];
            var effect = effectManager.getEffect(name);
            if (effect) {
                effect.play(state.speed, true);
                effect.x = this.performer.self.x;
                effect.y = this.performer.self.y;
                effect.z = this.performer.self.z;
                effect.rotationY = this.performer.self.rotationY;
                this.performer.self.parent.addChild(effect);
            }
        }

        private playEffect(name: string, speed: number): void {
            var effect = effectManager.getEffect(name);
            if (effect) {
                effect.play(speed, true);
                effect.x = this.performer.self.x;
                effect.y = this.performer.self.y;
                effect.z = this.performer.self.z;
                effect.rotationY = this.performer.self.rotationY;
                this.performer.self.parent.addChild(effect);
            }
        }

        //要注意 差量的正负值，正值颜色是否要变，负值是否要变
        public updateActorData(): boolean {
            var change: boolean = false;
            //记录扣除了多少的值
            var subHP = this.detailActorData.hp;
            var subMP = this.detailActorData.mp;
            //记录扣除了多少的值

            //更新显示
            if (subHP != 0) {
                this._hpBar.ratio = this.actorData.hp / this.actorData.max_hp;
                if (subHP > 0) {
                    //uiManager.blood(this, subHP);
                    uiManager.blood(this, subHP);
                    change = true;
                }
            }
            if (subMP) {
               // this._hpBar.ratio = this.actorData.hp / this.itemConfig.hp;
                change = true;
            }

            return change;
        }

        //state ******************************************************************
        //state ******************************************************************

        public get isDeath(): boolean {
            return this.actorData.hp <= 0;
        }

        public start() {
        }

        public setRole(role: Role, item: UnitItem) {

            this.lockSkills = false;

            this.itemConfig = item;

            this.upgradeConfig = item.upgrade_id > 0 ? TableManager.findUpgradeTableItem(item.upgrade_id) : null;

            this.initConfig();

            this.actorData.initData(item);
            this.detailActorData.initData(item);

            this.name = item.name;
            this.moveSpeed = this.actorData.moveSpeed;
            this._hpRestoreTime = 1000;
            if (role) {
                this.role = role;
                this.addChild(this.role);

                for (var p in role.avatar) {
                    role.avatar[p].lightGroup = this.lights;
                    role.avatar[p].scaleX = role.avatar[p].scaleY = role.avatar[p].scaleZ = item.scale_ratio;
                }
                this.role.skeletonAnimation.play("Idle");
                //this._lookJoint = this.role.skeletonAnimation.state.gpuSkeletonPose.jointsDictionary["Bip01 Spine"];
                
                this.lookJoint = this.role.skeletonAnimation.state.gpuSkeletonPose.jointsDictionary[item.hit_effect_bone];
                if (this.lookJoint){
                    this.role.skeletonAnimation.addEventListener(AnimationEvent3D.COMPLETE, this.animComplete, this);
                }
            }

            // this._titleView = new DisplayObject();

            // this._hpBar = new egret3d.gui.UIProgressBar();
            // this._hpBar.width = 80;
            // this._hpBar.height = 8;
            // if (this.groupID === 0) {
                // this._hpBar.setStyle("bar", "hpbar_pet.png");
            // } else {
                // this._hpBar.setStyle("bar", "hpbar_jun.png");
                
            // }
            // this._hpBar.setStyle("background", "hpbar_bg.png");

            // this._titleView.addChild(this._hpBar);

            // this._lvNameText = new gui.UITextField();
//            this._lvNameText.text = this.actorData.

            // this._lvNameText.textColor = 0xffffffff;
            // this._lvNameText.text = "lv: " + this.actorData.level + " "+  this.itemConfig.name;
            // this._lvNameText.width = 100;
            // this._lvNameText.height = 20;
            // this._lvNameText.y = -this._lvNameText.height - 5;
            // this._titleView.addChild(this._lvNameText);

            // uiManager.addHpBar(this, this._titleView);
            this._titleView = new egret.Sprite();

            if(this.groupID === 0) {
                this._hpBar = new ProcessBar("ui/gameUI.json#hpbar_bg.png", "ui/gameUI.json#hpbar_pet.png");
            } else {
                this._hpBar = new ProcessBar("ui/gameUI.json#hpbar_bg.png", "ui/gameUI.json#hpbar_jun.png");
            }
            this._hpBar.width = 80;
            this._hpBar.height = 8;
            this._titleView.addChild(this._hpBar);

            this._lvNameText = new egret.TextField();
            this._lvNameText.textColor = 0xffffff;
            this._lvNameText.text = "lv: " + this.actorData.level + " "+  this.itemConfig.name;
            this._lvNameText.width = 100;
            this._lvNameText.height = 20;
            this._lvNameText.size = 20;
            this._lvNameText.y = -this._lvNameText.height - 5;
            this._titleView.addChild(this._lvNameText);

            uiManager.addHpBar(this, this._titleView);

            this.updateActorData();

            //if (this == this.gameRoom.gameController.mainActor) {
            //    var Dummy001: Object3D = new Object3D();
            //    var Dummy002: Object3D = new Object3D();
            //    role.skeletonAnimation.bindToJointPose("Dummy001", Dummy001);
            //    role.skeletonAnimation.bindToJointPose("Dummy002", Dummy002);
            //    var ribbon: Ribbon = new Ribbon(null, [Dummy001, Dummy002]);
            //    role.addChild(ribbon);
            //}
        }

        public addExp(exp: number): void {

            while (this.upgradeConfig && exp > 0) {

                this.actorData.exp += exp;

                if (this.actorData.exp < this.upgradeConfig.upgrade_exp) {
                    break;
                }

                exp = this.actorData.exp - this.upgradeConfig.upgrade_exp;

                this.actorData.exp = 0;

                ++this.actorData.level;

                this.playEffect("Fx_Levelup_01", 1.0);

                this._lvNameText.text = "lv: " + this.actorData.level + " " + this.itemConfig.name;

                //变更属性;
                //this.actorData.hp = this.upgradeConfig.hp - (this.actorData.max_hp - this.actorData.hp);
                //this.actorData.max_hp = this.upgradeConfig.hp;
                //this.actorData.mp = this.upgradeConfig.mp;
                //this.actorData.attack = this.upgradeConfig.attack;
                //this.actorData.defense = this.upgradeConfig.defense;
                //this.actorData.crit = this.upgradeConfig.crit;
                //this.actorData.critDamage = this.upgradeConfig.critDamage;
                //this.actorData.attack_speed = this.upgradeConfig.attack_speed;
                //this.actorData.moveSpeed = this.upgradeConfig.moveSpeed;
                this.actorData.strength = this.upgradeConfig.strength;
                this.actorData.agility = this.upgradeConfig.agility;
                this.actorData.intelligence = this.upgradeConfig.intelligence;
                this.actorData.update();

                this.upgradeConfig = this.upgradeConfig.next_id > 0 ? TableManager.findUpgradeTableItem(this.upgradeConfig.next_id) : null;
            }
            if (this.upgradeConfig) {
                // uiManager.updateExpBar(this.actorData.exp / this.upgradeConfig.upgrade_exp);
                uiManager.updateExpBar(this.actorData.exp / this.upgradeConfig.upgrade_exp);
            } else {
                //满级直接设满
                // uiManager.updateExpBar(1);
                uiManager.updateExpBar(1);
            }


        }

        public animComplete(e: AnimationEvent3D) {
            this.animLock = false;
        }

        public changeState(stateName: string, speed: number = 1.0, reset: boolean = false, useLookJoint: boolean = false) {
            this.useLookJoint = useLookJoint;
            if (this.role) {
                this.role.skeletonAnimation.play(stateName, speed, reset);
            }
            if (reset) {
                this.animLock = true;
            }
        }

        public update(time: number, delay: number, camera: egret3d.Camera3D) {

            if (this.gameRoom.isGameOver) {
                if (!this.isDeath) {
                    this.changeState("Idle", 1.0, false);
                }
                return;
            }

            if (this.isDeath) {
                this.changeState("Death", 1.0, false);
                return;
            }
            else if (!this.animLock) {
                if (this.isMove) {
                    this.changeState("Run", 1.0, false);
                } else {
                    this.changeState("Idle", 1.0, false);
                }
            }

            if (this.lookJoint) {
                this.lookJoint.copyTo(this.lookObj);
                this.lookObj.x = -this.lookObj.x;
                this.lookObj.z = -this.lookObj.z;

                //this.lookObj.x += this.x;
                //this.lookObj.y += this.y;
                //this.lookObj.z += this.z;
            } 

            //if (this.performer) {
            //    this.performer.tick( time,delay );
            //}
            
            if (this._action && !this.isDeath) {
                if (this == this.gameRoom.gameController.mainActor) {
                    this._hpRestoreTime -= delay;
                    if (this._hpRestoreTime <= 0) {
                        this._hpRestoreTime += 1000;
                        this.actorData.hp += Math.min(this.actorData.healingRate, this.actorData.max_hp - this.actorData.hp);
                        this._hpBar.ratio = this.actorData.hp / this.actorData.max_hp;
                    }
                }
                this._action.onTick(this, time, delay);
                if (this._action.onIsComplete(this)) {
                    this._action = null;
                }
            }

            super.update(time, delay, camera);
        }

        //执行指定的Action;
        private _action: ActionNode;
        public runAction(action: ActionNode): void {
            if (!action) {
                this._action = null;
            }
            else if (action.onIsActivate(this)) {
                this._action = action;
            }
        }

        public findNearEnemy(outArray: GameActor[], range: number = -1): GameActor[] {
            outArray.length = 0;
            range = range <= 0 ? this.itemConfig.attack_range : range;
            for (const actor of this.gameRoom.actorlist) {
                if (actor.isDeath) {
                    continue;
                }
                if (this != actor && actor.groupID != this.groupID) {
                    var len = Vector3D.distance(this.position, actor.position);
                    if (len < range) {
                        outArray.push(actor);
                    }
                }
            }
            return outArray;
        }
    }
}