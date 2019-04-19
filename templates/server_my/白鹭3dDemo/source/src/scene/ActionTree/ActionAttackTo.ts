module egret3d {

    //巡逻到指定点的Action;
    export class ActionAttackTo extends ActionNode {

        private _targetPoint: Vector3D;
        private _attackTarget: GameActor;
        private _actionMoveTo: ActionMoveTo;
        private _actionAttackTarget: ActionAttackTarget;

        public constructor(targetPoint: Vector3D) {
            super();
            this._attackTarget = null;
            this._targetPoint = targetPoint;
            this._actionAttackTarget = null;
        }

        //重置行为对象;
        public onResetAction(self: GameActor): void {
            this._attackTarget = null;
        }

        //是否激活;
        public onIsActivate(self: GameActor): boolean {
            return !this.onIsComplete(self);
        }

        //逻辑Tick;
        public onTick(self: GameActor, time: number, delay: number): void {

            if (this._actionAttackTarget) {

                this._actionAttackTarget.onTick(self, time, delay);

                if (this._actionAttackTarget.onIsComplete(self)) {

                    this._attackTarget = null;

                    this._actionAttackTarget = null;
                }
            }
            else if (this._actionMoveTo) {

                this._actionMoveTo.onTick(self, time, delay);

                if (this._actionMoveTo && this._actionMoveTo.onIsComplete(self)) {

                    this._actionMoveTo = null;

                    self.isMove = false;
                }
            }
            else {

                var enemyActors: GameActor[] = [];

                self.findNearEnemy(enemyActors);

                if (enemyActors.length > 0 && Vector3D.distance(enemyActors[0].position, self.position) < self.itemConfig.attack_range) {

                    this._actionAttackTarget = new ActionAttackTarget(this._attackTarget = enemyActors[0], self.itemConfig.skill_0_id);

                    this._actionAttackTarget.onIsActivate(self);

                    this._actionMoveTo = null;

                    self.isMove = false;
                    //self.animLock = true;
                    self.changeState("Idle", 1.0, false);
                }
                else {

                    var nav: NavGrid = sceneManager.currentScene.nav;

                    if (nav.xToGridX(self.position.x) != nav.xToGridX(this._targetPoint.x) || nav.yToGridY(self.position.z) != nav.yToGridY(this._targetPoint.z)) {

                        this._actionMoveTo = new ActionMoveTo(this._targetPoint);

                        this._actionMoveTo.onIsActivate(self);

                        this._actionMoveTo.setTestCallback(function () {
                            var enemyActors: GameActor[] = [];
                            self.findNearEnemy(enemyActors);
                            if (enemyActors.length > 0 && Vector3D.distance(enemyActors[0].position, self.position) < self.itemConfig.attack_range) {
                                this._actionAttackTarget = new ActionAttackTarget(this._attackTarget = enemyActors[0], self.itemConfig.skill_0_id);
                                this._actionAttackTarget.onIsActivate(self);
                                this._actionMoveTo = null;
                                self.isMove = false;
                                //self.animLock = true;
                                self.changeState("Idle", 1.0, false);
                                return false;
                            }
                            return true;
                        }, this);
                    }
                    
                }
            }

        }

        //是否完成;
        public onIsComplete(self: GameActor): boolean {

            if (this._attackTarget) {
                return false;
            }
            else if (Vector3D.distance(self.position, this._targetPoint) > 24) {
                return false;
            }
            else {
                var enemyActors: GameActor[] = [];

                self.findNearEnemy(enemyActors);

                if (enemyActors.length > 0 && Vector3D.distance(enemyActors[0].position, self.position) < self.itemConfig.attack_range) {
                    return false;
                }
            }

            self.isMove = false;
            return true;
        }
    }

}