module egret3d {

    class AnimNode {
    }

    export class GameCameraManager {
        private _camera: Camera3D; 
        private _anim: AnimNode[];
        private _ctl: ThirdCameraController;
        constructor() {
            this._ctl = new ThirdCameraController();
        }

        public playCameraAnim( cameraConfig:number ) {
        }

        public set currentCamera(camera: Camera3D) {
            this._camera = camera; 
            this._ctl.camera = camera; 
        }

        public get currentCamera(): Camera3D {
            return this._camera;
        }

        public follow(target: Object3D) {
            this._ctl.lookAt(target);
        }

        public update(time: number, delay: number) {
            this._ctl.update(time,delay);
        }
    }

    class ThirdCameraController {
        private _camera: Camera3D;
        private _target: Object3D;

        private _height: number = 400; 
        private _tiltAngle: number = 60;
        private _offsetZ: number = 0;
        constructor() {
            this.height = 1000 ;
            this.tiltAngle = 50;
        }

        public set camera(camera: Camera3D) {
            this._camera = camera;
        }

        public lookAt(target: Object3D) {
            this._target = target;
        }

        public set height(v: number) {
            this._height = v;
            this.notifeUpdate();
        }

        public set tiltAngle(v: number) {
            this._tiltAngle = v;
            this.notifeUpdate();
        }

        public update(time: number, delay: number) {
            if (this._target) {
                this._camera.rotationX = this._tiltAngle; 
                this._camera.x = this._target.x;
                this._camera.y = this._target.y + this._height ;
                this._camera.z = this._target.z - this._offsetZ;
            }
        }

        private notifeUpdate() {
            this._offsetZ = this._height / Math.tan(this._tiltAngle*MathUtil.DEGREES_TO_RADIANS);
        }
    }

    export var gameCameraManager: GameCameraManager = new GameCameraManager();

}