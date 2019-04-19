
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"bin/resourcemanager/resourcemanager.js",
	"TweenLite/TweenLite.js",
	"libs/modules/egret3d/egret3d.js",
	"bin-debug/scene/ActionTree/ActionNode.js",
	"bin-debug/scene/actor/Actor.js",
	"bin-debug/scene/logic/Logic.js",
	"bin-debug/scene/manager/SceneManager.js",
	"bin-debug/scene/ActionTree/ActionMoveTo.js",
	"bin-debug/Main.js",
	"bin-debug/scene/ActionTree/ActionParallel.js",
	"bin-debug/scene/ActionTree/ActionRepeat.js",
	"bin-debug/scene/ActionTree/ActionSequence.js",
	"bin-debug/scene/ActionTree/ActionAttackTo.js",
	"bin-debug/scene/actor/GameActor.js",
	"bin-debug/scene/actor/ribbon.js",
	"bin-debug/scene/GameMain.js",
	"bin-debug/scene/ActionTree/ActionDelay.js",
	"bin-debug/scene/logic/ProtagonistLogic.js",
	"bin-debug/scene/manager/AudioManager.js",
	"bin-debug/scene/manager/CameraManager.js",
	"bin-debug/scene/manager/EffectManager.js",
	"bin-debug/scene/manager/LogicManager.js",
	"bin-debug/scene/manager/PlayerManager.js",
	"bin-debug/scene/ActionTree/ActionAttackTarget.js",
	"bin-debug/scene/manager/TableManager.js",
	"bin-debug/scene/Scene.js",
	"bin-debug/scene/util/GrassSqueeze.js",
	"bin-debug/scene/util/JsonUtil.js",
	"bin-debug/scene/util/MathEx.js",
	"bin-debug/scene/util/NavGrid.js",
	"bin-debug/scene/util/TableItems.js",
	"bin-debug/scene/util/Vec2.js",
	"bin-debug/ui/BattlePage.js",
	"bin-debug/ui/components/Blood.js",
	"bin-debug/ui/components/HitContainer.js",
	"bin-debug/ui/components/ProcessBar.js",
	"bin-debug/ui/components/SkillBar.js",
	"bin-debug/ui/components/TimeKeeper.js",
	"bin-debug/ui/EndingPage.js",
	"bin-debug/ui/LoadingPage.js",
	"bin-debug/ui/LoginPage.js",
	"bin-debug/ui/RoomPage.js",
	"bin-debug/ui/UIManager.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    egret_native.requireFiles();
    egret.TextField.default_fontFamily = "/system/fonts/DroidSansFallback.ttf";
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 60,
		scaleMode: "fixedWidth",
		contentWidth: 640,
		contentHeight: 960,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel(egret.TextField.default_fontFamily, 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};