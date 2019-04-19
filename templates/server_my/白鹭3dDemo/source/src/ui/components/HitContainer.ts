// 连击效果ui
class HitContainer extends egret.Sprite {
    private number1:egret.Bitmap;
    private number2:egret.Bitmap;

    private hitCount:number = 0;
    private hitTime:number = 0;
    private hitTween1;
    private hitTween2;

    constructor() {
        super();
        let hits = new egret.Bitmap();
        hits.texture = RES.getRes("ui/gameUI.json#hits.png");
        let number1 = this.number1 = new egret.Bitmap();
        number1.texture = RES.getRes("ui/gameUI.json#1.png");
        number1.x = hits.width;
        let number2 = this.number2 = new egret.Bitmap();
        number2.texture = RES.getRes("ui/gameUI.json#1.png");
        number2.x = number1.x + number1.width;
        this.addChild(hits);
        this.addChild(number1);
        this.addChild(number2);

        this.number2.visible = false;
    }

    hits():void {
        this.visible = true;
        this.number2.visible = false;

        this.hitCount++;

        if(this.hitCount > 99) {
            this.hitCount = 99;
        }

        if(this.hitCount > 9) {
            this.number1.texture = RES.getRes("ui/gameUI.json#" + Math.floor(this.hitCount / 10) + ".png");
            this.number2.texture = RES.getRes("ui/gameUI.json#" + Math.floor(this.hitCount % 10) + ".png");
            this.number2.visible = true;
        } else {
            this.number1.texture = RES.getRes("ui/gameUI.json#" + this.hitCount + ".png");
        }

        // tween
        if(this.hitTween1) {
            this.hitTween1.kill();
        }
        if(this.hitTween2) {
            this.hitTween2.kill();
        }
        this.number1.scaleX = this.number1.scaleY = 2;
        this.number2.scaleX = this.number2.scaleY = 2;
        this.hitTween1 = TweenLite.to(this.number1, 0.1, { scaleX: 1, scaleY: 1, ease: Linear.easeIn});
        this.hitTween2 = TweenLite.to(this.number2, 0.1, { scaleX: 1, scaleY: 1, ease: Linear.easeIn});

        if(this.hitTime > 0) {
            clearTimeout(this.hitTime);
        }
        
        this.hitTime = setTimeout(function() {
            this.visible = false;
            this.hitCount = 0;
            clearTimeout(this.hitTime);
        }.bind(this), 2000);
    }

    clear():void {
        if(this.hitTween1) {
            this.hitTween1.kill();
        }
        if(this.hitTween2) {
            this.hitTween2.kill();
        }
        if(this.hitTime > 0) {
            clearTimeout(this.hitTime);
        }
        this.visible = false;
        this.hitCount = 0;
        this.number2.visible = false;
    }
}