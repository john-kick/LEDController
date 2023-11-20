import { parentPort, workerData} from 'worker_threads';
import EffectFactory from "./EffectFactory";
import Effect, { EffectParams as EffectParameters } from "./effects/Effect";
import AnimatedEffect from './effects/AnimatedEffect';
import { EffectController } from './EffectController';
import { Socket } from 'dgram';

const FPS = 60;

if (!parentPort) {
    throw new Error('Parent port not available in worker');
}

const socket: Socket = EffectController.getSocket();
let effect: Effect;

parentPort.on("message", (message) => {
    update(message.effectName, message.effectParameters);
});

async function update(effectName: string, effectParameters: EffectParameters): Promise<void> {
    effect = EffectFactory.getEffect(effectName);
    effect.initialize(effectParameters);
    if (!effect.isAnimated) {
        send();
    }

    if (effect instanceof AnimatedEffect) {
        while (true) {
            effect.step();
            send();
            await delay(1000/FPS);
        }
    }
}

function send(): void {
    socket.send(effect.strip.toUint8Array(), 8888, "192.168.178.98");
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}