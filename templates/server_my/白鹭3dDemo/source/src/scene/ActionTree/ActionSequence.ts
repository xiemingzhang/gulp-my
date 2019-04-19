module egret3d {

    //序列执行的行为;
    export class ActionSequence extends ActionNode {

        private _currIndex: number;
        private _currAction: ActionNode;
        private _currActivate: boolean;
        private _actions: ActionNode[] = [];

        public constructor(actions: ActionNode[]) {
            super();
            this._currIndex = 0;
            this._actions = actions;
            this._currActivate = false;
            this._currAction = this._actions[this._currIndex];
        }

        //重置行为对象;
        public onResetAction(self: GameActor): void {
            this._currIndex = 0;
            this._currActivate = false;
            this._currAction = this._actions[this._currIndex];
            for (var i: number = 0; i < this._actions.length; i++) {
                this._actions[i].onResetAction(self);
            }
        }

        //是否激活;
        public onIsActivate(self: GameActor): boolean {
            return !this.onIsComplete(self);
        }

        //逻辑Tick;
        public onTick(self: GameActor, time: number, delay: number): void {

            if (this._currAction) {

                this._currActivate = this._currActivate || this._currAction.onIsActivate(self);

                if (this._currActivate) {

                    this._currAction.onTick(self, time, delay);

                    if (this._currAction.onIsComplete(self)) {
                        this._currAction = null;
                        this._currIndex++;
                        if (this._currIndex < this._actions.length) {
                            this._currAction = this._actions[this._currIndex];
                            this._currActivate = this._currAction.onIsActivate(self);
                        }
                    }
                }
            }
        }

        //是否完成;
        public onIsComplete(self: GameActor): boolean {
            return this._currIndex >= this._actions.length;
        }

    }

}