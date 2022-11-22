import fs from "fs";

export function addGradient(obj) {
	fs.readFile("gradients.json", "utf8", (err, data) => {
		if (err) {
			console.error(err);
			return;
		}

		var prevGrads = data.substring(0, data.lastIndexOf("}"));
		var newGrad = JSON.stringify(obj);
		var curr = prevGrads + "," + newGrad.substring(1);
		fs.writeFile("gradients.json", curr, "utf8", () => {});
	});
}
