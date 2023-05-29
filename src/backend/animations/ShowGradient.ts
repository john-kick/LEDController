import Gradient, { ColorStep } from "../Gradient";
import { RGB } from "../util";
import BaseAnimation from "./BaseAnimation";

export default class ShowGradient extends BaseAnimation {
    usesGradient: boolean = true;
    gradient: Gradient | undefined;
    public initialize(params: any[]): void {
        this.createGradient(params[0]);
        for (let i = 0; i < this.strip.length; i++) {
            const color = this.gradient!.getColorAtPos(((i / 287) * (100 - 1)) + 1);
            this.strip.setPixelColor(i, color);
        }
    }

    private createGradient(colors: ColorStep[]) {
        this.gradient = new Gradient();
        this.gradient.build(colors);
    }
}
