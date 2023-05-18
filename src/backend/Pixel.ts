import { RGB } from "./util";

export default class Pixel {
    r!: number;
    g!: number;
    b!: number;

    constructor(r: number = 0, g: number = 0, b: number = 0) {
        this.setR(r);
        this.setG(g);
        this.setB(b);
    }

    public setColor(color: RGB): this {
        this.setR(color.r);
        this.setG(color.g);
        this.setB(color.b);
        return this;
    }

    public setR(r: number): this {
        if (r < 0 || r > 255) throw new Error("r must be between 0 and 255");
        this.r = r;
        return this;
    }

    public setG(g: number): this {
        if (g < 0 || g > 255) throw new Error("g must be between 0 and 255");
        this.g = g;
        return this;
    }

    public setB(b: number): this {
        if (b < 0 || b > 255) throw new Error("b must be between 0 and 255");
        this.b = b;
        return this;
    }

    public setBrightness(x: number) {
        if (x < 0 || x > 255) throw new Error("Brightness needs to be between 0 and 255");
        const rel = x / 255;
        this.r = this.r * rel;
        this.g = this.g * rel;
        this.b = this.b * rel;
    }
}
