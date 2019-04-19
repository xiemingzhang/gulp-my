// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        frame: {
            default: null,        // The default value will be used only when the component attaching
                                  // to a node for the first time
            type: cc.SpriteFrame, // optional, default is typeof default
        },
        texture: {
            default: null,        // The default value will be used only when the component attaching
                                  // to a node for the first time
            type: cc.Texture2D, // optional, default is typeof default
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this.node
        cc.log(self)
        // this.frame.setTexture(this.texture)
        // setTimeout(function(){
        //     cc.log(1)

        // }.bind(this), 1000)
        // self.spriteFrame = new cc.SpriteFrame(this.tu)
    },

    start () {
        var self = this.node

        // var anim = this.getComponent(cc.Animation);
        // anim.play();
        // cc.log(self)
        // self.runAction(cc.moveBy(1, 20, 0))
        // self.spriteFrame = new cc.SpriteFrame(this.tu)
        // cc.log(cc.url.raw('resources/boy.png'))
        // self.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/boy.png'))
        // self.runAction(cc.sequence(
        //     cc.callFunc(function(){
        //         self.setTexture('texture/boy.png')
        //     }),
        //     cc.delayTime(0.5),
        //     cc.callFunc(function(){
        //         self.setTexture('texture/boy_yan.png')
        //     })
        // ).repeatForever())
    }

    // update (dt) {
    // }
});
