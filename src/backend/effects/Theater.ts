import { RGB } from "../util";
import AnimatedEffect from "./AnimatedEffect";
import Effect, { EffectParams } from "./Effect";

interface TheaterParams extends EffectParams {
    red: string;
    green: string;
    blue: string;
    size: number;
}

export default class Theater extends AnimatedEffect {
    isAnimated: boolean = true;

    color: RGB = { r: 0, g: 0, b: 0 };
    size: number = 1;
    position: number = 0;

    public initialize(parameters: TheaterParams): void {
        this.color = {
            r: Number(parameters.red),
            g: Number(parameters.green),
            b: Number(parameters.blue),
        } as RGB;
        this.size = parameters.size;
        this.position = 0;
    }

    public step(): void {
        for (let i = 0; i < this.strip.length; i++) {
            if (Math.floor(i / this.size) % 2 === 0) {
                this.strip.setPixelColor((this.position + i) % this.strip.length, this.color);
            } else {
                this.strip.setPixelColor((this.position + i) % this.strip.length, {r: 0, g: 0, b: 0});
            }
        }

        this.position = (this.position + 1) % 288;
    }
}
