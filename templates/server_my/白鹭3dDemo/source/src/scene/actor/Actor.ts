enum ActorState {
    Idle,    //闲置状态;
    Move,    //移动状态;
    Attack,  //攻击状态;
    Death,   //死亡状态;
}

class Actor extends egret3d.Object3D {

    public isMove: boolean = false;
    public onHeight: number = 0;
    public moveSpeed: number = 400;
    public hasHeight: boolean = false;
    public rotSpeed: number = 0.82; //转身速度 (角度/s)
    public rotTime: number = 800; //转身速度 (角度/s)

    protected _clinetCurrentPose: egret3d.Vector3D = new egret3d.Vector3D();//当前存在的点
    protected _movTargetPose: egret3d.Vector3D = new egret3d.Vector3D;
    protected _wayFixedSpeed: number = 1;
    protected _runToTargetAngle: number = 0; //要旋转到指定角度
    protected _curAngle: number = 0; //当前逻辑角度 [-180, 180]
    protected _posAngle: number = 0; //当前身体角度 [-180, 180] (显示角度)
    protected _roting: boolean = true; //0不转身, -1, 1
    protected _wayDirection: egret3d.Vector3D = new egret3d.Vector3D(1, 1, 1);
    protected _wayFixSpeed: number = 0;
    protected _state: ActorState;

    private _time: number = 0;
    private _delay: number = 0;
    private _lessDdistance: number = 0;
    private _moveNeedTime: number = 0;
    private _rotNeedTime: number = 0;
    private _numTime: number = 800;
    private _currentTime: number = 0;
    private _lessAngle: number = 0;
    private _delayValue: number = 0.82;
    private _maxRot: number = 0.0;
    private _start: boolean = false;

    private _pathLength: number = 0;
    private _pathPoint: Array<egret3d.Vector3D> = [];
    protected _temp_vecA: egret3d.Vector3D = new egret3d.Vector3D();

    constructor() {
        super();
    }

    public get roting(): boolean {
        return this._roting;
    }

    public set roting(value: boolean) {
        this._roting = value;
    }

    public setState(state: ActorState): void {

        if (this._state == state)
            return;

        this._state = state;
    }

    //public get currentAngle(): Number {
    //    return -_posAngle + 90;
    //}

    /**
     *  
     * @param sx 服务器当前目标点 serverCurrentPose
     * @param sz 服务器当前目标点 serverCurrentPose
     */
    public actorMoveTo(sx: number, sy: number, sz: number, turnDir: Boolean = true) {
        this._movTargetPose.x = sx;
        this._movTargetPose.y = sy;
        this._movTargetPose.z = sz;
        this._wayDirection.x = -(this._clinetCurrentPose.x - this._movTargetPose.x);
        this._wayDirection.z = -(this._clinetCurrentPose.z - this._movTargetPose.z);

        this._lessDdistance = egret3d.Vector3D.distance(this.position, this._movTargetPose);
        if (this._lessDdistance == undefined || isNaN(this._lessDdistance) ) {
            this._lessDdistance = 0;
        }
        this._moveNeedTime = this._lessDdistance / (this.moveSpeed * 0.001);

        if (!(this._wayDirection.x == 0 && this._wayDirection.z == 0))
            this._wayDirection.normalize();
        if (isNaN(this._wayDirection.x) && isNaN(this._wayDirection.z)) {
            this._wayDirection.x = 0;
            this._wayDirection.z = 0;
        }
        
        this.actorTrunToDirection(this._wayDirection.x, this._wayDirection.z);

        this.isMove = true;

        this.setState(ActorState.Move);
        return;
    }

    private _movePathX: number[] = [];
    private _movePathZ: number[] = [];
    private _movePathIndex: number = 0;
    public actorMoveToEx(pointX: number[], pointZ: number[]): void {
        this._movePathX = pointX;
        this._movePathZ = pointZ;
        this._movePathIndex = 0;
        //GameWorld.Pathinstance.to3DPoint(this._moveGridX[this._moveGridIndex], this._moveGridZ[this._moveGridIndex], this._temp_vecA);
        this.actorMoveTo(this._movePathX[this._movePathIndex], 0, this._movePathZ[this._movePathIndex]);
    }

    public actorMoveStop(): void {
        if (this.isMove) {
            this.isMove = false;
            //GameWorld.instance.to3DPoint(this._moveGridX[this._moveGridIndex], this._moveGridZ[this._moveGridIndex], this._temp_vecA);
            //this.jumpTo(this._temp_vecA.x, this._temp_vecA.z);
            //this._moveGridX.length = this._moveGridZ.length = this._moveGridIndex = 0;
        }
    }

    public jumpTo(x: number, z: number) {
        this.x = this._clinetCurrentPose.x = x;
        this.z = this._clinetCurrentPose.z = z;
    }

    //public lockUnit(target: Unit): void {
    //    this._movTargetPose.x = target.x;
    //    this._movTargetPose.y = 0;
    //    this._movTargetPose.z = target.z;
    //    this._wayDirection.x = -(this._clinetCurrentPose.x - this._movTargetPose.x);
    //    this._wayDirection.z = -(this._clinetCurrentPose.z - this._movTargetPose.z);

    //    this._lessDdistance = egret3d.Vector3D.distance(this.position, this._movTargetPose);
    //    this._moveNeedTime = this._lessDdistance / (this.moveSpeed * 0.001);

    //    if (!(this._wayDirection.x == 0 && this._wayDirection.z == 0))
    //        this._wayDirection.normalize();
    //    if (isNaN(this._wayDirection.x) && isNaN(this._wayDirection.z)) {
    //        this._wayDirection.x = 0;
    //        this._wayDirection.z = 0;
    //    }

    //    this.actorTrunToDirection(this._wayDirection.x, this._wayDirection.z);
    //}

    public actorTrunToDirection(dx: number, dy: number) {
        this._runToTargetAngle = EMathEx.normalizeAngle(Math.atan2(dy, dx) * egret3d.MathUtil.RADIANS_TO_DEGREES);
        this._posAngle = this._runToTargetAngle;
        this._rotNeedTime = this.rotTime;
    }

    public update(time: number, delay: number, camera: egret3d.Camera3D) {



        this._delay = delay;
        this._time = time;

        if (this._roting) {
            this._posAngle = this.updateRotion(this._delay, this._runToTargetAngle);
        }
        else
            this._posAngle = this._runToTargetAngle;

        this.rotationY = this.currentAngle;

        //if (!this.isMove) return;

        //while (delay > 0) {

        //    this._moveNeedTime -= delay;

        //    if (this._moveNeedTime >= 0) {

        //        //实时修正目前的速度
        //        this._wayFixSpeed = delay * 0.001 * this.moveSpeed;

        //        this.x = this._clinetCurrentPose.x += this._wayDirection.x * this._wayFixSpeed;
        //        this.z = this._clinetCurrentPose.z += this._wayDirection.z * this._wayFixSpeed;

        //        delay = 0;
        //    }
        //    else {

        //        this.x = this._clinetCurrentPose.x = this._movTargetPose.x;
        //        this.z = this._clinetCurrentPose.z = this._movTargetPose.z;

        //        if (this._movePathIndex + 1 >= this._movePathX.length) {

        //            this.isMove = false;

        //            this.setState(ActionState.AS_IDLE);

        //            break;
        //        }
        //        else {

        //            delay = -this._moveNeedTime;

        //            this._movePathIndex++;

        //            this.actorMoveTo(this._movePathX[this._movePathIndex], 0, this._movePathZ[this._movePathIndex]);
        //        }
        //    }
        //}
        
    }

    public updateRotion(deltaTime: number, newDir: number): number {

        if (this._rotNeedTime >= 0) {
            var deltaAngle: number = newDir - (this._curAngle % 360);
            if (deltaAngle == 0.0)
                return this._curAngle;
            deltaAngle = EMathEx.normalizeAngle(deltaAngle);

            this._currentTime = 0;
            if (this._numTime != this._rotNeedTime)
                this._currentTime = (this._numTime - this._rotNeedTime) / this._numTime;

            this._lessAngle = (1.0 - (1.0 - this._currentTime) * (1.0 - this._currentTime) * this.rotSpeed);

            if (deltaAngle > 0.0)
                this._maxRot = -Math.abs(deltaAngle * this._lessAngle);
            else
                this._maxRot = Math.abs(deltaAngle * this._lessAngle);
            this._curAngle -= this._maxRot;
        }

        var tmp: number = EMathEx.normalizeAngle(this._curAngle);
        this._rotNeedTime = this._rotNeedTime - deltaTime;
        return tmp;
    }

    public get currentAngle(): number {
        return -this._posAngle + 90;
    }

}