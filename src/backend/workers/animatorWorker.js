import { parentPort } from "worker_threads";
import { send } from "../connector.js";
import { delay } from "../util.js";
import dgram from "dgram";

let running = false;
let animation;
const socket = dgram.createSocket("udp4");

parentPort.on("message", async (binds) => {
	const { init, animationName, params, brightness } = binds;
	console.log(binds);

	if (init) {
		const Animation = require(`../animations/${animationName}`).default;
		animation = new Animation();
		animation.strip.setBrightness(brightness);

		if (animation.isAnimated) {
			running = true;
			while (running) {
				animation.step();
				send();
				await delay(1000 / 144);
			}
		} else {
			animation.initialize(params);
			send();
		}
	} else if (params) {
		if (animation.isAnimated) {
			animation.refresh(params);
		} else {
			animation.initialize(params);
			send();
		}
	}
	if (brightness || brightness === 0) {
		animation.strip.setBrightness(brightness);
		if (!animation.isAnimated) {
			send();
		}
	}
});

// Listen for a message to stop the animation
parentPort.on("close", () => {
	running = false;
});

function send() {
	socket.send(animation.strip.toUint8Array(), 8888, "192.168.178.98", (err) => {
		parentPort.emit("messageerror", err);
	});
}
