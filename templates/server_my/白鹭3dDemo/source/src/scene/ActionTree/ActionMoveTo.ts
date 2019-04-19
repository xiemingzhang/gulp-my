module egret3d {

    //移动到指定位置的行为;
    export class ActionMoveTo extends ActionNode {

        private _moveNeedTime: number;
        private _currIndex: number;
        private _targetPoint: Vector3D;
        private _pathPoints: Vector3D[];
        private _direction: Vector3D;
        private _callbackObj: any;
        private _callbackFun: Function;

        public constructor(targetPoint: Vector3D) {
            super();
            this._currIndex = 0;
            this._moveNeedTime = 0;
            this._pathPoints = [];
            this._direction = new Vector3D();
            this._targetPoint = targetPoint;
        }

        public setTestCallback(callbackFun: Function, callbackObj: any): void {
            this._callbackObj = callbackObj;
            this._callbackFun = callbackFun;

        }

        //重置目标点;
        public resetTargetPoint(targetPoint: Vector3D): void {
            this._targetPoint = targetPoint;
        }

        //重置行为对象;
        public onResetAction(self: GameActor): void {
            this.updatePathPoints(self);
        }

        //是否激活;
        public onIsActivate(self: GameActor): boolean {

            if (this._pathPoints.length <= 0) {
                //这里调用寻路返回的路径点;
                this.updatePathPoints(self);
            }

            return this._moveNeedTime > 0;
        }

        //逻辑Tick;
        public onTick(self: GameActor, time: number, delay: number): void {

            var nav: NavGrid = sceneManager.currentScene.nav;

            while (delay > 0) {

                if (this._currIndex >= this._pathPoints.length || self.lockMove) {
                    break;
                }

                this._moveNeedTime -= delay;
                self.isMove = true;
                self.changeState("Run", 1.0, false);

                if (this._moveNeedTime >= 0) {

                    var value: number = delay * 0.001 * self.moveSpeed;

                    var oldX: number = nav.xToGridX(this._pathPoints[this._currIndex].x);
                    var oldZ: number = nav.yToGridY(this._pathPoints[this._currIndex].z);

                    if (false == nav.isPass(oldX, oldZ) && nav.getUserData(oldX, oldZ) != self.actorId) {
                        this.updatePathPoints(self);
                        if (this._currIndex >= this._pathPoints.length) {
                            break;
                        }
                    }
                    else {
                        if (nav.getUserData(nav.xToGridX(self.x), nav.yToGridY(self.z)) == self.actorId) {
                            nav.setUserData(nav.xToGridX(self.x), nav.yToGridY(self.z), 0);
                        }
                        self.x += this._direction.x * value;
                        self.z += this._direction.z * value;
                        if (nav.getUserData(nav.xToGridX(self.x), nav.yToGridY(self.z)) == 0) {
                            nav.setUserData(nav.xToGridX(self.x), nav.yToGridY(self.z), self.actorId);
                        }
                    }

                    delay = 0;
                }
                else {
                    delay = -this._moveNeedTime;
                    self.x = this._pathPoints[this._currIndex].x;
                    self.z = this._pathPoints[this._currIndex].z;

                    if (this._callbackFun && (nav.isPass(nav.xToGridX(self.x), nav.yToGridY(self.z)) || nav.getUserData(nav.xToGridX(self.x), nav.yToGridY(self.z)) == self.actorId)) {
                        if (false == this._callbackFun.call(this._callbackObj, this)) {
                            break;
                        }
                    }

                    if (this._currIndex + 1 >= this._pathPoints.length) {
                        this._moveNeedTime = 0;
                        this._currIndex = this._pathPoints.length;
                        break;
                    }

                    this.moveTo(self, this._pathPoints[++this._currIndex]);
                }
            }
        }

        //是否完成;
        public onIsComplete(self: GameActor): boolean {
            if (this._moveNeedTime <= 0 && this._currIndex >= this._pathPoints.length) {
                self.isMove = false;
                self.changeState("Idle", 1.0, false);
                return true;
            }
            return false;
        }

        private moveTo(self: GameActor, targetPoint: egret3d.Vector3D): void {

            this._moveNeedTime = Vector3D.distance(self.position, targetPoint) / (self.moveSpeed * 0.001);

            targetPoint.subtract(self.position, this._direction);

            this._direction.normalize();

            self.actorTrunToDirection(this._direction.x, this._direction.z);
            self.isMove = true;
            //self.changeState("Run", 1.0, false);
        }

        private updatePathPoints(self: GameActor): void {
            this._currIndex = 0;
            this._moveNeedTime = 0;
            var nav: NavGrid = sceneManager.currentScene.nav;
            sceneManager.currentScene.nav.findPath(self.position, this._targetPoint, this._pathPoints);
            if (this._pathPoints.length > 0) {
                this.moveTo(self, this._pathPoints[this._currIndex]);
            }
        }
    }

}