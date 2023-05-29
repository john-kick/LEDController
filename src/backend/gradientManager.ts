import fs from "fs";
// import { send } from "./connector.js";
import { getPosition } from "./util.js";
import express, { Request, Response } from "express";
import path from "path";

const baseDirName = path.resolve(path.dirname(""));
const gradientJsonPath = path.join(baseDirName, "/src/backend", "gradients.json");

export function addGradient(obj: string) {
	fs.readFile(gradientJsonPath, "utf8", (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		var grads = data.substring(data.indexOf("{") + 1, data.lastIndexOf("}"));
		var gradStr = JSON.stringify(obj);
		var newGrad = gradStr.substring(1, gradStr.length - 1);
		if (grads.length > 1) {
			grads += ",";
		}
		grads = "{" + grads + newGrad + "}";
		fs.writeFile(gradientJsonPath, grads, "utf8", () => { });
	});
}

export function removeGradient(name: string) {
	fs.readFile(gradientJsonPath, "utf8", (err, data) => {
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

		fs.writeFile(gradientJsonPath, newJson, "utf8", () => { });
	});
}

export function editGradient(obj: string) {
	fs.readFile(gradientJsonPath, "utf8", (err, data) => {
		if (err) {
			console.error(err);
			return;
		}

		const newGradRaw = JSON.stringify(obj);
		var newGrad = newGradRaw.substring(1, newGradRaw.length - 1);

		const gradArr = gradientsToArray(data);

		gradArr.forEach((grad, index) => {
			if (grad.substring(grad.indexOf('"') + 1, getPosition(grad, '"', 2)) === obj) {
				gradArr[index] = newGrad;
			}
		});

		fs.writeFile(gradientJsonPath, "{" + gradArr.join(",") + "}", "utf8", () => { });
	});
}

export function getGradient(name: string): Promise<string | undefined> {
	return new Promise((resolve, reject) => {
		fs.readFile(gradientJsonPath, 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				reject(err);
				return;
			}

			const gradArr = gradientsToArray(data);
			gradArr.forEach((gradient) => {
				if (gradient.substring(gradient.indexOf('"') + 1, getPosition(gradient, '"', 2)) === name) {
					resolve(gradient);
				}
			});
			resolve("");
		});
	});
}

function gradientsToArray(str: string) {
	str = str.substring(1, str.lastIndexOf("}"));
	var arr = [];

	while (str.length > 0) {
		const grad = str.substring(0, str.indexOf("]") + 1);
		str = str.substring(grad.length + 1);
		arr.push(grad);
	}

	return arr;
}
