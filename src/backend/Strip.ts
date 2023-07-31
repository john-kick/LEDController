import Pixel from "./Pixel";
import { RGB } from "./util";

/**
 * Represents an LED Strip with 'length' amount of LEDs, stored in 'pixels'
 */
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

    /**
     * @returns Bit Array containing the colors r, g and b values (0-255), so 3 * 'length' values
     */
    public toUint8Array(): Uint8Array {
        // Apply brightness
        const bPixels = this.adaptBrightness();

        // Flip to match actual orientation
        bPixels.reverse();

        const arr = new Uint8Array(this.length * 3);
        for (let i = 0; i < this.length; i++) {
            arr[i * 3] = bPixels[i].r;
            arr[i * 3 + 1] = bPixels[i].g;
            arr[i * 3 + 2] = bPixels[i].b;
        }
        return arr;
    }

    /**
     * @param i Pixel at this position
     * @returns Instance of the pixel at this position in pixel array
     */
    public getPixel(i: number): Pixel {
        return this.pixels[i];
    }

    /**
     * @param i Replaces Pixel object at this position in pixels array
     * @param pixel The replacement pixel
     */
    public setPixel(i: number, pixel: Pixel) {
        this.pixels[i] = pixel;
    }

    /**
     * @param i Pixel at this position in the pixels array
     * @param color The RGB object containing r, g and b values of the new color
     */
    public setPixelColor(i: number, color: RGB) {
        this.pixels[i].setColor(color);
    }

    /**
     * @param i Pixel at this position in the pixels array
     * @param x The brightness of this pixel. Must be between 0-255
     */
    public setPixelBrightness(i: number, x: number) {
        if (x < 0 || x > 255) throw new Error("Brightness needs to be between 0 and 255");
        this.pixels[i].setBrightness(x);
    }

    /**
     * Sets the color of every pixel in the pixels array with this color
     * @param color The color to fill the strip with
     */
    public fill(color: RGB) {
        this.pixels.forEach((pixel) => {
            pixel.setColor(color);
        });
    }

    /**
     * Sets the color of each pixel in the pixels array to r=0, g=0, b=0
     */
    public clear() {
        this.fill({ r: 0, g: 0, b: 0 });
    }

    /**
     * @param x The brightness to set the pixels to. Must be 0-255
     */
    public setBrightness(x: number) {
        if (x < 0 || x > 255) throw new Error("Brightness needs to be between 0 and 255");
        this.brightness = x;
    }

    /**
     * @returns The pixel array, but adapting each pixel to the stored brightness
     */
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