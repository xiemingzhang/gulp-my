namespace egret3d {
    export class JSON_Util {
        static getVector3D(str: string): Vector3D {
            var tmp: string[] = str.split(",");
            var tmpV: Vector3D = new Vector3D();
            if (tmp) {
                switch (tmp.length) {
                    case 1:
                        tmpV.x = Number(tmp[0]);
                        break;
                    case 2:
                        tmpV.x = Number(tmp[0]);
                        tmpV.y = Number(tmp[1]);
                        break;
                    case 3:
                        tmpV.x = Number(tmp[0]);
                        tmpV.y = Number(tmp[1]);
                        tmpV.z = Number(tmp[2]);
                        break;
                }
            }
            return tmpV;
        }
    }
}
