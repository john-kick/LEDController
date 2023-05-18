import { hueToRgb } from "../util";
import BaseAnimation from "./BaseAnimation";

export default class Rainbow extends BaseAnimation {
    private startHue = 0;
    isAnimated: boolean = true;
    isRefreshable: boolean = true;

    stepSize: number = 1;

    public initialize(params: any[]) {
        this.stepSize = Number(params[0]);
    }

    public step() {
        const stepSize = 360 / this.strip.length;
        let nextHue = this.startHue;
        for (let i = 0; i < this.strip.length; i++) {
            const color = hueToRgb(nextHue);
            nextHue = (nextHue + stepSize) % 360;
            this.strip.setPixelColor(i, color);
        }
        this.startHue = (this.startHue + this.stepSize) % 360;
    }

    public refresh(params: any[]): void {
        this.stepSize = Number(params[0]);
    }
}
