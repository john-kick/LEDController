import { hueToRgb } from "../util";
import BaseAnimation from "./BaseAnimation";

interface RainbowParams {
    speed: string
}

export default class Rainbow extends BaseAnimation {
    private startHue = 0;
    isAnimated: boolean = true;
    stepSize: number = 1;

    public initialize(params: RainbowParams): void {
        this.stepSize = Number(params.speed);
    }

    public refresh(params: RainbowParams): void {
        this.stepSize = Number(params.speed);
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
