import { EffectParams } from "./Effect";
import AnimatedEffect from "./AnimatedEffect";
import { RGB, hueToRgb } from "../util";

interface FadeParams extends EffectParams {
    speed: string
}

export default class Fade extends AnimatedEffect {
    isAnimated: boolean = true;
    private hue: number = 0;
    private color: RGB = { r: 0, g: 0, b: 0 };
    private stepSize = 1;

    public initialize(parameters: FadeParams): void {
        this.stepSize = Number(parameters.speed);
    }

    public step(): void {
        this.hue = (this.hue + this.stepSize) % 360;
        this.color = hueToRgb(this.hue);

        for (let i = 0; i < this.strip.length; i++) {
            this.strip.setPixelColor(i, this.color);
        }
    }
}
