module audio {
    export class AudioManager {

        private _tables: { [id: string]: Array<egret3d.Channel> } = {};

        private _source: { [id: string]: egret3d.Sound } = {};

        public constructor() {

        }


        //public getSoundType():string {
        //    var browserName = navigator.userAgent.toLowerCase();
        //    if (/msie/i.test(browserName) && !/opera/.test(browserName)) {
        //        alert("IE");
        //        return ".mp3";
        //    } else if (/firefox/i.test(browserName)) {
        //        alert("Firefox");
        //        return ".wav";
        //    } else if (/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName)) {
        //        alert("Chrome");
        //        return ".wav";
        //    } else if (/opera/i.test(browserName)) {
        //        alert("Opera");
        //        return ".ogg";
        //    } else if (/webkit/i.test(browserName) && !(/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName))) {
        //        alert("Safari");
        //        return ".wav";
        //    } else {
        //        alert("unKnow");
        //        return ".wav";
        //    }


        //}  

        public play(url: string, loop: boolean = false) {
        
            //var s = ".wav";

            //if (s.length == 0)
            //    return;

            //var index: number = url.lastIndexOf('.');

            //url = url.substring(0, index);

            //url += s;


            //var self = this;

            //var channel: egret3d.Channel = this.findfreeChannel(url);

            //if (channel) {
            //    //console.log("get the channel");
            //    channel.stop(); // 播放进度重置为 0 
            //    channel.play();

            //    self.recover(channel, url, loop);
            //}
            //else {
            //    //var sound: egret3d.Sound = self._source[url];

            //    //if (sound) {
            //    //    channel = egret3d.AudioManager.instance.playSound(sound, { "volume": 1, "loop": loop });

            //    //    self.recover(channel, url, loop);

            //    //}
            //    //else {
            //    //    egret3d.AudioManager.instance.createSound(url, (e) => {
            //    //        self._source[url] = e;
            //    //        channel = egret3d.AudioManager.instance.playSound(e, { "volume": 1, "loop": false });

            //    //        self.recover(channel, url, loop);

            //    //    }, (e) => {
            //    //        console.log("load sound fail")
            //    //        });
            //    //}

            //    egret3d.AudioManager.instance.createSound(url, (e) => {
    
            //        channel = egret3d.AudioManager.instance.playSound(e, { "volume": 1, "loop": false });

            //        self.recover(channel, url, loop);

            //    }, (e) => {
            //        console.log("load sound fail")
            //        });

            //    //console.log("create the new channel");
            //}

        }
        //回收音效
        public recover(channel: egret3d.Channel, url: string,  loop: boolean = false) {

            var self = this;

            if (!loop) { //不需要循环播放 就回收

                var time: number = channel.getDuration();

                if (!self._tables[url]) {
                    self._tables[url] = new Array<egret3d.Channel>();
                }
                setTimeout(() => {

                    self._tables[url].push(channel);

                    //console.log("recover the channel [" + self._tables[url].length + "]");
                }, time * 1000);       
            }
        }


        public findfreeChannel(url:string): egret3d.Channel {
            var array: Array<egret3d.Channel> = this._tables[url];
            var channel: egret3d.Channel;

            if (array && array.length > 0) {
                channel = array.pop();
            }


            return channel;

        }

    }

    export var audioManager: AudioManager = new AudioManager();
}
 