import { Worker } from 'worker_threads';
import Gradient from "./Gradient";
import dgram, { Socket } from "dgram";
import { validate } from './util';
import { EffectParameters as EffectParameters } from './effects/Effect';

const WORKER_PATH: string = ".\\src\\backend\\AnimatorWorker.js";

export class EffectController {
    private static socket: Socket = dgram.createSocket("udp4");
    static currentGradient: Gradient = new Gradient();
    worker: Worker | undefined;

    private currentEffect: string = "";
    private currentEffectParameters: EffectParameters = {};

    brightness: number = 255;

    constructor() {
        EffectController.currentGradient.get();
    }

    public updateEffect(effectName: string, effectParameters: {[k: string]: any}) {
        if (!this.worker) {
            this.worker = new Worker(WORKER_PATH);

            this.worker.on('message', message => console.log('Message from worker:\n' + message));
            this.worker.on('error', error => console.error('Error in worker:\n' + error.stack ?? error.message));
            this.worker.on('exit', code => console.log(`Worker exited with code ${code}`));
        }

        effectParameters.gradient = Gradient.getDefaultGradient().getColors();
        effectParameters.brightness = this.brightness;
        this.worker.postMessage({
            effectName,
            effectParameters,
            brightness: this.brightness 
        });

        this.currentEffect = effectName;
        this.currentEffectParameters = effectParameters;
    }

    public setBrightness(b: number) {
        if (!validate({value: b, min: 0, max: 255})) {
            console.error(`Tried to set brightness to ${b}, but must be in [0|255]`);
            return;
        }

        this.brightness = b;
        this.updateEffect(this.currentEffect, this.currentEffectParameters);
    }

    // todo: implement
    private parseParameters(parameters: Object): void /*AnimationParameters*/ {
        
    }

    public static switchGradient(gradientName: string): void {
        this.currentGradient.get(gradientName);
    }

    public static getGradient(): Gradient {
        return EffectController.currentGradient;
    }

    public static getSocket(): Socket {
        return EffectController.socket;
    }
}
