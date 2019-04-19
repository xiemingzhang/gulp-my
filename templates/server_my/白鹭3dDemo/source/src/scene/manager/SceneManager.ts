module egret3d {
    export class SceneManager {
        private _currentMap: number = 0;
        private _currentScene: GameScene;

        public gameMain: GameMain;

        private _view: View3D;

        constructor() {

        }

        public set view(v: View3D) {
            this._view = v;
        }

        public get view(): View3D {
            return this._view;
        }

        public enterScene(assetesID: number) {

            var mapURL = "scene/" + assetesID + "/Scene.e3dPack";

            this._currentScene = new GameScene();
            var tmp = RES.getRes(mapURL);
            this._currentScene.addChild(tmp);
            this._currentScene.initEffect()
            var nav: NavGrid = NavGrid.createNavGridFromBuffer(RES.getRes("scene/" + assetesID + "/NavGrid.nav"));


            var terrain: Mesh = <Mesh>tmp.findObject3D("TerrainCollider");
            if (terrain) {
                terrain.pickType = PickType.PositionPick;
                terrain.enablePick = true;
                terrain.canPick = true;
                this._currentScene.initTerrainCollision(terrain);
            }
            if (nav) {
                this._currentScene.initNav(nav);
            }
            this._view.scene = this._currentScene;
            //let a = new Mesh(new PlaneGeometry(3000,3000));
            //this._currentScene.addChild(a);
            //a.z = 3000;
            //a.x = 0;
            //a.y = 50;


            function buildGrid(): void {
                var vertexs: number[] = [];
                var wireframe: egret3d.Wireframe;
                //                var gridoffsetX: number = -(nav.colNum * nav.gridWidth * 0.5 - nav.gridWidth * 0.5);
                //                var gridoffsetY: number = -(nav.rowNum * nav.gridHeight * 0.5 - nav.gridHeight * 0.5);
                var gridoffsetX: number = 0;
                var gridoffsetY: number = 0;
                var terrain1: egret3d.Terrain = <egret3d.Terrain>tmp.findObject3D("Terrain");
                //                wireframe.x = terrain1.x;
                //                wireframe.z = terrain1.z;
                for (var y: number = 0; y < nav.rowNum; y++) {
                    for (var x: number = 0; x < nav.colNum; x++) {
                        var lineX: number = gridoffsetX + x * nav.gridWidth;
                        var lineY: number = gridoffsetY + y * nav.gridHeight;
                        if (nav.datas[(nav.rowNum - y - 1) * nav.colNum + x].isPass) {
                            vertexs.push(
                                lineX, 0, lineY, 1, 0, 0, 1,
                                lineX + nav.gridWidth, 0, lineY, 1, 0, 0, 1,

                                lineX + nav.gridWidth, 0, lineY, 1, 0, 0, 1,
                                lineX + nav.gridWidth, 0, lineY + nav.gridHeight, 1, 0, 0, 1,

                                lineX + nav.gridWidth, 0, lineY + nav.gridHeight, 1, 0, 0, 1,
                                lineX, 0, lineY + nav.gridHeight, 1, 0, 0, 1,

                                lineX, 0, lineY + nav.gridHeight, 1, 0, 0, 1,
                                lineX, 0, lineY, 1, 0, 0, 1
                            );
                        }
                        else {
                            vertexs.push(
                                lineX, 0, lineY, 0, 1, 0, 1,
                                lineX + nav.gridWidth, 0, lineY, 0, 1, 0, 1,

                                lineX + nav.gridWidth, 0, lineY, 0, 1, 0, 1,
                                lineX + nav.gridWidth, 0, lineY + nav.gridHeight, 0, 1, 0, 1,

                                lineX + nav.gridWidth, 0, lineY + nav.gridHeight, 0, 1, 0, 1,
                                lineX, 0, lineY + nav.gridHeight, 0, 1, 0, 1,

                                lineX, 0, lineY + nav.gridHeight, 0, 1, 0, 1,
                                lineX, 0, lineY, 0, 1, 0, 1
                            );
                        }
                        if (vertexs.length >= 458640) {
                            wireframe = new egret3d.Wireframe();
                            wireframe.fromVertexsEx(vertexs, egret3d.VertexFormat.VF_POSITION | egret3d.VertexFormat.VF_COLOR);
                            wireframe.material.diffuseColor = 0xffffff;
                            wireframe.y = 2;
                            this._currentScene.addChild(wireframe);
                            //                            wireframe.x = terrain1.x;
                            //                            wireframe.z = terrain1.z;
                            vertexs.length = 0;
                        }
                    }
                }
                if (vertexs.length > 0) {
                    wireframe = new egret3d.Wireframe();
                    wireframe.fromVertexsEx(vertexs, egret3d.VertexFormat.VF_POSITION | egret3d.VertexFormat.VF_COLOR);
                    wireframe.material.diffuseColor = 0xffffff;
                    wireframe.y = 2;
                    vertexs.length = 0;
                    this._currentScene.addChild(wireframe);
                    //                    wireframe.x = terrain1.x;
                    //                    wireframe.z = terrain1.z;
                }

                //                var terrain1: egret3d.Terrain = <egret3d.Terrain>tmp.findObject3D("Terrain");
                //                wireframe.x = terrain1.x;
                //                wireframe.z = terrain1.z;

                // let a = new Mesh(new SphereGeometry(120));
                // this._currentScene.addChild(a);
                // a.x = 0;
                // a.y = 50;
                // a.z = 3000;

                //this._currentScene.addChild(new Mesh(new SphereGeometry(120)));
            }
            //添加测试网格
            // buildGrid.call(this);
        }

        public leaveScene(gameScene: GameScene) {
            this.view.scene = new Scene3D();
            this._currentScene = null;
        }

        public get currentScene(): GameScene {
            return this._currentScene;
        }



        public changeScene(sceneID: number) {

            logicManager.sceneID = sceneID;

            var self = this;

            var sceneItem: SceneItem = TableManager.findSceneTableItem(sceneID);

            if (!sceneItem) {
                console.log(sceneID + " is no exist ")
            }

            var waveItem: WaveItem = TableManager.findWaveTableItem(sceneItem.wave_id);

            var unitItem: UnitItem;
            var skillsItem: SkillsItem


            var filesURL: string[] = [];

            //场景资源
            filesURL.push("scene/" + sceneItem.asset_id + "/Scene.e3dPack");
            filesURL.push("scene/" + sceneItem.asset_id + "/NavGrid.nav");

            var array: string[] = ["A", "B", "C", "D"]

            //怪物资源
            for (var k = 0; k < array.length; k++) {
                if (waveItem) {
                    var monster_id: number = waveItem["monster" + array[k] + "_id"];

                    if (monster_id > 0) {
                        //动作


                        unitItem = TableManager.findUnitTableItem(monster_id);

                        if (unitItem) {
                            filesURL.push("anim/" + unitItem.asset_id + ".e3dPack");
                        }

                        //特效
                        this.getSkillsURL(unitItem, filesURL);
                    }

                }
            }

            //角色资源
            //unitItem = TableManager.findUnitTableItem(logicManager.currentGameRoom.gameController.mainActor.itemConfig.id);   

            unitItem = TableManager.findUnitTableItem(100000);

            //动作
            filesURL.push("anim/" + unitItem.asset_id + ".e3dPack");

            //特效
            this.getSkillsURL(unitItem, filesURL);

            filesURL.push("effects/skill/FX_Hit_01.e3dPack",
                "effects/skill/FX_Hit_02.e3dPack",
                "effects/skill/FX_Hit_03.e3dPack",
                "effects/skill/Fx_Levelup_01.e3dPack");

            let loading = new LoadingPage(filesURL, () => {
                this.gameMain.start();
                uiManager.removePage();
                uiManager.showBattle();
            }, this);
            uiManager.showPage(loading);

        }


        private getSkillsURL(unitItem: any, array: string[]) {
            if (unitItem) {
                var skillsItem: SkillsItem;
                for (var i = 0; i < 5; i++) {
                    var skillID: number = unitItem["skill_" + i.toString() + "_id"];
                    if (skillID > 0) {
                        skillsItem = TableManager.findSkillsTableItem(skillID);
                        var url: string;
                        if (skillsItem && skillsItem.effect_play_name.length > 0) {
                            var tmp: string[] = skillsItem.effect_play_name.split(',');
                            for (var j = 0; j < tmp.length; j++) {
                                url = effectManager.splitUrl(tmp[j]);
                                array.push(url);
                            }
                        }
                    }
                }
            }
        }

    }













    export var sceneManager: SceneManager = new SceneManager();
}
