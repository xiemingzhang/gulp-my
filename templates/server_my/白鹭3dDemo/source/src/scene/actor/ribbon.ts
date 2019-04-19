module egret3d {
    export class Ribbon extends egret3d.Mesh {
        private _vecs: egret3d.Object3D[];
        private _autoUpdate: boolean;

        private _temp_v0: Vector3D;
        private _temp_v1: Vector3D;

        private segmentRibbon: number;
        private _segmentW:number;
        private _segmentH:number;

        constructor(material: egret3d.TextureMaterial, points: egret3d.Object3D[], count: number = 10, segment: number = 2) {
            var h = points.length > 2 ? Math.floor(points.length / 2) + 1 : 1;
            var ge: egret3d.PlaneGeometry = new egret3d.PlaneGeometry(0, 0, count, h, 1, 1, Vector3D.Y_AXIS);

            if (material === null) {
                material = new egret3d.TextureMaterial();
            }

            super(ge, material);

            this.segmentRibbon = segment;
            this.material.ambientColor = 0;
            this._segmentH = ge.segmentsH;
            this._segmentW = ge.segmentsW;

            //this.material.diffuseColor = 0xc6c6c6;
            //this.material.blendMode = egret3d.BlendMode.ADD;
            this.material.blendMode = egret3d.BlendMode.SOFT_ADD;

            this.material.ambientColor = 0xffffffff;
            //this.material.blendMode = egret3d.BlendMode.ADD;
            this.material.bothside = true;
            this._vecs = points;
            this._autoUpdate = true;
            this.initVertex();
            this._temp_v0 = new Vector3D();
            this._temp_v1 = new Vector3D();
        }


        public set autoUpdate(value: boolean) {
            this._autoUpdate = value;
        }

        //获取此对象的平面几何体
//        private get planeGeometry(): egret3d.PlaneGeometry {
//            this._getPlaneGeometryRunCount++;
//            return <egret3d.PlaneGeometry>this.geometry;
//        }

        public updateVertices() {
            var ge: egret3d.Geometry = this.geometry;

            this.showNewTrail();
            ge.upload(egret3d.Egret3DCanvas.context3DProxy);
        }

        public showNewTrail() {

            //var segment: number = 2;
            var last_new: Vector3D[] = [];
            var planeGeometrySegmentsW: number = this._segmentW + 1;
            var vecsLen: number = this._vecs.length;
            for (var i: number = 0; i < vecsLen; i++) {
                last_new.push(this._vecs[i].globalPosition);
            }
            var begin: number[] = this.getVerticeDataByCol(0);

            var jp3: number;
            for (var i: number = 0; i < this.segmentRibbon; i++) {
                var last: number[] = [];
                for (var j: number = 0; j < vecsLen; j++) {
                    jp3 = j * 3;

                    this._temp_v0.x = begin[jp3];
                    this._temp_v0.y = begin[jp3 + 1];
                    this._temp_v0.z = begin[jp3 + 2];

                    this._temp_v1.slerp(this._temp_v0, last_new[j], (i + 1) / this.segmentRibbon);
                    //this._temp_v1.copyFrom(last_new[j]);

                    last.push(this._temp_v1.x);
                    last.push(this._temp_v1.y);
                    last.push(this._temp_v1.z);
                }
                var temp;
                for (var k: number = 0; k < planeGeometrySegmentsW; k++) {
                    temp = this.getVerticeDataByCol(k);
                    this.setVerticesDataByCol(k, last);
                    last = temp;
                }
            }

        }

        public update(time: number, delay: number, camera: egret3d.Camera3D): void {
            if (this._autoUpdate) {
                var time2: number = new Date().getTime();
                this.updateVertices();
                console.log("更新刀光顶点耗时: ", new Date().getTime() - time2);
            }
            super.update(time, delay, camera);
        }

        //设置某一列顶点坐标 pos数组的长度要和顶点数对应 顶点数为 (segmentsH + 1)
        private setVerticesDataByCol(col: number, pos: number[]) {
            var indexArray: Uint16Array = this.geometry.indexArray;
            var va: Float32Array = this.geometry.vertexArray;
            var vertexAttLength: number = this.geometry.vertexAttLength;
            var indexArrayValue: number;//indexArray中的值
            var attIndex: number;//vertexAttLength索引 === indexArrayValue * vertexAttLength
            var colAndColSub1 = col + col - 1;
            if (colAndColSub1 < 0) colAndColSub1 = 0;
            if (col === 0) {
                indexArrayValue = indexArray[0];
            } else {
                indexArrayValue = indexArray[col * 3 + (col - 1) * 3 + 1];
            }

            attIndex = indexArrayValue * vertexAttLength;

            va[attIndex] = pos[0];
            va[attIndex + 1] = pos[1];
            va[attIndex + 2] = pos[2];

            var panelGeometrySegmentsWDouble: number = this._segmentW + this._segmentW ; 
            var panelGeometrySegmentsH: number = this._segmentH;
            var iAnd1P3: number; //===iAnd1 * 3

            for (var i: number = 0; i < panelGeometrySegmentsH; i++) {
                indexArrayValue = indexArray[(i * panelGeometrySegmentsWDouble + colAndColSub1) * 3 + 2];
                attIndex = indexArrayValue * vertexAttLength;
                iAnd1P3 = (i+1) * 3;
                va[attIndex] = pos[iAnd1P3];
                va[attIndex + 1] = pos[iAnd1P3 + 1];
                va[attIndex + 2] = pos[iAnd1P3 + 2];
            }
        }

        private getVerticeDataByCol(col: number): number[] {
            var temp: number[] = [];
            var indexArray: Uint16Array = this.geometry.indexArray;
            var va: Float32Array = this.geometry.vertexArray;
            var vertexAttLength: number = this.geometry.vertexAttLength;
            var indexArrayValue: number;//indexArray中的值
            var attIndex: number;//vertexAttLength索引 === indexArrayValue * vertexAttLength
            var colAndColSub1 = col + col - 1;
            if (colAndColSub1 < 0) colAndColSub1 = 0;
            if (col === 0) {
                indexArrayValue = indexArray[0];
            } else {
                indexArrayValue = indexArray[col * 3 + (col - 1) * 3 + 1];
            }
            attIndex = indexArrayValue * vertexAttLength;
            temp = temp.concat([va[attIndex], va[attIndex + 1], va[attIndex + 2]]);

            var panelGeometrySegmentsWDouble: number = this._segmentW + this._segmentW;// this.planeGeometry.segmentsW;
            var panelGeometrySegmentsH: number = this._segmentH;//this.planeGeometry.segmentsH;
            for (var i: number = 0; i < panelGeometrySegmentsH; i++) {
                indexArrayValue = indexArray[(i * panelGeometrySegmentsWDouble + colAndColSub1) * 3 + 2];
                attIndex = indexArrayValue * vertexAttLength;
                temp = temp.concat([va[attIndex], va[attIndex + 1], va[attIndex + 2]]);

            }
            return temp;
        }

        private initVertex() {
            //初始化所有点
            var temp: number[] = [];
            for (var i: number = 0; i < this._vecs.length; i++) {
                temp.push(this._vecs[i].globalPosition.x);
                temp.push(this._vecs[i].globalPosition.y);
                temp.push(this._vecs[i].globalPosition.z);
            }
            var panelGeometrySegmentsW: number = this._segmentW;//this.planeGeometry.segmentsW + 1;
            for (var i: number = 0; i < panelGeometrySegmentsW; i++) {
                this.setVerticesDataByCol(i, temp);
            }
            this.geometry.upload(egret3d.Egret3DCanvas.context3DProxy);
        }

//        private _setVeritcesDataByIndex:number;
//        private setVeritcesDataByIndex(index: number, x: number, y: number, z: number) {
//            var va = this.geometry.vertexArray;
//            var startIndex: number = index * this.geometry.vertexAttLength;
//            va[startIndex + 0] = x;
//            va[startIndex + 1] = y;
//            va[startIndex + 2] = z;
//            this._setVeritcesDataByIndex ++;
//        }
//
//        private _getVertexDataByIndexRunCount:number;
//        private getVertexDataByIndex(index: number): number[] {
//            var va = this.geometry.vertexArray;
//            var startIndex: number = index * this.geometry.vertexAttLength;
//            var result = [
//                va[startIndex + 0],
//                va[startIndex + 1],
//                va[startIndex + 2]
//            ];
//            this._getVertexDataByIndexRunCount++;
//            return result;
//        }
    }
}