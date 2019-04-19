module egret3d {

    export class LogicManager {

        public sceneID: number = 100000;
        public currentGameRoom: GameRoom;
        public cancelMove: boolean = false;


        private _localStorageData: { [key: string]: any } = {};

        constructor() {


        }

        public getLocalStorageItem(key: string): any {

            try {
                return localStorage.getItem(key);
            }
            catch (e) {
                return this._localStorageData[key] || "";
            }
        }

        public setLocalStorageItem(key: string, value: string): void {
            try {
                localStorage.setItem(key, value);
            }
            catch (e) {
                this._localStorageData[key] = value;
            }
        }

        private initGrassSqueeze(): void {
            var scene: Scene3D = <Scene3D>RES.getRes("scene/scene_0/MapConfig.json");
        }

        public startGameRoom() {

            this.currentGameRoom = new GameRoom();
            this.currentGameRoom.useMap(this.sceneID);

            var gameActor: GameActor = this.currentGameRoom.addRole(100000, 0, true);
            gameActor.performer = gameActor.performer || new ProtagonistLogic();
            gameActor.performer.self = gameActor;
            gameActor.performer.gameRoom = this.currentGameRoom;
            gameActor.performer.initConfig(null);
            gameActor.performer.startLogic("PatrolLogic");

            this.currentGameRoom.start();

        }

        public start() {
            this.startGameRoom();
        }

        public exit() {
            this.currentGameRoom.closeGameRoom();
            sceneManager.leaveScene(sceneManager.currentScene);
            // uiManager.removeBattleUI();
            // uiManager.removeAllHpBar();
            // skillManager.removeGUI();
            // uiManager.roomView.onEnterPage();
            uiManager.leaveBattle();
            uiManager.showPage(new RoomPage())
        }

        public update(time: number, delay: number) {
            if (this.currentGameRoom)
                this.currentGameRoom.update(time, delay);
        }

    }

    export class GameScene extends Scene3D {
        private _terrainCollision: TerrainCollision;
        private _nav: NavGrid;
        private _lineFog: LineFogMethod;

        public terrainMesh: Mesh;
        constructor() {
            super();
        }

        public initEffect() {
            this._lineFog = new LineFogMethod();
            this._lineFog.fogFarDistance = 1400;
            this._lineFog.fogStartDistance = 3000;
            this._lineFog.fogColor = Color.RGBAToColor(0.0, 192.0 / 255.0, 1.0, 1.0);
            this._lineFog.fogAlpha = 1.0;
            this.addFog(this);
        }

        private addFog(obj: Object3D) {
            for (var s in obj.childs) {
                if (obj.childs[s] instanceof Mesh) {
                    (<Mesh>obj.childs[s]).material.diffusePass.addMethod(this._lineFog);
                } else {
                    this.addFog(obj.childs[s]);
                }
            }
        }

        public initTerrainCollision(m: Mesh) {
            this.terrainMesh = m;
            //this._terrainCollision = new TerrainCollision(this.terrainMesh);
        }

        public initNav(nav: NavGrid) {
            this._nav = nav;

        }

        public getTerrainHeight(x: number, z: number): number {
            if (this._terrainCollision)
                return this._terrainCollision.getTerrainCollisionHeight(x, z);
            else
                return 0;
        }

        public get nav(): NavGrid {
            return this._nav;
        }

        public get terrainCollision(): TerrainCollision {
            return this._terrainCollision;
        }

    }

    //游戏关卡控制;
    export class GameLevel {

        private _gameRoom: GameRoom;
        private _waveItem: WaveItem;
        private _sceneItem: SceneItem;
        private _refreshMonsterTimer: number;
        private _event3D: egret3d.Event3D;
        private _monsterNum: number[] = [0, 0, 0, 0, 0];
        public host: GameActor;

        constructor() {
            this._refreshMonsterTimer = 0;
            this._event3D = new egret3d.Event3D();
        }

        public start(gameRoom: GameRoom): void {

            this._gameRoom = gameRoom;

            this._sceneItem = gameRoom.sceneItem;

            this._waveItem = TableManager.findWaveTableItem(this._sceneItem.wave_id);

            //创建塔对象;
            var v = JSON_Util.getVector3D(this._sceneItem.host_point);
            this.host = gameRoom.addRole(this._sceneItem.host_unit_id, 0, false);
            this.host.jumpTo(v.x, v.z);
            clearTimeout(this._refreshMonsterTimer);
            this._refreshMonsterTimer = setTimeout(() => this.onRefreshMonster(), this._sceneItem.start_wait);
        }

        //怪物刷新;
        protected onRefreshMonster(): void {

            var monsterIdArray: number[] = [
                this._waveItem.monsterA_id,
                this._waveItem.monsterB_id,
                this._waveItem.monsterC_id,
                this._waveItem.monsterD_id,
                this._waveItem.monsterE_id,
            ];

            var monsterNumArray: number[] = [
                this._waveItem.monsterA_num,
                this._waveItem.monsterB_num,
                this._waveItem.monsterC_num,
                this._waveItem.monsterD_num,
                this._waveItem.monsterE_num,
            ];

            var monsterPointArray: string[] = [
                this._gameRoom.sceneItem.monster_point_0,
                this._gameRoom.sceneItem.monster_point_1,
                this._gameRoom.sceneItem.monster_point_2,
                this._gameRoom.sceneItem.monster_point_3,
                this._gameRoom.sceneItem.monster_point_4,
            ];

            var v2 = JSON_Util.getVector3D(this._gameRoom.sceneItem.host_point);

            for (var i: number = monsterIdArray.length - 1; i >= 0; i--) {

                if (monsterIdArray[i] > 0 && this._monsterNum[i] < monsterNumArray[i]) {

                    var v = JSON_Util.getVector3D(monsterPointArray[i]);

                    var gameActor: GameActor = this._gameRoom.addRole(monsterIdArray[i], 2, false);

                    gameActor.jumpTo(v.x, v.z);

                    //指定怪物AI;
                    gameActor.runAction(new ActionRepeat(new ActionSequence([new ActionAttackTo(JSON_Util.getVector3D(this._gameRoom.sceneItem.host_point)), new ActionDelay(400)]), -1));

                    this._monsterNum[i]++;
                }
            }

            //当前波怪物是否已经刷完;
            if (this._monsterNum[0] >= this._waveItem.monsterA_num &&
                this._monsterNum[1] >= this._waveItem.monsterB_num &&
                this._monsterNum[2] >= this._waveItem.monsterC_num &&
                this._monsterNum[3] >= this._waveItem.monsterD_num &&
                this._monsterNum[4] >= this._waveItem.monsterE_num) {

                //是否还有下一波，如果有就更新下一波的配置，并且等待一段时间
                if (this._waveItem.next_wave > 0) {

                    if (this._waveItem = TableManager.findWaveTableItem(this._waveItem.next_wave)) {

                        //清空出怪计数;
                        this._monsterNum[0] =
                            this._monsterNum[1] =
                            this._monsterNum[2] =
                            this._monsterNum[3] =
                            this._monsterNum[4] = 0;
                    }
                }
                else {
                    this._waveItem = null;
                }
                clearTimeout(this._refreshMonsterTimer);
                this._refreshMonsterTimer = setTimeout(() => this.onCheckMonster(), 3000);
            }
            else {
                //每秒刷一只;
                clearTimeout(this._refreshMonsterTimer);
                this._refreshMonsterTimer = setTimeout(() => this.onRefreshMonster(), 1000);
            }
        }

        protected onCheckMonster(): void {

            if (this.host.isDeath) {
                return;
            }

            if (this._gameRoom.getActorNumFromGroupID(2) <= 0) {
                if (this._waveItem) {
                    this.onRefreshMonster();
                }
                else {
                    //最后一波杀完了提示通关！;
                    logicManager.setLocalStorageItem(this._sceneItem.next_scene_id.toString(), "false");
                    this._gameRoom.gameOver();
                }
            }
            else {
                clearTimeout(this._refreshMonsterTimer);
                this._refreshMonsterTimer = setTimeout(() => this.onCheckMonster(), 3000);
            }
        }
    }

    export class GameRoom extends egret3d.EventDispatcher {

        //主角死亡事件;
        public static EVENT_MAIN_ACTOR_DEATH: string = "event_main_actor_death";
        //游戏结束;
        public static EVENT_GAME_OVER: string = "event_game_over";

        public actorlist: GameActor[];
        public gameScene: GameScene;
        public gameController: GameController;
        public isGameOver: boolean;

        public sceneItem: SceneItem;
        public monsterItem: UnitItem[] = [];
        public playerItem: UnitItem;
        public levelItem: WaveItem;

        //private _levelLogic: LevelLogic;
        private _gameLevel: GameLevel;
        private _event3D: egret3d.Event3D;
        private _mainActorIsDeath: boolean;
        private _rebirthBut: gui.UILabelButton
        private _crystalMesh: Object3D;
        constructor() {
            super();
            this.actorlist = [];
            this._event3D = new egret3d.Event3D();
            this.gameController = new GameController();
            //this._levelLogic = new LevelLogic();
            this._gameLevel = new GameLevel();
            this._mainActorIsDeath = false;
            this.isGameOver = false;
        }



        public start() {

            var point = JSON_Util.getVector3D(this.sceneItem.player_point);
            this.setStartPosition(point.x, point.z);

            ////level
            ////生成怪物
            ////怪物移动到目标 & 检测可攻击目标  
            //this._levelLogic.initConfig(null);
            //this._levelLogic.gameRoom = this; 
            //this._levelLogic.startLogic("DelayLogic");

            this._gameLevel.start(this);

            this._mainActorIsDeath = false;

            // this._rebirthBut = new gui.UILabelButton();
            // this._rebirthBut.label = "复活";
            //  this._rebirthBut.addEventListener(egret3d.MouseEvent3D.MOUSE_DOWN, function () {
            // this.resetRole(this.gameController.mainActor);
            // }, this);
            //sceneManager.view.addGUI(this._rebirthBut);
            this._crystalMesh = sceneManager.currentScene.findObject3D("Crystal");
            this.isGameOver = false;
            // uiManager.startTimeKeeper();
            uiManager.startTimeKeeper();
        }

        public closeGameRoom(): void {
            for (const r of this.actorlist) {
                this.removeRole(r);
            }
        }

        public getActorNumFromGroupID(groupID: number): number {
            var count: number = 0;
            for (var i: number = this.actorlist.length - 1; i >= 0; i--) {
                if (this.actorlist[i].groupID == groupID) {
                    count++;
                }
            }
            return count;
        }

        public setStartPosition(x: number, z: number) {
            this.gameController.mainActor.jumpTo(x, z);
            gameCameraManager.follow(this.gameController.mainActor);
        }

        public addRole(id: number, group: number, isMain: boolean): GameActor {
            var item = TableManager.findUnitTableItem(id);
            var role = playerManager.getRole(item.asset_id);
            role = role ? role.clone() : null;

            var gameActor: GameActor = new GameActor();

            if (isMain) {
                this.playerItem = item;
                this.gameController.mainActor = gameActor;
            }

            gameActor.groupID = group;
            gameActor.gameRoom = this;
            gameActor.setRole(role, item);
            this.actorlist.push(gameActor);
            this.gameScene.addChild(gameActor);
            gameActor.onBeAdded();

            return gameActor;
        }

        public resetRole(gameActor: GameActor): GameActor {
            gameActor.rebirth();
            if (this.actorlist.indexOf(gameActor) < 0) {
                this.actorlist.push(gameActor);
                this.gameScene.addChild(gameActor);
                gameActor.onBeAdded();
            }
            if (gameActor == this.gameController.mainActor) {
                this._mainActorIsDeath = false;
            }
            return gameActor;
        }

        public removeRole(gameActor: GameActor): void {
            var index: number = this.actorlist.indexOf(gameActor);
            if (index >= 0) {
                this.actorlist.splice(index, 1);
            }
            this.gameScene.removeChild(gameActor);
            gameActor.onBeRemove();
        }

        public useMap(id: number) {
            this.sceneItem = TableManager.findSceneTableItem(id);
            if (this.gameScene)
                sceneManager.leaveScene(this.gameScene);
            sceneManager.enterScene(this.sceneItem.asset_id);
            this.gameScene = sceneManager.currentScene;
            if (this.gameScene.terrainMesh)
                this.gameScene.terrainMesh.addEventListener(PickEvent3D.PICK_DOWN, this.pickMove, this);
        }

        private gPoint: egret3d.Vector3D = new egret3d.Vector3D();
        private pickMove(e: PickEvent3D) {
            console.log("walk")
            if (!this.gameController.mainActor.lockMove && !this.gameController.mainActor.isDeath && !logicManager.cancelMove) {
                this.gPoint.copyFrom(e.pickResult.globalPosition);
                this.gameController.mainActor.runAction(new ActionSequence([new ActionMoveTo(this.gPoint), new ActionAttackTo(this.gPoint)]));
            }
            logicManager.cancelMove = false;
        }

        public gameOver(): void {
            this.isGameOver = true;
            this._event3D.eventType = GameRoom.EVENT_GAME_OVER;
            this.dispatchEvent(this._event3D);
            // timemer.timing(1000, () => uiManager.showEndingView(), null);
            timemer.timing(1000, () => uiManager.showEnding(), null);
        }

        public update(time: number, delay: number) {
            if (this._gameLevel.host.isDeath && this._crystalMesh.visible) {
                var effect: EffectGroup = sceneManager.currentScene.findObject3D("Fx_TowerExplode_01") as EffectGroup;
                effect.play(1.0, true);
                effect.addEventListener(AnimationEvent3D.COMPLETE, this.gameOver, this);
                this._crystalMesh.visible = false;
            }

            if (!this._mainActorIsDeath) {
                for (const r of this.actorlist) {
                    if (r.x == undefined) {
                        r.y = 0;//sceneManager.currentScene.getTerrainHeight(r.x, r.z);
                    }
                    r.y = sceneManager.currentScene.getTerrainHeight(r.x, r.z) + 10;

                    if (r.isDeath) {
                        var index: number = this.actorlist.indexOf(r);
                        if (index >= 0) {
                            this.actorlist.splice(index, 1);
                            r.onBeRemove();
                        }
                        if (r != this.gameController.mainActor) {
                            timemer.timing(3000, this.removeRole, this, r);
                        }
                        else {
                            this._mainActorIsDeath = true;
                            this.gameOver();
                        }
                        //播放死亡音效;
                        if (r.itemConfig.death_sound.length > 0) {
                            r.playAudio(r.itemConfig.death_sound);
                        }

                    }
                }
            }

            gameCameraManager.update(time, delay);

            //if (this._levelLogic)
            //    this._levelLogic.tick(time, delay);
        }
    }




    export class GameController {
        private _mainGameActor: GameActor;
        public set mainActor(actor: GameActor) {
            this._mainGameActor = actor;
        }

        public get mainActor(): GameActor {
            return this._mainGameActor;
        }
    }

    export var logicManager: LogicManager = new LogicManager();
}