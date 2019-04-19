module egret3d {

    export class PlayerManager {
        public getRole(assetesID: string): Role {
            var mapURL = "anim/" + assetesID + ".e3dPack";
            var role = RES.getRes(mapURL); 
            return role;
        }
    }

    export var playerManager: PlayerManager = new PlayerManager();
}