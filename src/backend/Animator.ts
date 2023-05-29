import BaseAnimation from "./animations/BaseAnimation";
import Fade from "./animations/Fade";
import Fill from "./animations/Fill";
import Rainbow from "./animations/Rainbow"
import { Worker } from 'worker_threads';
import Gradient from "./Gradient";
import ShowGradient from "./animations/ShowGradient";
import dgram, { Socket } from "dgram";

export class Animator {
    animations: Map<string, BaseAnimation>;
    placeholderAnimation: BaseAnimation;
    brightness: number = 255;

    socket: Socket;

    currentAnimation: BaseAnimation;
    currentAnimationParams: any[] = [];
    currentGradient: Gradient;
    worker: Worker | undefined;

    public constructor() {
        this.socket = dgram.createSocket('udp4');

        this.animations = new Map<string, BaseAnimation>(
            [
                ["empty", new BaseAnimation()],
                ["fill", new Fill()],
                ["fade", new Fade()],
                ["rainbow", new Rainbow()],
                ["showGradient", new ShowGradient()]
            ]
        );

        this.placeholderAnimation = new BaseAnimation();
        this.currentAnimation = this.placeholderAnimation;
        this.currentAnimation.initialize();
        this.currentGradient = new Gradient();
        this.currentGradient.get();
    }

    public async switchAnimation(animation: string, params: any[]) {
        const newAnimation = this.animations.get(animation) ?? this.placeholderAnimation;
        if (newAnimation.usesGradient) {
            params = [this.currentGradient.getColors()].concat(params);
        }
        if (newAnimation === this.currentAnimation) {
            // Send new parameters to worker
            const binds = { params: params }
            this.worker!.postMessage(binds);
        } else {
            this.currentAnimation = newAnimation;

            // Terminate any already running workers
            if (this.worker) {
                this.worker.terminate();
            }

            // Start new worker
            const binds = {
                init: true,
                animationName: this.currentAnimation.constructor.name,
                params: params,
                brightness: this.brightness
            }

            this.worker = new Worker('./dist/backend/workers/animatorWorker.js');
            this.worker.postMessage(binds);

            this.worker.on("message", (msg) => {
                if (msg) { console.log(msg); }
            });
            this.worker.on("messageerror", (msg) => {
                if (msg) { console.error(msg); }
            });
        }
    }

    public async switchGradient(name: string) {
        this.currentGradient = new Gradient();
        await this.currentGradient.get(name);
        const binds = { params: [this.currentGradient.getColors()] }
        if (this.worker) {
            this.worker.postMessage(binds);
        }
    }

    public setBrightness(brightness: number) {
        this.brightness = brightness;
        if (this.worker) {
            this.worker.postMessage({ brightness: brightness });
        }
    }
}
