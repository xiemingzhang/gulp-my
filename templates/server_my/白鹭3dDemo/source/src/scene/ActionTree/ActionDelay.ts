module egret3d {

    //延迟指定时间的Action;
    export class ActionDelay extends ActionNode {

        private _delay: number;
        private _delay_time: number = 0;

        public constructor(delay: number) {
            super();
            this._delay = delay;
            this._delay_time = this._delay;
        }

        //重置行为对象;
        public onResetAction(self: GameActor): void {
            this._delay_time = this._delay;
        }

        //是否激活;
        public onIsActivate(self: GameActor): boolean {
            return this._delay_time > 0;
        }

        //逻辑Tick;
        public onTick(self: GameActor, time: number, delay: number): void {
            this._delay_time -= delay;
        }

        //是否完成;
        public onIsComplete(self: GameActor): boolean {
            return this._delay_time <= 0;
        }
    }

}