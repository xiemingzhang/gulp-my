// 战斗中掉血的数字
class Blood extends egret.Sprite{
    public pos3D:egret3d.Vector3D;
    public pos3DTo2DFun:Function;
    public camera:egret3d.Camera3D;
    private _width:number;
    public createNumberView(value: number) {
        if (value === 0) return;
        value = Math.floor(value);
        var result: number[] = [];
        while (value > 0) {
            result.push(value % 10);
            value = Math.floor(value / 10);
        }

        result.reverse();

        var quad: egret.Bitmap;
        for (var i: number = 0; i < result.length; i++) {
            quad = new egret.Bitmap();
            quad.texture = RES.getRes("ui/gameUI.json#" + result[i] + ".png");
            quad.width = quad.height = 20;
            quad.x = quad.width * i * 0.8;
            this.addChild(quad);
        }
        this._width = quad.x + quad.width;

        this._speedX = Math.random() * (this._maxSpeedX - this._minSpeedX) + this._minSpeedX;
        if (Math.random() > 0.5) this._speedX *= -1;
    }

    public get width(): number {
        return this._width;
    }

    public complete: boolean = false;

    private _g: number = 80.8;
    private _speedY:number = -8;
    private _lifeTime:number = 800;
    private _scale:number = 50;
    private _speedX: number = 2;
    private _speedZ: number = 3;
    private _minSpeedX: number = 2;
    private _maxSpeedX:number = 4;

    public update(time: number, delay: number) {
        if (this._lifeTime <= 0) {
            this.complete = true;
            return;
        }

        var pt:egret3d.Vector3D= this.camera.object3DToScreenRay(this.pos3D);
        // this.x = pt.x;
        // this.y = pt.y;

        var stage = this.stage;
        if(stage) {
            // 黑科技来处理坐标适配，这里应该有更好的方法
            // var p = stage.$screen["webTouchHandler"].getLocation({pageX: pt.x, pageY: pt.y, identifier: 0});
            this.x = pt.x;
            this.y = pt.y;
        }

//            this.pos3D.y -= this._speedY * delay / 1000 * 5;// * this._scale;
//            this._lifeTime -= delay;
        this.pos3D.y -= this._speedY * delay / 1000 * this._scale;
        this._speedY += this._g * delay / 1000;
        if (this._speedY > 5) {
            this._speedY = 5;
        }
        this._lifeTime -= delay;
        this.pos3D.x += this._speedX;
        this.pos3D.z += this._speedZ;
    }

}