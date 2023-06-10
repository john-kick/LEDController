import Gradient, { ColorStep } from "../Gradient";
import { mapNumber } from "../util";
import BaseAnimation from "./BaseAnimation";
import { NoiseFunction3D, createNoise3D } from "simplex-noise";

interface NoiseParams {
    gradient: ColorStep[];
    speed: number;
    width: number;
    radius: number;
    resolution: number;
}

export default class Noise extends BaseAnimation {
    usesGradient: boolean = true;
    isAnimated: boolean = true;

    speed: number = 0.1;
    width: number = 1;
    radius: number = 10;
    angle: number = 0;
    resolution: number = 1;
    gradient: Gradient | undefined;
    noiseFunction: NoiseFunction3D | undefined;
    public initialize(params: NoiseParams): void {
        this.createGradient(params.gradient);
        this.noiseFunction = createNoise3D();

        this.speed = Number(params.speed);
        this.resolution = 1 / params.resolution;
    }

    public refresh(params: NoiseParams): void {
        this.createGradient(params.gradient);
        this.speed = Number(params.speed) * 0.0001;
        this.resolution = 1 / Number(params.resolution);
    }

    public step() {
        for (let i = 0; i < 288; i++) {
            const x = this.noiseFunction!(i * this.resolution, Math.sin(this.angle), Math.cos(this.angle));
            const y = mapNumber(-1, 1, 1, 100, x);
            this.strip.setPixelColor(i, this.gradient!.getColorAtPos(y));
        }
        this.angle = (this.angle + this.speed) % (Math.PI * 2);
    }

    private createGradient(colors: ColorStep[]) {
        if (!this.gradient) {
            this.gradient = new Gradient();
        }
        this.gradient.build(colors);
    }
}
