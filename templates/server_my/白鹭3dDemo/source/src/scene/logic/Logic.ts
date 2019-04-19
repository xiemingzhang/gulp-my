module egret3d {


    export class DamageTools {
        private gameDefenseFactor: number = 0.06;

        //判定暴击
        public preCrit(skillsItem: SkillsItem, selfActor: GameActor): boolean {
            var isCrit: boolean = false ;
            selfActor.detailActorData.crit = selfActor.actorData.crit + skillsItem.crit;
            selfActor.detailActorData.isCrit = Math.random() > (1 - selfActor.detailActorData.crit);
            return selfActor.detailActorData.isCrit;
        }

        public calculateDamage(skillsItem: SkillsItem, selfActor: GameActor, targetActors: GameActor[]) {
            var DEF: number;
            var ATT: number;
            for (const target of targetActors) {
                if (target.actorData.defense > 0) {
                    DEF = 1.0 - (target.actorData.defense * this.gameDefenseFactor) / ((target.actorData.defense * this.gameDefenseFactor) + 1);
                }
                else {
                    DEF = (1.0 - 2 - Math.pow((1 - this.gameDefenseFactor), target.actorData.defense));
                }

                ATT = (1.0 + selfActor.detailActorData.critDamage) * ((skillsItem.attack_ad + skillsItem.attack_ap + selfActor.actorData.attack) * DEF);
                ATT = Math.ceil(ATT);

                //记录下要扣除的值
                //self
                selfActor.detailActorData.mp = skillsItem.mp;

                //target
                target.detailActorData.hp = ATT;
                target.actorData.hp = target.actorData.hp - ATT;
            }
        }
    }

    export var damageTools = new DamageTools();

    //逻辑样式节点
    export class LogicNode {

        public name: string;

        public eventTime: number = 0;
        //是否并行
        public isParallel: boolean = false;

        public targets: GameActor[];

        public nextNode: LogicNode[] = [] ;

        public immediatelyNodes: LogicNode[] = [] ;

        public complete: boolean = false;

        public performer: LogicPerformer;

        //public start() {
        //}

        public tick(time:number,delay:number) {

        }

        public decision() {
            // to add decision next
        }
    }

    export class DelayLogic extends LogicNode {

        public delayTime: number = 0;
        constructor() {
            super();
            this.eventTime = 0;
            this.isParallel = false;
        }

        public tick(time: number, delay: number) {
            this.delayTime -= delay;
            if (this.delayTime < 0) {
                this.complete = true;
                this.nextNode = [this.performer.logicList["StartGameLogic"]];
            }
        }

        public decision() {
            // to add decision next
        }
    }

    export class StartGameLogic extends LogicNode {

        constructor() {
            super();
            this.eventTime = 0;
            this.isParallel = false;
        }

        public tick(time: number, delay: number) {
            this.complete = true;
            this.nextNode = [this.performer.logicList["MobLogic"]];
        }

        public decision() {
            // to add decision next
        }
    }

    export class MobLogic extends LogicNode {

        public nextWave: number = 100000;
        public time: number = 0;
        public mobDelayTime: number = 1000;
        public monstCount: number = 0;

        public gameTime: number = 0;

        //出怪逻辑在LogicManager.ts -> GameLevel;
        //constructor() {
        //    super();
        //    this.eventTime = -1;
        //    this.isParallel = false;
        //}

        //public tick(time: number, delay: number) {
        //    var waveItem: WaveItem = TableManager.findWaveTableItem(this.nextWave);

        //    waveItem.monsterA_num = 1;

        //    if (this.monstCount<waveItem.monsterA_num){
        //        if (this.time > this.mobDelayTime) {
        //            this.time = 0;

        //            //刷一个怪
        //            var v = JSON_Util.getVector3D(this.performer.gameRoom.sceneItem.monster_point_0);
        //            var v2 = JSON_Util.getVector3D(this.performer.gameRoom.sceneItem.host_point);
        //            var gameActor: GameActor = this.performer.gameRoom.addRole(waveItem.monsterA_id, 2,false);
        //            gameActor.jumpTo(v.x, v.z);

        //            v2.x = Math.random() * 300 - 150 + v2.x;
        //            v2.z = Math.random() * 300 - 150 + v2.z;

        //            //gameActor.actorMoveTo(v2.x, 0, v2.z);
        //            gameActor.performer = gameActor.performer || new MonsterLogic();
        //            gameActor.performer.self = gameActor;
        //            gameActor.performer.gameRoom = this.performer.gameRoom;
        //            gameActor.performer.initConfig(null);
        //            gameActor.performer.startLogic("PatrolLogic");

        //            //指定怪物AI;
        //            gameActor.runAction(new ActionRepeat(new ActionSequence([new ActionAttackTo(JSON_Util.getVector3D(this.performer.gameRoom.sceneItem.host_point)), new ActionDelay(400)]), -1) );

        //            this.monstCount++;
        //        }
        //    }
        //    else {
        //        this.monstCount = 0;
        //        this.time = 0;
        //        this.nextWave = waveItem.next_wave;
        //        this.nextNode = [];
        //        this.complete = true;
        //    }

        //    this.time += delay;
        //    this.gameTime += delay;
        //}
    }

    export class PatrolLogic extends LogicNode{

        //简单AI参数
        private aiRadius: number = 1500 ;
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
            var min: number = this.aiRadius ;
            for (const actor of this.performer.gameRoom.actorlist) {
                if (this.performer.self != actor && actor.groupID != this.performer.self.groupID){
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
                            this.performer.targetList.length = 0 ;
                        }
                    }
                }
            }

            this.tickTime += delay;
        }
    }

    export class MoveLogic extends LogicNode {

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
        private time: number = 0 ;
        public tick(time: number, delay: number) {
            if (this.time>this.tickDelay){
                if (!this.performer.self.isMove) {
                    this.complete = true;
                    this.nextNode = [this.performer.logicList["PatrolLogic"]];
                    this.performer.self.actorTrunToDirection(this.targetPos.x, this.targetPos.z);
                } else
                    this.move(this.targetPos);

                this.time = 0;
            }
            this.time += delay;
        }
    }

    export class AttackLogic extends LogicNode {

        constructor() {
            super();
            this.eventTime = -1;
            this.isParallel = false;
        }
        private player: UnitItem; 
        private time: number = 0 ; 
        public tick(time: number, delay: number) {
            if (this.performer.targetList.length > 0) {
                this.player = this.performer.self.itemConfig;
                var target: GameActor = this.performer.targetList[0];
                if ( this.time > this.player.attack_speed * 5 ) {
                    var len = Vector3D.distance(this.performer.self.position, target.position);
                    //还在攻击范围内
                    if (len < 280) {
                        Vector3D.HELP_0.x = -(this.performer.self.x - target.position.x);
                        Vector3D.HELP_0.z = -(this.performer.self.z - target.position.z);
                        Vector3D.HELP_0.normalize();
                        this.performer.self.actorTrunToDirection(Vector3D.HELP_0.x, Vector3D.HELP_0.z);
                        this.performer.self.changeState("Attack01", 1, true);

                        //uiManager.blood(target,1);
                        uiManager.blood(target,1);
                    } else {
                        this.complete = true;
                        this.nextNode = [this.performer.logicList["PatrolLogic"]]
                    }
                    this.time = 0;
                }
            }

            this.time += delay;
        }
    }

    //逻辑执行者
    export class LogicPerformer{

        public targetList: GameActor[] = [];

        public logicList: { [key: string]: LogicNode } = {};
        public gameRoom: GameRoom;
        public self: GameActor;

        //protected _queueLogics: LogicNode[] = [] ;
        protected _parallelLogic: LogicNode[] = [];

        protected _run: boolean = false;

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
                    node.tick(time, delay);
                }
                for (const node of this._parallelLogic) {
                    if (!node.complete) {
                        node.tick(time, delay);
                    } else {
                        //移除不需要执行的
                        var index = this._parallelLogic.indexOf(node);
                        this._parallelLogic.splice(index);
                        //插入要执行的
                        this.apendNext(node);
                    }
                }
            }
        }

        protected apendNext(node:LogicNode) {
            for (const n of node.nextNode ) {
                this._parallelLogic.push(n);
                n.complete = false;
            }
            node.nextNode.length = 0;
        }
    }

    //关卡逻辑
    export class LevelLogic extends LogicPerformer{
        private _logicNode: LogicNode[];
        constructor() {
            super();
        }

        public initConfig(item: any) {
            var delayLogic = new DelayLogic();
            delayLogic.delayTime = 6000;
            var start = new StartGameLogic();
            var mob = new MobLogic();
            delayLogic.name = "DelayLogic";
            start.name = "StartGameLogic";
            mob.name = "MobLogic" ;
            this.addNode(delayLogic);
            this.addNode(start);
            this.addNode(mob);
        }

        public startLogic(name: string) {
            super.startLogic(name);
        }

        public tick(time: number, delay: number) {
            super.tick(time,delay);
        }

    }

    //怪物执行逻辑
    export class MonsterLogic extends LogicPerformer {

        constructor() {
            super();
        }

        public initConfig(item: any) {
            var patrol: PatrolLogic = new PatrolLogic();
            var attack: AttackLogic = new AttackLogic();
            var move: MoveLogic = new MoveLogic();
            patrol.name = "PatrolLogic";
            attack.name = "AttackLogic";
            move.name = "MoveLogic";

            this.addNode(patrol);
            this.addNode(attack);
            this.addNode(move);
        }

        public startLogic(name: string) {
            super.startLogic(name);
        }

        public tick(time: number, delay: number) {
            super.tick(time, delay);
        }
    }

    

}

