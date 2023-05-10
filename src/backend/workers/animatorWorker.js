import { parentPort } from "worker_threads";
import { send } from "../connector.js";
import { delay } from "../util.js";

let running = false;

parentPort.on("message", async (message) => {
	const { animationName, args } = message;

	const Animation = require(`../animations/${animationName}`).default;
	const animation = new Animation();

	running = true;
	while (running) {
		animation.step(args);
		send(animation.strip.toUint8Array());
		await delay(1000 / 60);
	}
});

parentPort.on("messageerror", (err) => {
	console.error(err);
});

// Listen for a message to stop the animation
parentPort.on("close", () => {
	running = false;
});
