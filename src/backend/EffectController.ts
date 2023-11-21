import { Worker } from 'worker_threads';
import Gradient from "./Gradient";
import dgram, { Socket } from "dgram";

const WORKER_PATH: string = ".\\src\\backend\\AnimatorWorker.js";

export class EffectController {
    private static socket: Socket = dgram.createSocket("udp4");
    static currentGradient: Gradient = new Gradient();
    worker: Worker | undefined;

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
        this.worker.postMessage({
            effectName,
            effectParameters
        });
    }

    public setBrightness(b: Number) {

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
