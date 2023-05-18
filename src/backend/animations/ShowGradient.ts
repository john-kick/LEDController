import BaseAnimation from "./BaseAnimation";

export default class ShowGradient extends BaseAnimation {
    usesGradient: boolean = true;
    public initialize(params: any[]): void {
        for (let i = 0; i < this.strip.length; i++) {
            const color = params[0].getColorAtPos(((i / 287) * (100 - 1)) + 1);
            this.strip.setPixelColor(i, color);
        }
    }
}
