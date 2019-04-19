module egret3d {

    export class TimeNode {
        public time: number = 0;
        public timeID: number = 0;

        public target: Object3D;
    }

    export class Tween {
        private timeNodes: TimeNode[];

        public timing(time: number, fun: Function, obj: any, ...params:any[] ) {
            var timeNode: TimeNode = new TimeNode();
            timeNode.timeID = setTimeout(
                () => fun.call(obj, ...params),
                //function complete() {
                //    fun.call(obj, params);
                //    clearTimeout(timeNode.timeID);
                //},
                time
            );
        }
        
    }

    export var timemer: Tween = new Tween() ;

    export class ProPatrolLogic extends LogicNode {

        //简单AI参数
        private aiRadius: number = 1500;
        private isLongRange: boolean = false;
        private attackRange: number = 280;
        private keepMinRange: number = 180;

        constructor() {
            super();
            this.eventTime = -1;
            this.isParallel = false;
        }

        //根据仇恨？距离？
        private getNear(): GameActor {
            var nearActor;
            var min: number = this.aiRadius;
            for (const actor of this.performer.gameRoom.actorlist) {
                if (this.performer.self != actor && actor.groupID != this.performer.self.groupID) {
                    var len = Vector3D.distance(this.performer.self.position, actor.position);
                    if (min > len) {
                        min = len;
                        actor.distance = len;
                        nearActor = actor;
                    }
                }
            }
            return nearActor;
        }

        public getNearPoint(target: GameActor): Vector3D {
            var angle: number = Math.random() * 360;// * MathUtil.DEGREES_TO_RADIANS ;
            var x = Math.sin(angle) * this.keepMinRange + target.position.x;
            var z = Math.cos(angle) * this.keepMinRange + target.position.z;

            Vector3D.HELP_0.x = x;
            Vector3D.HELP_0.z = z;
            return Vector3D.HELP_0;
        }

        private tickTime: number = 1001;
        private tickCycle: number = 1000;
        public tick(time: number, delay: number) {

            if (this.tickTime > this.tickCycle) {
                this.tickTime = 0;
                var nearActor: GameActor = this.getNear();
                if (nearActor) {
                    if (nearActor.groupID != 1 && nearActor.groupID != this.performer.self.groupID) {
                        var len = nearActor.distance;
                        if (len < this.aiRadius) {
                            // can fllow
                            if (len <= this.attackRange && (len > this.keepMinRange - 16 * 2 && len < this.keepMinRange + 16 * 2)) {
                                this.nextNode = [this.performer.logicList["AttackLogic"]];
                                this.performer.targetList.push(nearActor);
                                this.performer.targetList = [nearActor];
                                this.complete = true;
                            } else {
                                //保持距离
                                var v = this.getNearPoint(nearActor);
                                var moveLogic: MoveLogic = <MoveLogic>this.performer.logicList["MoveLogic"];
                                moveLogic.move(v);
                                this.performer.targetList = [nearActor];
                                this.nextNode = [moveLogic]
                                this.complete = true;
                            }
                        } else {
                            //继续他自己的行为
                            this.performer.targetList.length = 0;
                        }
                    }
                }
            }

            this.tickTime += delay;
        }
    }

    export class ProMoveLogic extends LogicNode {

        private targetPos: Vector3D = new Vector3D();
        constructor() {
            super();
            this.eventTime = -1;
            this.isParallel = false;
        }

        public move(targetPos: Vector3D) {
            this.targetPos.copyFrom(targetPos);
            this.performer.self.actorMoveTo(this.targetPos.x, 0, this.targetPos.z);
        }

        private tickDelay: number = 16 * 10;
        private time: number = 0;
        public tick(time: number, delay: number) {
            if (this.time > this.tickDelay) {
                if (!this.performer.self.isMove) {
                    this.complete = true;
                    this.nextNode = [this.performer.logicList["PatrolLogic"]]
                    this.performer.self.actorTrunToDirection(this.targetPos.x, this.targetPos.z);
                } else
                    this.move(this.targetPos);

                this.time = 0;
            }
            this.time += delay;
        }
    }

    export class ProHitLogic extends LogicNode {

        constructor() {
            super();


            this.eventTime = -1;
            this.isParallel = false;
        }

        private time: number = 0;
        public tick(time: number, delay: number) {
            if (!this.complete) {

                this.tickOnce();
               
                this.complete = true;
            }
        }

        private tickOnce() {
            //var effect = effectManager.getEffect("FX_Hit_01");
            var effect = effectManager.getEffect("FX_Hit_03");
            var camera: Camera3D = gameCameraManager.currentCamera;
            if (effect) {
                effect.play(1, true);
                this.performer.targetList[0].parent.addChild(effect);
                this.performer.targetList[0].position.subtract(camera.position,Vector3D.HELP_0);

                Vector3D.HELP_0.normalize();
                Vector3D.HELP_0.scaleBy( 100 );

                effect.x = -Vector3D.HELP_0.x + this.performer.targetList[0].x;
                effect.y = -Vector3D.HELP_0.y + this.performer.targetList[0].y;
                effect.z = -Vector3D.HELP_0.z + this.performer.targetList[0].z;
            }
        }
    }

    export class ProAttackLogic extends LogicNode {

        constructor() {
            super();
            this.eventTime = -1;
            this.isParallel = false;
        }
        private player: UnitItem;
        private time: number = 2000;
        public tick(time: number, delay: number) {
            if (this.performer.targetList.length > 0) {
                this.player = this.performer.self.itemConfig;
                var target: GameActor = this.performer.targetList[0];
                if (this.time > this.player.attack_speed * 2) {
                    var len = Vector3D.distance(this.performer.self.position, target.position);
                    //还在攻击范围内
                    if (len < 280) {
                        Vector3D.HELP_0.x = -(this.performer.self.x - target.position.x);
                        Vector3D.HELP_0.z = -(this.performer.self.z - target.position.z);
                        Vector3D.HELP_0.normalize();
                        this.performer.self.actorTrunToDirection(Vector3D.HELP_0.x, Vector3D.HELP_0.z);

                        // this.normalAttack();
                        var random: number = Math.floor(Math.random() * 5);
                        switch (random) {
                            case 0:
                                this.cast_skill1();
                                break;
                            case 1:
                                this.cast_skill2();
                                break;
                            case 2:
                                this.cast_skill3();
                                break;
                            case 3:
                                this.cast_skill4();
                                break;
                            case 4:
                                this.normalAttack();
                                break;
                        }
                        //uiManager.blood(target,1);
                        uiManager.blood(target,1);
                    } else {
                        this.complete = true;
                        this.nextNode.push(this.performer.logicList["PatrolLogic"]);
                    }
                    this.time = 0;
                }
            }

            this.time += delay;
        }

        //播放 普通攻击
        public normalAttack() {
            this.playAudio("player/Swish_Knife_06.wav");
            this.performer.self.changeState("Attack01", 1, true);
            //timemer.timing(650, () => this.activeHit());
        }

        //播放 第1个技能
        public cast_skill1() {
            this.playAudio("player/Executor_chop.wav");
            this.performer.self.changeState("Skill01", 1, true);
            //timemer.timing(528, () => this.playSkill_effect("Fx_Skill1", 1));
            //timemer.timing(528, () => this.activeHit());
        }

        //播放 第2个技能
        public cast_skill2() {
            this.performer.self.changeState("Skill02", 1, true);
          //  timemer.timing(4 * 33, () => this.playSkill_effect("Fx_Skill2_1", 1));
            //timemer.timing(4 * 33, () => this.activeHit());
           // timemer.timing(4 * 33, (n) => this.playAudio("player/Azrael_Normal_2_2.wav"));


         //   timemer.timing(9 * 33, () => this.playSkill_effect("Fx_Skill2_2", 1));
            //timemer.timing(9 * 33, () => this.activeHit());
         //   timemer.timing(9 * 33, (n) => this.playAudio("player/Azrael_Normal_2_1.wav"));


        //    timemer.timing(20 * 33, () => this.playSkill_effect("Fx_Skill2_3", 1));
            //timemer.timing(20 * 33, () => this.activeHit());
        //    timemer.timing(20 * 33, (n) => this.playAudio("player/Azrael_Skill_1_2.wav"));

        }

        //播放 第3个技能
        public cast_skill3() {
            this.performer.self.changeState("Skill03", 1, true);
            this.playAudio("player/Executor_earthquake.wav")
       //     timemer.timing(9 * 33, () => this.playSkill_effect("Fx_Skill3_1", 1));
            //timemer.timing(9 * 33, (n) => this.playAudio("player/Executor_earthquake.wav?"));
            //timemer.timing(10 * 33, () => this.activeHit());
        }

        //播放 第4个技能
        public cast_skill4() {
            this.performer.self.changeState("Skill04", 1, true);
      //      timemer.timing(7 * 33, () => this.playSkill_effect("Fx_Skill4", 1));
      //      timemer.timing(7 * 33, (n) => this.playAudio("player/attack02.wav"));
      //      timemer.timing(8 * 33, () => this.activeHit());
      //      timemer.timing(17 * 33, () => this.activeHit());
      //      timemer.timing(19 * 33, () => this.activeHit());
      //      timemer.timing(43 * 33, () => this.activeHit());
        }

        //----------------------------------------------------------------
        //播放 音效
        private playAudio(name: string) {//attack02.wav
            audio.audioManager.play("resource/sound/" + name );
        }


        //播放 第一个技能动画特效
        private playSkill_effect(name: string, speed: number) {
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

        //播放 受伤
        private activeHit() {
                ////暂时挪出 受伤hit logic
                //this.playAudio("player/hit/hit_skill04.wav");
                ////this.immediatelyNodes.push(this.performer.logicList["ProHitLogic"]);
                //var effect = effectManager.getEffect("FX_Hit_01");
                //var camera: Camera3D = gameCameraManager.currentCamera;
                //if (effect) {
                //    effect.play(1, true);
                //    this.performer.targetList[0].parent.addChild(effect);
                //    this.performer.targetList[0].position.subtract(camera.position, Vector3D.HELP_0);

                //    Vector3D.HELP_0.normalize();
                //    Vector3D.HELP_0.scaleBy(100);

                //    effect.x = -Vector3D.HELP_0.x + this.performer.targetList[0].x;
                //    effect.y = -Vector3D.HELP_0.y + this.performer.targetList[0].y;
                //    effect.z = -Vector3D.HELP_0.z + this.performer.targetList[0].z;
                //}
        }
    }

    //逻辑执行者
    export class ProLogicPerformer extends LogicPerformer {

        private _immediatelyNodes: LogicNode[] = [] ;
        constructor() {
            super();
        }
         
        public initConfig(item: any) {
        }

        public addNode(node: LogicNode) {
            this.logicList[node.name] = node;
            node.performer = this;
        }

        public startLogic(name: string) {
            if (this.logicList[name]) {
                this._parallelLogic.push(this.logicList[name]);
                this._run = true;
            }
        }

        public tick(time: number, delay: number) {
            if (this._run) {

                for (const node of this._parallelLogic) {
                    if (node.complete) {
                        //移除不需要执行的
                        var index = this._parallelLogic.indexOf(node);
                        this._parallelLogic.splice(index);
                        //插入要执行的
                        this.apendNext(node);
                       // this.apendImmediately(node);
                    } else
                        this.apendImmediately(node);
                }

                for (const node of this._immediatelyNodes) {
                    if (!node.complete) {
                        this.apendImmediately(node);
                    }
                }

                for (const node of this._parallelLogic) {
                    node.tick(time, delay);
                }

                for (const node of this._immediatelyNodes) {
                    node.tick(time, delay);
                }

            }
        }

        protected apendNext(node: LogicNode) {
            for (const n of node.nextNode) {
                this._parallelLogic.push(n);
                n.complete = false;
            }
            node.nextNode.length = 0;
        }

        protected apendImmediately(node: LogicNode) {
            for (const n of node.immediatelyNodes) {
                this._immediatelyNodes.push(n);
                n.complete = false;
            }
            node.immediatelyNodes.length = 0;
        }
    }

    export class ProtagonistLogic extends ProLogicPerformer {

        public proAttackLogic: ProAttackLogic;
        constructor() {
            super();
        }

        public initConfig(item: any) {
            var patrol: ProPatrolLogic = new ProPatrolLogic();
            this.proAttackLogic = new ProAttackLogic();
            var move: ProMoveLogic = new ProMoveLogic();
            var hit: ProHitLogic = new ProHitLogic();

            patrol.name = "PatrolLogic";
            this.proAttackLogic.name = "AttackLogic";
            move.name = "MoveLogic";
            hit.name = "ProHitLogic";

            this.addNode(patrol);
            this.addNode(this.proAttackLogic);
            this.addNode(move);
            this.addNode(hit);
        }

        public startLogic(name: string) {
            super.startLogic(name);
        }

        public tick(time: number, delay: number) {
            super.tick(time, delay);
        }
    }
}