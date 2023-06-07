import Gradient, { ColorStep } from "../Gradient";
import BaseAnimation from "./BaseAnimation";
import { NoiseFunction3D, createNoise3D } from "simplex-noise";

interface NoiseParams {
    gradient: ColorStep[];
    stepsize: number;
    width: number;
    radius: number;
    resolution: number;
}

export default class Noise extends BaseAnimation {
    usesGradient: boolean = true;
    isAnimated: boolean = true;

    stepSize: number = 0.1;
    width: number = 1;
    radius: number = 10;
    angle: number = 0;
    resolution: number = 1;
    gradient: Gradient | undefined;
    noiseFunction: NoiseFunction3D | undefined;
    public initialize(params: NoiseParams): void {
        this.createGradient(params.gradient);
        this.noiseFunction = createNoise3D();

        this.stepSize = Number(params.stepsize);
        this.resolution = 1 / params.resolution;
    }

    public refresh(params: NoiseParams): void {
        this.createGradient(params.gradient);
        this.stepSize = Number(params.stepsize);
        this.resolution = 1 / Number(params.resolution);
    }

    public step() {
        for (let i = 0; i < 288; i++) {
            const x = this.noiseFunction!(i * this.resolution, Math.cos(this.angle), Math.cos(this.angle));

            // Map values from (-1|1) to (1|100)
            const y = (((x + 1) / 2) * 99) + 1;

            this.strip.setPixelColor(i, this.gradient!.getColorAtPos(y));
        }
        this.angle = (this.angle + this.stepSize) % Math.PI * 2;
    }

    private createGradient(colors: ColorStep[]) {
        if (!this.gradient) {
            this.gradient = new Gradient();
        }
        this.gradient.build(colors);
    }
}
