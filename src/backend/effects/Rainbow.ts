import { hueToRgb } from "../util";
import AnimatedEffect from "./AnimatedEffect";
import Effect, { EffectParams } from "./Effect";

interface RainbowParams extends EffectParams {
    speed: string
}

export default class Rainbow extends AnimatedEffect {
    private startHue = 0;
    isAnimated: boolean = true;
    stepSize: number = 1;

    public initialize(parameters: RainbowParams): void {
        this.stepSize = Number(parameters.speed);
    }

    public step(): void {
        const stepSize = 360 / this.strip.length;
        let nextHue = this.startHue;
        for (let i = 0; i < this.strip.length; i++) {
            const color = hueToRgb(nextHue);
            nextHue = (nextHue + stepSize) % 360;
            this.strip.setPixelColor(i, color);
        }
        this.startHue = (this.startHue + this.stepSize) % 360;
    }
}
