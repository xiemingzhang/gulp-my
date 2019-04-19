@RES.mapConfig("config.json", () => "resource", path => {
    var ext = path.substr(path.lastIndexOf(".") + 1);
    var type = "";
    if (path == "config.json") {
        type = "json";
    } else {
        if (path.indexOf("ui/") >= 0) {
            let ext = path.substr(path.lastIndexOf(".") + 1);
            let typeMap = {
                "jpg": "image",
                "png": "image",
                "webp": "image",
                "json": "json",
                "fnt": "font",
                "pvr": "pvr",
                "mp3": "sound"
            }
            type = typeMap[ext];
            if (type == "json") {
                if (path.indexOf("png") < 0) {
                    type = "sheet";
                } else if (path.indexOf("movieclip") >= 0) {
                    type = "movieclip";
                };
            }
        } else {
            type = "unit";
        }
    }
    return type;
})

class Main extends egret.DisplayObjectContainer {
    constructor() {
        super();

        let promisify = (loader: egret3d.UnitLoader, url: string) => {
            return new Promise((reslove, reject) => {
                loader.addEventListener(egret3d.LoaderEvent3D.LOADER_COMPLETE, () => {
                    reslove(loader.data);
                }, this);
                loader.load("resource/" + url);


            });
        }

        RES.processor.map("unit", {

            onLoadStart: async (host, resource) => {
                var loader = new egret3d.UnitLoader();
                return promisify(loader, resource.url)
            },

            onRemoveStart: async (host, resource) => Promise.resolve()
        });

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage() {
        if (egret.Capabilities.isMobile) {
            this.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
        }
        else {
            this.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
        }


        uiManager = new UIManager(this);
        let stage3d = new egret3d.Stage3D(this.stage);
        egret.setRendererContext(stage3d);
        let scene = new egret3d.Scene(stage3d);
        scene.createGameScene();
    }
}