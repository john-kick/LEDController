import Pixel from "./Pixel";
import { RGB } from "./util";

export default class Strip {
    pixels: Pixel[];
    length: number;
    brightness: number; // 0 <= x <= 255

    constructor(length: number) {
        this.length = length;
        this.brightness = 255;
        this.pixels = [];
        for (let i = 0; i < length; i++) {
            this.pixels.push(new Pixel());
        }
    }

    public toUint8Array(): Uint8Array {
        // Apply brightness
        const bPixels = this.adaptBrightness();

        const arr = new Uint8Array(this.length * 3);
        for (let i = 0; i < this.length; i++) {
            arr[i * 3] = bPixels[i].r;
            arr[i * 3 + 1] = bPixels[i].g;
            arr[i * 3 + 2] = bPixels[i].b;
        }
        return arr;
    }

    public getPixel(i: number): Pixel {
        return this.pixels[i];
    }

    public setPixel(i: number, pixel: Pixel) {
        this.pixels[i] = pixel;
    }

    public setPixelColor(i: number, color: RGB) {
        this.pixels[i].setColor(color);
    }

    public fill(color: RGB) {
        this.pixels.forEach((pixel) => {
            pixel.setColor(color);
        });
    }

    public clear() {
        this.fill({ r: 0, g: 0, b: 0 });
    }

    public setBrightness(x: number) {
        if (x < 0 || x > 255) throw new Error("Brightness needs to be between 0 and 255");
        this.brightness = x;
    }

    private adaptBrightness(): Pixel[] {
        const rel = this.brightness / 255;
        const bPixels: Pixel[] = [];
        this.pixels.forEach((pixel) => {
            const bPixel = new Pixel(
                pixel.r * rel,
                pixel.g * rel,
                pixel.b * rel
            );
            bPixels.push(bPixel);
        });
        return bPixels;
    }
}