module egret3d {
    export class Vec2 {

        public x: number;
        public y: number;

        constructor(x: number = 0, y: number = 0) {
            this.x = x;
            this.y = y;
        }

        public get lengthSquared(): number {
            return this.x * this.x + this.y * this.y;
        }

        public get length(): number {
            return Math.sqrt(this.lengthSquared);
        }

        public normalize(thickness: number = 1) {
            if (this.length != 0) {
                var invLength = thickness / this.length;
                this.x *= invLength;
                this.y *= invLength;
                return;
            }
        }

        public distance(vec: Vec2): number {
            var x: number = (this.x - vec.x);
            var y: number = (this.y - vec.y);
            return Math.sqrt(x * x + y * y);
        }

        public scaleBy(s: number): void {
            this.x *= s;
            this.y *= s;
        }

        public subtract(a: Vec2, target: Vec2): Vec2 {
            if (!target) {
                target = new Vec2();
            }

            target.x = this.x - a.x;
            target.y = this.y - a.y;
            return target;
        }

        public add(a: Vec2, target: Vec2): Vec2 {
            if (!target) {
                target = new Vec2();
            }

            target.x = this.x + a.x;
            target.y = this.y + a.y;
            return target;
        }

        public copyFrom(src: Vec2): void {
            this.x = src.x;
            this.y = src.y;
        }
    }
}
