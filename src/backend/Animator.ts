import BaseAnimation from "./animations/BaseAnimation";
import Fade from "./animations/Fade";
import Fill from "./animations/Fill";
import Rainbow from "./animations/Rainbow"
import { delay } from "./util";
import { send } from "./connector";
import { Worker } from 'worker_threads';
import Gradient from "./Gradient";
import ShowGradient from "./animations/ShowGradient";

export class Animator {
    animations: Map<string, BaseAnimation>;
    placeholderAnimations: BaseAnimation;

    currentAnimation: BaseAnimation;
    currentAnimationParams: any[] = [];
    currentGradient: Gradient;
    worker: Worker | undefined;

    public constructor() {
        this.animations = new Map<string, BaseAnimation>(
            [
                ["empty", new BaseAnimation()],
                ["fill", new Fill()],
                ["fade", new Fade()],
                ["rainbow", new Rainbow()],
                ["showGradient", new ShowGradient()]
            ]
        );

        this.placeholderAnimations = new BaseAnimation();
        this.currentAnimation = this.placeholderAnimations;
        this.currentAnimation.initialize();
        this.currentGradient = new Gradient();
    }

    public async switchAnimation(animation: string, params: any[]) {
        if (this.animations.get(animation) !== this.currentAnimation) {
            this.currentAnimation = this.animations.get(animation) ?? this.placeholderAnimations;
            if (this.currentAnimation.usesGradient) {
                params = [this.currentGradient].concat(params);
            }
            this.currentAnimation.initialize(params);
            send(this.currentAnimation.strip.toUint8Array());
        } else {
            if (this.currentAnimation.usesGradient) {
                params = [this.currentGradient].concat(params);
            }
            if (this.currentAnimation.isRefreshable) {
                this.currentAnimation.refresh(params);
            } else {
                this.currentAnimation.initialize(params);
            }
        }

        if (this.worker) {
            this.worker.terminate();
        }

        if (this.currentAnimation.isAnimated) {
            const binds = { animationName: this.currentAnimation.constructor.name };

            this.worker = new Worker('./dist/backend/workers/animatorWorker.js');
            this.worker.postMessage(binds);
            this.worker.on("message", (message) => {
                console.log(message);
            })
        }
    }

    public switchGradient(name: string) {
        this.currentGradient = new Gradient(name);
    }
}