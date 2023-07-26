import { RGB } from "../util";
import BaseAnimation from "./BaseAnimation";

interface TheaterParams {
    red: string;
    green: string;
    blue: string;
    speed: string;
    segment: string;
    gap: string;
}

export default class Theater extends BaseAnimation {
    isAnimated: boolean = true;
    color: RGB = { r: 0, g: 0, b: 0 };
    speed: number = 0;
    segment: number = 0;
    gap: number = 0;
    completeLength: number = 0;

    position: number = 0;

    public initialize(params: TheaterParams): void {
        this.color = {
            r: Number(params.red),
            g: Number(params.green),
            b: Number(params.blue),
        } as RGB;
        this.speed = Number(params.speed);
        this.segment = Number(params.segment);
        this.gap = Number(params.gap);
        this.position = 0;

        this.completeLength = this.segment + this.gap;
    }

    public refresh(params: TheaterParams): void {
        this.color = {
            r: Number(params.red),
            g: Number(params.green),
            b: Number(params.blue),
        } as RGB;
        this.speed = Number(params.speed);
        this.segment = Number(params.segment);
        this.gap = Number(params.gap);

        this.completeLength = this.segment + this.gap;
    }

    public step(): void {
        this.strip.clear();

        for (let i = 0; i < this.strip.length; i++) {
            if ((i % this.completeLength) <= this.segment) {
                this.strip.setPixelColor((this.position + i) % this.strip.length, this.color);
            }
        }

        this.position = Math.floor((this.position + 1) * (this.speed)) % this.strip.length;
    }
}
