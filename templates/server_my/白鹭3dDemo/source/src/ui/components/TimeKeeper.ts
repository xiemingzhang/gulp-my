// 计时器ui
class TimeKeeper extends egret.Sprite {

    private number1:egret.Bitmap = new egret.Bitmap();
    private number2:egret.Bitmap = new egret.Bitmap();
    private number3:egret.Bitmap = new egret.Bitmap();
    private number4:egret.Bitmap = new egret.Bitmap();

    private numbers:Array<egret.Bitmap>;

    private timer:number;

    constructor() {
        super();

        let bg = new egret.Bitmap();
        bg.texture = RES.getRes("ui/gameUI.json#bg_title.png");
        this.addChild(bg);
        
        let maohao = new egret.Bitmap();
        maohao.texture = RES.getRes("ui/gameUI.json#maohao.png");
        maohao.width = 20;
        maohao.height = 20;
        this.addChild(maohao);

        let initX = 45;
        let maohaoX = 0;
        this.numbers = [this.number1, this.number2, this.number3, this.number4];
        for(let i = 0; i < 4; i++) {
            let num:egret.Bitmap = this.numbers[i];
            num.texture = RES.getRes("ui/gameUI.json#0.png");
            num.width = 20;
            num.height = 20;

            num.x = initX + num.width * i + (i >= 2 ? maohao.width : 0);
            num.y = num.height;

            this.addChild(num);
        }

        maohao.x = initX + 20 * 2;
        maohao.y = maohao.height;
    }

    start():void {
        let data = new Date();

        this.stop();

        this.timer = setInterval(() => {
            let str = this.formatDuring(new Date().getTime() - data.getTime());
        }, 1000);
    }

    stop():void {
        clearInterval(this.timer);
    }

    reset():void {
        let num:egret.Bitmap;

        for (var i = 0; i < 4; i++) {
            num = this.numbers[i];
            num.texture = RES.getRes("ui/gameUI.json#0.png");
        }
    }

    private formatDuring(mss:number) {
        var days = Math.floor(mss / (1000 * 60 * 60 * 24)) ;
        var hours = Math.floor((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) ;
        var minutes = Math.floor((mss % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((mss % (1000 * 60)) / 1000);

        var str = days + " days " + hours + " hours " + minutes + " minutes "
            + seconds + " seconds ";

        var num:egret.Bitmap;

        this.reset();

        if (minutes > 9) {
            num = this.number1;
            num.texture = RES.getRes("ui/gameUI.json#" + Math.floor(minutes / 10) + ".png");

            num = this.number2;
            num.texture = RES.getRes("ui/gameUI.json#" + (minutes % 10) + ".png");
        }
        else {
            num = this.number2;
            num.texture = RES.getRes("ui/gameUI.json#" + minutes + ".png");
        }
        
        if (seconds > 9) {
            num = this.number3;
            num.texture = RES.getRes("ui/gameUI.json#" + Math.floor(seconds / 10) + ".png");

            num = this.number4;
            num.texture = RES.getRes("ui/gameUI.json#" + (seconds % 10) + ".png");
        }
        else {
            num = this.number4;
            num.texture = RES.getRes("ui/gameUI.json#" + seconds + ".png");
        }
    }
}