import fs from "fs";
import { sendMsg } from "./connector.js";
import { getPosition } from "./util.js";

export function addGradient(obj) {
	fs.readFile("gradients.json", "utf8", (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		var grads = data.substring(data.indexOf("{") + 1, data.lastIndexOf("}"));
		var gradStr = JSON.stringify(obj.grad);
		var newGrad = gradStr.substring(1, gradStr.length - 1);
		if (grads.length > 1) {
			grads += ",";
		}
		grads = "{" + grads + newGrad + "}";
		fs.writeFile("gradients.json", grads, "utf8", () => {});
	});
}

export function removeGradient(name) {
	fs.readFile("gradients.json", "utf8", (err, data) => {
		if (err) {
			console.error(err);
			return;
		}

		const gradArr = gradientsToArray(data);

		var newJson = "{";

		gradArr.forEach((gradient) => {
			let thisName = gradient.substring(gradient.indexOf('"') + 1, getPosition(gradient, '"', 2));
			if (!(thisName === name)) {
				newJson += gradient + ",";
			}
		});

		if (gradArr.length > 1) {
			// Remove trailing commas
			newJson = newJson.substring(0, newJson.lastIndexOf("]")) + "]";
		}
		newJson += "}";

		fs.writeFile("gradients.json", newJson, "utf8", () => {});
	});
}

export function editGradient(obj) {
	fs.readFile("gradients.json", "utf8", (err, data) => {
		if (err) {
			console.error(err);
			return;
		}

		const newGradRaw = JSON.stringify(obj.grad);
		var newGrad = newGradRaw.substring(1, newGradRaw.length - 1);

		const gradArr = gradientsToArray(data);

		gradArr.forEach((grad, index) => {
			if (grad.substring(grad.indexOf('"') + 1, getPosition(grad, '"', 2)) === obj._replace) {
				gradArr[index] = newGrad;
			}
		});

		fs.writeFile("gradients.json", "{" + gradArr.join(",") + "}", "utf8", () => {});
	});
}

export function applyGradient(gradient) {
	fs.readFile("gradients.json", "utf8", (err, data) => {
		if (err) {
			console.error(err);
			return;
		}

		const gradArr = gradientsToArray(data);
		gradArr.forEach((grad) => {
			if (grad.substring(grad.indexOf('"') + 1, getPosition(grad, '"', 2)) === gradient.name) {
				sendMsg("gradient " + grad.substring(grad.indexOf("[") + 1, grad.indexOf("]")));
				return;
			}
		});
	});
}

function gradientsToArray(str) {
	str = str.substring(1, str.lastIndexOf("}"));
	var arr = [];

	while (str.length > 0) {
		const grad = str.substring(0, str.indexOf("]") + 1);
		str = str.substring(grad.length + 1);
		arr.push(grad);
	}

	return arr;
}
