import { EffectController } from "../EffectController";
import Gradient, { ColorStep } from "../Gradient";
import { mapNumber } from "../util";
import Effect, { EffectParams } from "./Effect";
import { NoiseFunction3D, createNoise3D } from "simplex-noise";

interface NoiseParams extends EffectParams {
    gradient: ColorStep[];
    speed: number;
    width: number;
    radius: number;
    resolution: number;
}

export default class Noise extends Effect {
    private readonly speedMultiplier: number = 0.0005;
    usesGradient: boolean = true;
    isAnimated: boolean = true;

    speed: number = 0.1;
    width: number = 1;
    radius: number = 10;
    angle: number = 0;
    resolution: number = 1;
    gradient: Gradient | undefined;
    noiseFunction: NoiseFunction3D | undefined;

    public initialize(parameters: NoiseParams): void {
        this.gradient = new Gradient();
        this.gradient.build(parameters.gradient);
        this.noiseFunction = createNoise3D();

        this.speed = Number(parameters.speed) * this.speedMultiplier;
        this.resolution = 1 / Number(parameters.resolution);
    }

    public step() {
        for (let i = 0; i < 288; i++) {
            const x = this.noiseFunction!(i * this.resolution, Math.sin(this.angle), Math.cos(this.angle));
            const y = mapNumber(-1, 1, 1, 100, x);
            this.strip.setPixelColor(i, this.gradient!.getColorAtPos(y));
        }
        this.angle = (this.angle + this.speed) % (Math.PI * 2);
    }
}
