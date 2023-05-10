import { hueToRgb } from "../util";
import BaseAnimation from "./BaseAnimation";

export default class Rainbow extends BaseAnimation {
    private startHue = 0;
    isAnimated: boolean = true;

    public step(params: any[]) {
        const stepSize = 360 / this.strip.length;
        let nextHue = this.startHue;
        for (let i = 0; i < this.strip.length; i++) {
            const color = hueToRgb(nextHue);
            nextHue = (nextHue + stepSize) % 360;
            this.strip.setPixelColor(i, color.r, color.g, color.b);
        }
        this.startHue = (this.startHue + Number(params[0])) % 360;
    }
}
