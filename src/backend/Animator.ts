import { parentPort} from 'worker_threads';
import EffectFactory from "./EffectFactory";
import Effect, { EffectParameters as EffectParameters } from "./effects/Effect";
import AnimatedEffect from './effects/AnimatedEffect';
import { EffectController } from './EffectController';
import { Socket } from 'dgram';
import { getRuntime } from './util';

const FPS = 60;

if (!parentPort) {
    throw new Error('Parent port not available in worker');
}

let animator: ((effect: AnimatedEffect) => void) | undefined;
let id: number = 0;
const socket: Socket = EffectController.getSocket();
let effect: Effect;
let fps: number = 1;
let frameTimeStamp: number = Math.floor(getRuntime() / 1000);

parentPort.on("message", (message) => {
    id = (id + 1) % 1000;
    animator = undefined;
    update(message.effectName, message.effectParameters, message.brightness);
});

async function update(effectName: string, effectParameters: EffectParameters, brightness: number): Promise<void> {
            effect = EffectFactory.getEffect(effectName);
        effect.strip.setBrightness(brightness);
    effect.initialize(effectParameters);
    if (!effect.isAnimated) {
        send();
    }

    if (effect instanceof AnimatedEffect) {
        animator = async (effect: AnimatedEffect) => {
            const functionId = id;
            while (true) {
                if (frameTimeStamp < Math.floor(getRuntime() / 1000)) {
                    fps = 0;
                    frameTimeStamp = Math.floor(getRuntime() / 1000);
                } else {
                    fps++;
                }
                effect.step();
                send();
                await delay(1000 / FPS);
                if (id !== functionId) {
                    return;
                }
            };
        };
        animator(effect);
    }
}

function send(): void {
    socket.send(effect.strip.toUint8Array(), 8888, "192.168.178.98");
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
