module egret3d {

    export class EffectManager {

        private _effectCount: number = 0;
        private _effectNames: string[] = [];

        private _busyEffects: DoubleArray = new DoubleArray();
        private _freeEffects: DoubleArray = new DoubleArray();
        private _recycleTime: any;
        private _prepareCount: any;
        private _orignalEffects: { [id: string]: EffectGroup } = {};

        constructor() {
           this._recycleTime = {
                "Fx_Skill1": 1200,
                "Fx_Skill2_1": 1200,
                "Fx_Skill2_2": 1200,
                "Fx_Skill2_3": 1500,
                "Fx_Skill3_1": 2000,
                "Fx_Skill4": 2500,
                "FX_Hit_01": 500,
                "FX_Hit_02": 500,
                "FX_Hit_03": 500,
                "Fx_Levelup_01": 2000
            };
           this._prepareCount = {
               "Fx_Skill1": 1,
               "Fx_Skill2_1": 1,
               "Fx_Skill2_2": 1,
               "Fx_Skill2_3": 1,
               "Fx_Skill3_1": 1,
               "Fx_Skill4": 1,
               "FX_Hit_01": 2,
               "FX_Hit_02": 2,
               "FX_Hit_03": 2,
               "Fx_Levelup_01": 1
           };
        }

        public start(): void {

            this.preUpload();
            this.prepareEffects();
        }


        public splitUrl(name: string): string {
            var url = "effects/skill/" + name + ".e3dPack";
            return url;
        }


        public getEffect(name: string): EffectGroup {

            if (this._effectNames.indexOf(name) == -1) {
                this._effectNames.push(name);
                this._effectCount++;
            }

            //取出一个特效，如果回收池不够用，新建一个特效组
            var freeEffects: EffectGroup[] = this._freeEffects.getValueByKey(name);
            var effect: EffectGroup;
            if (freeEffects && freeEffects.length > 0) {
                effect = freeEffects.shift();
            } else {
                effect = this._orignalEffects[name];
                if (effect == null) {
                    var url: string = this.splitUrl(name);
                    effect = RES.getRes(url);
                    this._orignalEffects[name] = effect;
                } else {
                    effect = <EffectGroup>effect.deepClone();
                    effect.isOriginal = false;
                }

                if (effect == null) {
                    //console.log("该特效没有被加载过： " + name);
                    return null;
                }
            }
            //放入一个在用的特效放入正在使用的队列中
            var busyEffects: EffectGroup[] = this._busyEffects.getValueByKey(name);
            if (busyEffects == null) {
                busyEffects = [];
                this._busyEffects.put(name, busyEffects);
            }

            busyEffects.push(effect);
            effect.liveTime = 0;

            return effect;
        }


        public recycleEffect(name: string, effect: EffectGroup): void {
            effect.stop();
            if (effect.parent) {
                effect.parent.removeChild(effect);
                effect.x = effect.y = effect.z = 0;
            }

            effect.liveTime = -1;
            //将该特效放入到free列表中
            var freeEffects: EffectGroup[] = this._freeEffects.getValueByKey(name);
            if (freeEffects == null) {
                freeEffects = [];
                this._freeEffects.put(name, freeEffects);
            }
            freeEffects.push(effect);

            //从原先的使用队列中移除
            var busyEffects: EffectGroup[] = this._busyEffects.getValueByKey(name);
            if (busyEffects) {
                var index: number = busyEffects.indexOf(effect);
                if (index >= 0) {
                    busyEffects.splice(index, 1);
                    //console.log("回收了一个特效组[" + name + "]");
                }
            }

        }


        public recycleAllEffect(): void {
            var name: string;
            var count: number = 0;
            var effect: EffectGroup;

            for (var i: number = 0; i < this._effectCount; i++) {
                name = this._effectNames[i];
                var busyEffects: EffectGroup[] = this._busyEffects.getValueByKey(name);
                if (busyEffects == null)
                    continue;
                for (var j: number = busyEffects.length - 1; j >= 0; j--) {
                    effect = busyEffects[j];
                    this.recycleEffect(name, effect);
                }
            }
        }


        public update(time: number, delay: number): void {
            const MaxLiveTime: number = 3 * 1000;

            var name: string;
            var count: number = 0;
            var effect: EffectGroup;

            var busyCount: number = 0;
            var recycled: boolean = false;
            for (var i: number = 0; i < this._effectCount; i++) {
                name = this._effectNames[i];
                var busyEffects: EffectGroup[] = this._busyEffects.getValueByKey(name);
                var recycleTime: number = this._recycleTime[name] || MaxLiveTime;
                for (var j: number = busyEffects.length - 1; j >= 0; j--) {
                    effect = busyEffects[j];
                    effect.liveTime += delay * effect.speed;

                    if (effect.liveTime >= recycleTime) {
                        this.recycleEffect(name, effect);
                        recycled = true;
                    } else {
                        busyCount++;
                    }

                }
            }

            if (recycled) {
                //console.log("剩余正在播放的特效组[" + busyCount + "]");
            }

            if (this._uploadStatus >= 0) {
                if (this._uploadStatus >= 1) {
                    this.removePreUpload();
                    //console.log("移除预渲染特效成功！！");
                } else {
                    //console.log("预渲染特[" + this._uploadStatus + "]");
                    this._uploadStatus++;
                }
            }


        }


        private _uploadStatus: number = -1;
        private _preEffects: { [id: string]: EffectGroup } = { };
        private preUpload(): void {
            this._uploadStatus = 0;
            var names: string[] = [
                "Fx_Skill1",
                "Fx_Skill2_1",
                "Fx_Skill2_2",
                "Fx_Skill2_3",
                "Fx_Skill3_1",
                "Fx_Skill4",
                "FX_Hit_01",
                "FX_Hit_02",
                "FX_Hit_03",
                "Fx_Levelup_01",
            ];

            var name: string;
            var effect: EffectGroup;
            var pos: Vector3D = new Vector3D(2300, 10, 1400);
            for (var i: number = 0, count: number = names.length; i < count; i++) {
                name = names[i];
                effect = this.getEffect(name);
                if (effect) {
                    this._preEffects[name] = effect;
                    effect.position = pos;
                    sceneManager.currentScene.addChild(effect);
                }
            }


        }

        private removePreUpload(): void {

            var name: string;
            var effect: EffectGroup;
            for (name in this._preEffects) {
                effect = this._preEffects[name];
                this.recycleEffect(name, effect);
            }

            this._preEffects = {};
            this._uploadStatus = -1;

            
        }



        

        private prepareEffects(): void {
            var names: string[] = [
                "Fx_Skill1",
                "Fx_Skill2_1",
                "Fx_Skill2_2",
                "Fx_Skill2_3",
                "Fx_Skill3_1",
                "Fx_Skill4",
                "FX_Hit_01",
                "FX_Hit_02",
                "FX_Hit_03",
                "Fx_Levelup_01",
            ];

            var name: string;
            //for (var i: number = 0, count: number = names.length; i < count; i++) {
            //    name = names[i];
            //    for (var j: number = 0, eCount:number = <number>(this._prepareCount[name]) - 1; j < eCount; j++) {
            //        this.getEffect(name);
            //    }
            //}


        }
    }

    export var effectManager: EffectManager = new EffectManager();
}