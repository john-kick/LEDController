import BaseAnimation from "./animations/BaseAnimation";
import Fade from "./animations/Fade";
import Fill from "./animations/Fill";
import Rainbow from "./animations/Rainbow"
import { Worker } from 'worker_threads';
import Gradient from "./Gradient";
import ShowGradient from "./animations/ShowGradient";
import dgram, { Socket } from "dgram";
import Noise from "./animations/Noise";

export class Animator {
    animations: Map<string, BaseAnimation>;
    placeholderAnimation: BaseAnimation;
    brightness: number = 255;

    socket: Socket;

    currentAnimation: BaseAnimation;
    currentAnimationParams: any[] = [];
    currentGradient: Gradient;
    worker: Worker;

    public constructor() {
        this.socket = dgram.createSocket('udp4');

        this.animations = new Map<string, BaseAnimation>(
            [
                ["empty", new BaseAnimation()],
                ["fill", new Fill()],
                ["fade", new Fade()],
                ["rainbow", new Rainbow()],
                ["showGradient", new ShowGradient()],
                ["noise", new Noise()]
            ]
        );

        this.placeholderAnimation = new BaseAnimation();
        this.currentAnimation = this.placeholderAnimation;
        this.currentAnimation.initialize();
        this.currentGradient = new Gradient();
        this.currentGradient.get();

        this.worker = new Worker('./dist/backend/workers/animatorWorker.js');
        this.buildWorker();
    }

    public async switchAnimation(animation: string, params: any) {
        if (!animation) {
            console.error("No animation name given");
            return;
        }

        const newAnimation = this.animations.get(animation) ?? this.placeholderAnimation;
        if (newAnimation.usesGradient) {
            params.gradient = this.currentGradient.getColors();
        }

        if (newAnimation === this.currentAnimation) {
            const binds = { params: params };
            this.worker.postMessage(binds);
            return;
        }

        this.currentAnimation = newAnimation;

        const binds = {
            animationName: this.currentAnimation.constructor.name,
            params: params,
            brightness: this.brightness
        }

        // stopping currently running animation
        this.worker.postMessage({ running: false });
        this.worker.postMessage(binds);
    }

    public async switchGradient(name: string) {
        this.currentGradient = new Gradient();
        await this.currentGradient.get(name);
        if (!this.currentAnimation.usesGradient) {
            return;
        }

        console.log(this.currentGradient.getColors());
        const binds = { params: { gradient: this.currentGradient.getColors() } };
        this.worker.postMessage({ running: false });
        this.worker.postMessage(binds);
        this.worker.postMessage({ running: true });
    }

    public setBrightness(brightness: number) {
        this.brightness = brightness;
        if (this.worker) {
            this.worker.postMessage({ brightness: brightness });
        }
    }

    private buildWorker() {
        this.worker.on("message", (msg) => { console.log(msg); });
        this.worker.on("error", (error) => {
            console.error("Error in animator worker");
            console.error(error.stack);
            this.rebuildWorker();
        });
    }

    private rebuildWorker() {
        this.worker = new Worker('./dist/backend/workers/animatorWorker.js');
        this.buildWorker();
    }
}
