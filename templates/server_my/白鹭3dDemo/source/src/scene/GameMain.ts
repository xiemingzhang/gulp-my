module egret3d {

    export class GameMain {
        constructor() {

        }

        public start(): void {
            logicManager.start();
            effectManager.start();
        }


        public update(time: number, delay: number) {
            if (sceneManager.currentScene) {
                logicManager.update(time, delay);
                // uiManager.update(time, delay);
                uiManager.updateBattle(time, delay);
                effectManager.update(time, delay);
            }
        }

        public onResize() {
            // skillManager.onResize();
            // uiManager.onResize();
        }
    }


}