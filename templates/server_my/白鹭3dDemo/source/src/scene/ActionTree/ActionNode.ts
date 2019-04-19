﻿module egret3d {

    export class ActionNode {

        //重置行为对象;
        public onResetAction(self: GameActor): void {
        }

        //是否激活;
        public onIsActivate(self: GameActor): boolean {
            return false;
        }

        //逻辑Tick;
        public onTick(self: GameActor, time: number, delay: number): void {
        }

        //是否完成;
        public onIsComplete(self: GameActor): boolean {
            return true;
        }
    }

}