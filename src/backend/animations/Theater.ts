import { RGB } from "../util";
import BaseAnimation from "./BaseAnimation";

interface TheaterParams {
    red: string;
    green: string;
    blue: string;
    size: number;
}

export default class Theater extends BaseAnimation {
    isAnimated: boolean = true;

    color: RGB = { r: 0, g: 0, b: 0 };
    size: number = 1;
    position: number = 0;

    public initialize(params: TheaterParams): void {
        this.color = {
            r: Number(params.red),
            g: Number(params.green),
            b: Number(params.blue),
        } as RGB;
        this.size = params.size;
        this.position = 0;
    }

    public refresh(params: TheaterParams): void {
        this.color = {
            r: Number(params.red),
            g: Number(params.green),
            b: Number(params.blue),
        } as RGB;
        this.size = params.size;
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
