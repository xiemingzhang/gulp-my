module egret3d {

    //攻击指定目标的行为;
    export class ActionAttackTarget extends ActionNode {

        private _state: number;
        private _delayTime: number;
        private _complete: boolean;
        private _attackTarget: GameActor;
        private _skillTable: SkillsItem;
        private _actionMoveTo: ActionMoveTo;

        public constructor(attackTarget: GameActor, skillsId: number) {
            super();
            this._state = 0;
            this._delayTime = 300;
            this._complete = false;
            this._attackTarget = attackTarget;
            this._actionMoveTo = null;
            this._skillTable = TableManager.findSkillsTableItem(skillsId);
        }

        //重置行为对象;
        public onResetAction(self: GameActor): void {
            this._state = 0;
            this._delayTime = 300;
            this._complete = false;
        }

        //是否激活;
        public onIsActivate(self: GameActor): boolean {
            return this._skillTable && !this._attackTarget.isDeath;
        }

        //逻辑Tick;
        public onTick(self: GameActor, time: number, delay: number): void {

            this._delayTime -= delay;

            switch (this._state) {
                case 0://移动追逐;
                    if (Vector3D.distance(this._attackTarget.position, self.position) > this._skillTable.range ) {
                        if (!this._actionMoveTo) {
                            this._actionMoveTo = new ActionMoveTo(this._attackTarget.position);
                            this._actionMoveTo.onIsActivate(self);
                        }
                        //没有进入施法攻击范围，朝目标移动;
                        this._actionMoveTo.onTick(self, time, delay);
                        if (this._delayTime <= 0 || this._actionMoveTo.onIsComplete(self)) {
                            this._delayTime = 300;
                            this._actionMoveTo.resetTargetPoint(this._attackTarget.position);
                            this._actionMoveTo.onResetAction(self);
                        }
                    }
                    else {
                        //进入前摇状态;
                        this._state = 1;
                        this._delayTime = this._skillTable.use_attack_speed ? this._skillTable.start_time * (1.0 / self.actorData.attack_speed) : this._skillTable.start_time;
                        self.isMove = false;
                        self.actorTrunToDirection(this._attackTarget.position.x - self.position.x, this._attackTarget.position.z - self.position.z);
                        var isCrit: boolean = damageTools.preCrit(this._skillTable, self);
                        //进行状态切换, 攻击动作，攻击特效，攻击音效
                        self.cast(this._skillTable.id, isCrit);
                    }
                    break;
                case 1://前摇状态;
                    if (this._delayTime <= 0) {
                        this._state = 2;//进入定身;
                        this._delayTime = this._skillTable.use_attack_speed ? this._skillTable.lock_time * (1.0 / self.actorData.attack_speed) : this._skillTable.lock_time;
                        //标记GameActor不可移动;
                        self.lockMove = true;
                        self.lockSkills = this._skillTable.id != self.itemConfig.skill_0_id;
                        self.actorData.mp -= this._skillTable.mp;


                        //------开始计算技能;
                        var attackTargets: GameActor[] = [];

                        switch (this._skillTable.attack_type) {
                            default://单体攻击;
                                attackTargets.push(this._attackTarget);
                                break;
                            case 1://群体攻击;
                                self.findNearEnemy(attackTargets, this._skillTable.attack_range);
                                break;
                        }

                        for (var z: number = attackTargets.length - 1; z >= 0; z--) {

                            var target: GameActor = attackTargets[z];

                            var oldDeathStae: boolean = target.isDeath;

                            if (!oldDeathStae) {

                                //计算 数值状态
                                damageTools.calculateDamage(this._skillTable, self, attackTargets);

                                //更新差量,显示需要先的数据
                                //self.updateActorData();
                                var hit = target.updateActorData();
                                if (hit) {
                                    target.hit(this._skillTable.hit_effect_name);
                                }

                                if (target.isDeath) {
                                    target.changeState("Death", 1.0, true);
                                } else if (target != self.gameRoom.gameController.mainActor) {
                                    target.changeState("Hit", 1.0, true);
                                }
                                if (self == self.gameRoom.gameController.mainActor) {
                                    // uiManager.hits();
                                    uiManager.hits();
                                }

                                if (self == self.gameRoom.gameController.mainActor && target.isDeath) {
                                    self.addExp(target.itemConfig.exp);
                                }
                            }
                        }
                        //------技能计算结束;
 
                    }
                    self.actorTrunToDirection(this._attackTarget.position.x - self.position.x, this._attackTarget.position.z - self.position.z);
                    break;
                case 2://定身状态;
                    if (this._delayTime <= 0) {
                        this._state = 3;//进入后摇;
                        this._delayTime = this._skillTable.use_attack_speed ? this._skillTable.end_time * (1.0 / self.actorData.attack_speed) : this._skillTable.end_time;
                        //解除GameActor不可移动;
                        self.lockMove = false;
                    }
                    break;
                case 3://后摇状态;
                    if (this._delayTime <= 0) {
                        self.lockSkills = false;
                        if (this._skillTable.trigger_skills_id > 0) {
                            //触发下一段技能;
                            this._state = 1;
                            this._skillTable = TableManager.findSkillsTableItem(this._skillTable.trigger_skills_id);
                            this._delayTime = this._skillTable.use_attack_speed ? this._skillTable.start_time * (1.0 / self.actorData.attack_speed) : this._skillTable.start_time;
                        }
                        else {
                            this._complete = true;
                        }
                    }
                    self.actorTrunToDirection(this._attackTarget.position.x - self.position.x, this._attackTarget.position.z - self.position.z);
                    break;
            }
        }

        //是否完成;
        public onIsComplete(self: GameActor): boolean {
            return /*this._attackTarget.isDeath && */ this._complete;
        }

        private playSkill_effect(self: GameActor, name: string, speed: number) {
            var effect = effectManager.getEffect(name);
            if (effect) {
                effect.play(speed, true);
                effect.x = self.x;
                effect.y = self.y;
                effect.z = self.z;
                effect.rotationY = self.rotationY;
                self.parent.addChild(effect);
            }
        }
    }

}