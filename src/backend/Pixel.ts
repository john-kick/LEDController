import { RGB } from "./util";

export default class Pixel {
    r!: number;
    g!: number;
    b!: number;

    /**
     * @param r Color value for red
     * @param g Color value for green
     * @param b Color value for purple
     */
    constructor(r: number = 0, g: number = 0, b: number = 0) {
        this.setR(r);
        this.setG(g);
        this.setB(b);
    }

    /**
     * @param color The RGB object to set the pixels color to
     * @returns The Pixel object with the changed color
     */
    public setColor(color: RGB): this {
        this.setR(color.r);
        this.setG(color.g);
        this.setB(color.b);
        return this;
    }

    /**
     * @param r Color value for red. Must be between 0-255
     * @returns The Pixel object with the changed color
     */
    public setR(r: number): this {
        if (r < 0 || r > 255) throw new Error("r must be between 0 and 255");
        this.r = r;
        return this;
    }

    /**
     * @param g Color value for green. Must be between 0-255
     * @returns The Pixel object with the changed color
     */
    public setG(g: number): this {
        if (g < 0 || g > 255) throw new Error("g must be between 0 and 255");
        this.g = g;
        return this;
    }

    /**
     * @param b Color value for blue. Must be between 0-255
     * @returns The Pixel object with the changed color
     */
    public setB(b: number): this {
        if (b < 0 || b > 255) throw new Error("b must be between 0 and 255");
        this.b = b;
        return this;
    }

    /**
     * @param x The brightness value of the pixel. Must be between 0-255
     */
    public setBrightness(x: number) {
        if (x < 0 || x > 255) throw new Error("Brightness needs to be between 0 and 255");
        const rel = x / 255;
        this.r = this.r * rel;
        this.g = this.g * rel;
        this.b = this.b * rel;
    }
}
