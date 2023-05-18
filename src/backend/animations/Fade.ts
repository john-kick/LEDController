import BaseAnimation from "./BaseAnimation";
import { RGB, hueToRgb } from "../util";

export default class Fade extends BaseAnimation {
    isAnimated: boolean = true;
    isRefreshable: boolean = true;
    private hue: number = 0;
    private color: RGB = { r: 0, g: 0, b: 0 };
    private stepSize = 1;

    public initialize(params: any[]): void {
        if (params.length > 1) {
            this.stepSize = Number(params[0]);
        }
    }

    public refresh(params: any[]): void {
        if (params.length > 1) {
            this.stepSize = Number(params[0]);
        }
    }

    public step(): void {
        this.hue = (this.hue + this.stepSize) % 360;
        this.color = hueToRgb(this.hue);

        for (let i = 0; i < this.strip.length; i++) {
            this.strip.setPixelColor(i, this.color);
        }
    }
}
