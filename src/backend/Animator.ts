import BaseAnimation from "./animations/BaseAnimation";
import Fade from "./animations/Fade";
import Fill from "./animations/Fill";
import Rainbow from "./animations/Rainbow"
import { delay } from "./util";
import { send } from "./connector";
import { Worker } from 'worker_threads';

export class Animator {
    animations: Map<string, BaseAnimation>;
    placeholderAnimations: BaseAnimation;

    currentAnimation: BaseAnimation;
    currentAnimationParams: any[] = [];
    worker: Worker | undefined;

    public constructor() {
        this.animations = new Map<string, BaseAnimation>(
            [
                ["empty", new BaseAnimation()],
                ["fill", new Fill()],
                ["fade", new Fade()],
                ["rainbow", new Rainbow()]
            ]
        );

        this.placeholderAnimations = new BaseAnimation();
        this.currentAnimation = this.placeholderAnimations;
        this.currentAnimation.initialize();
    }

    public async switchAnimation(animation: string, params: any[]) {
        if (this.animations.get(animation) !== this.currentAnimation) {
            this.currentAnimation = this.animations.get(animation) ?? this.placeholderAnimations;
            this.currentAnimation.initialize(params);
        } else {
            this.currentAnimation.refresh(params);
        }
        send(this.currentAnimation.strip.toUint8Array());
        this.currentAnimationParams = params;

        if (this.worker) {
            this.worker.terminate();
        }

        if (this.currentAnimation.isAnimated) {
            const binds = { animationName: this.currentAnimation.constructor.name, args: params };

            this.worker = new Worker('./dist/backend/workers/animatorWorker.js');
            this.worker.postMessage(binds);
            this.worker.on("message", (message) => {
                console.log(message);
            })
        }
    }
}