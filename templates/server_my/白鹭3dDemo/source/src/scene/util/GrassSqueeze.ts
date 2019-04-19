module egret3d {

    export class GrassSqueeze extends Object3D {
        private _grass: GrassMesh;
        private _squeezePos: Vector3D = new Vector3D();
        private _target: Object3D;
        private static _instance: GrassSqueeze;

        public static instance():GrassSqueeze{
            GrassSqueeze._instance = GrassSqueeze._instance || new GrassSqueeze();
            return GrassSqueeze._instance;
        }
        constructor() {
            super();
        }

        public bindGrass(grass: GrassMesh): void {
            this._grass = grass;
        }

        public bindActor(target: Object3D): void {
            this._target = target;
        }

        public update(time: number, delay: number, camera: Camera3D) {
            super.update(time, delay, camera);
            if (this._target == null) {
                this._grass.method.updateSqueezeData(this._squeezePos, false, 1, 1);
            } else {
                this._squeezePos.copyFrom(this._target.globalPosition);
                this._squeezePos.decrementBy(this._grass.globalPosition);
                this._squeezePos.y = 0;
                this._grass.method.updateSqueezeData(this._squeezePos, true, 160, 0.8);
            }
        }


    }


}