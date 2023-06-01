import Gradient, { ColorStep } from "../Gradient";
import { RGB } from "../util";
import BaseAnimation from "./BaseAnimation";

interface ShowGradientParams {
    gradient: ColorStep[];
}

export default class ShowGradient extends BaseAnimation {
    usesGradient: boolean = true;
    gradient: Gradient | undefined;
    public initialize(params: ShowGradientParams): void {
        this.createGradient(params.gradient);
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
