module egret3d {

    //重复执行指定Action的行为;
    export class ActionRepeat extends ActionNode {

        private _action: ActionNode;
        private _loopCount: number;
        private _forever: boolean;
        private _isContinue: boolean;

        public constructor(action: ActionNode, loopCount: number) {
            super();
            this._action = action;
            this._forever = loopCount <= 0;
            this._loopCount = loopCount;
            this._isContinue = false;
        }

        //重置行为对象;
        public onResetAction(self: GameActor): void {
            this._isContinue = false;
            this._action.onResetAction(self);
        }

        //是否激活;
        public onIsActivate(self: GameActor): boolean {
            return this._isContinue = this._action.onIsActivate(self);
        }

        //逻辑Tick;
        public onTick(self: GameActor, time: number, delay: number): void {

            this._action.onTick(self, time, delay);

            if (this._action.onIsComplete(self)) {

                this._isContinue = false;

                this._loopCount--;

                if (this._forever || this._loopCount > 0) {

                    this._action.onResetAction(self);

                    this._action.onIsActivate(self);

                    this._isContinue = true;//this._action.onIsActivate(self);
                }
            }

        }

        //是否完成;
        public onIsComplete(self: GameActor): boolean {
            return !this._isContinue;
        }
    }


}