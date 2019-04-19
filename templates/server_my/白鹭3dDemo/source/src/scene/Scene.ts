module egret3d {
    export class Scene {
        private _gameMain: GameMain;

        public static root: View3D;

        private view: View3D;

        public constructor(private stage3d: egret3d.Stage3D) {
            Egret3DEngine.instance.useDevicePOLICY(0);
            Egret3DEngine.instance.debug = false;
            Egret3DPolicy.useAnimPoseInterpolation = true;
            Egret3DPolicy.useAnimMixInterpolation = true;
            Egret3DPolicy.useParticle = true;
            Egret3DPolicy.useLowLoop = true;

            // 添加view
            this.view = new View3D(0, 0, stage3d.width, stage3d.height);
            Scene.root = this.view;
            this.stage3d.addView3D(this.view);

            // 游戏逻辑类
            this._gameMain = new GameMain();

        }

        async createGameScene() {

            sceneManager.gameMain = this._gameMain;

            sceneManager.view = this.view;

            sceneManager.view.width = this.stage3d.width;
            sceneManager.view.height = this.stage3d.height;

            gameCameraManager.currentCamera = this.view.camera3D;

            window.addEventListener("resize", () => this.resize());

            try {
                await RES.loadConfig();
                await RES.getResAsync("ui/gameUI.json");
                await RES.getResAsync("ui/bg.jpg");
                await RES.getResAsync("ui/ui.json");
            }
            catch (e) {
                console.error(e)
            }

            this.initLoginView();
        }

        private initLoginView() {
            let resources = [
                "ShadowPlane.png",
                "table/scene.json",
                "table/skills.json",
                "table/wave.json",
                "table/unit.json",
                "table/upgrade.json",
                "table/equip.json"
            ]

            let callback = function () {
                (TableManager.instance = new TableManager()).onInitialize();//初始化配置表
                let login = new LoginPage();
                uiManager.showPage(login)
            }
            let loadingPage = new LoadingPage(resources, callback, this);
            uiManager.showPage(loadingPage);

            this.stage3d.addEventListener(Event3D.ENTER_FRAME, function (e: Event3D) {
                if (this._gameMain)
                    this._gameMain.update(e.time, e.delay);
            }, this);
        }

        private resize() {
            setTimeout(() => {
                sceneManager.view.width = this.stage3d.width;
                sceneManager.view.height = this.stage3d.height;
            }, 301);
        }
    }
}