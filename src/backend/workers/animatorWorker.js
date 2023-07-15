import { parentPort } from "worker_threads";
import { delay } from "../util.js";
import dgram from "dgram";

let running = false;
let animation;
const socket = dgram.createSocket("udp4");

const FPS = 144;

parentPort.on("message", async (binds) => {
	if (!animation && !binds.animationName) {
		return;
	}

	if (typeof binds.running !== "undefined") {
		running = binds.running;
		if (running) {
			animate();
		}
		return;
	}

	if (binds.animationName) {
		initialize(binds.animationName, binds.params, binds.brightness);
	} else if (binds.params) {
		refresh(binds.params);
	}
	if (binds.brightness || binds.brightness === 0) {
		animation.strip.setBrightness(binds.brightness);
		if (!animation.isAnimated) {
			updateStrip();
		}
	}
});

async function initialize(animationName, params, brightness) {
	try {
		const Animation = require(`../animations/${animationName}`).default;
		animation = new Animation();
		animation.strip.setBrightness(brightness);

		animation.initialize(params);
		if (animation.isAnimated) {
			animate();
		} else {
			updateStrip();
		}
	} catch (error) {
		throw new Error(`Error while initializing animation: ${error.message}`);
	}
}

async function refresh(params) {
	running = false;
	try {
		if (!animation) {
			throw new Error("No animation initialized before trying to refresh");
		}

		if (animation.isAnimated) {
			animation.refresh(params);
			animate();
		} else {
			animation.initialize(params);
			updateStrip();
		}
	} catch (error) {
		throw new Error(`Error while refreshing animation: ${error.message}`);
	}
}

async function animate() {
	running = true;
	while (running) {
		animation.step();
		updateStrip();
		await delay(1000 / FPS);
	}
}

function updateStrip() {
	try {
		socket.send(animation.strip.toUint8Array(), 8888, "192.168.178.98");
	} catch (error) {
		postError(`Error while updating the strip: ${error.message}`);
	}
}

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
