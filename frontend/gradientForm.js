import { createColorPicker } from "./colorPicker.js";
import { addGradient, getGradients, editGradient } from "./gradientOperations.js";

const modal = document.getElementById("gradient-modal");
const modalContent = document.getElementsByClassName("modal-content")[0];
const addGradientButton = document.getElementById("add-gradient");
const editGradientButton = document.getElementById("edit-gradient");
const header = document.getElementsByClassName("close")[0];
let mode = "add";
let oldName = null;

window.addEventListener("resize", resize);

addGradientButton.onclick = () => {
	mode = "add";
	modal.style.display = "block";
	resize();
};

editGradientButton.onclick = () => {
	mode = "edit";
	modal.style.display = "block";
	const selected = document.getElementsByClassName("selected")[0];
	oldName = selected.name;

	const buttons = document.getElementsByClassName("remove-color");
	while (buttons.length !== 0) {
		removeGradientColor(buttons[0]);
	}
	document.getElementById("gradient-name-input").value = oldName;
	resize();

	let background = selected.style.background;
	let rgbstr = background.substring(26, background.lastIndexOf(")"));

	let colors = [];
	while (rgbstr !== "") {
		colors.push(rgbstr.substring(0, rgbstr.indexOf("%")));
		rgbstr = rgbstr.substring(rgbstr.indexOf("%") + 3);
	}

	colors.forEach((color) => {
		let rgbp = [color.substring(4, color.indexOf(")")).split(","), color.substring(color.indexOf(") ") + 2)];
		addGradientColor(rgbp[0][0], rgbp[0][1], rgbp[0][2], rgbp[1]);
	});
	refreshGradientPreview();
};

header.onclick = () => {
	modal.style.display = "none";

	window.onclick = (event) => {
		if (event.target === modal) {
			modal.style.display = "none";
		}
	};
};

const removeColorDummy = document.createElement("button");
removeColorDummy.setAttribute("class", "lead remove-color btn-dark form-button");
removeColorDummy.setAttribute("type", "button");
removeColorDummy.textContent = "X";

const colorDummy = document.createElement("div");
colorDummy.setAttribute("class", "gradient-color");

const inputDummy = document.createElement("input");
inputDummy.setAttribute("class", "color-location");

const form = document.getElementById("gradient-form");
const gradientColorContainer = document.getElementById("gradient-colors");
const addGradientColorButton = document.getElementById("add-gradient-color");

let prevClickedColor;

addGradientColorButton.addEventListener("click", () => {
	addGradientColor();
});
addGradientColor();

function addGradientColor(r, g, b, p) {
	r = r || 0;
	g = g || 255;
	b = b || 255;

	const numColors = gradientColorContainer.getElementsByClassName("gradient-color").length;
	const div = document.createElement("div");
	div.setAttribute("class", "color-container");
	gradientColorContainer.appendChild(div);

	const colorClone = colorDummy.cloneNode(true);
	colorClone.setAttribute("style", "background: rgb(" + r + ", " + g + ", " + b + ")");

	colorClone.addEventListener("mousedown", (event) => {
		if (event.target === colorClone) {
			createColorPickerOnColor(colorClone);
		}
	});

	colorClone.addEventListener("change", () => {
		refreshGradientPreview();
	});

	const buttonClone = removeColorDummy.cloneNode(true);
	buttonClone.addEventListener("click", () => {
		removeGradientColor(buttonClone);
		refreshGradientPreview();
	});

	const inputClone = inputDummy.cloneNode(true);
	inputClone.addEventListener("input", () => {
		refreshGradientPreview();
	});

	div.appendChild(buttonClone);
	div.appendChild(colorClone);
	div.appendChild(inputClone);

	inputClone.value = p ?? (numColors === 0 ? 0 : 100);

	if (numColors === 5) {
		addGradientColorButton.toggleAttribute("hidden");
	}
	refreshGradientPreview();
}

function removeGradientColor(button) {
	button.parentElement.remove();
	prevClickedColor = null;
	if (gradientColorContainer.getElementsByClassName("gradient-color").length === 4) {
		addGradientColorButton.toggleAttribute("hidden");
	}
}

function createColorPickerOnColor(color) {
	if (!prevClickedColor) {
		appendColorPicker(color);
	} else {
		if (color === prevClickedColor) {
			closeColorPicker();
			prevClickedColor = null;
		} else {
			closeColorPicker();
			appendColorPicker(color);
		}
	}
}

function appendColorPicker(color) {
	createColorPicker(color);
	prevClickedColor = color;
}

function closeColorPicker() {
	document.getElementById("color-picker-wrapper").remove();
}

function resize() {
	modalContent.style.left = window.innerWidth / 2 - modalContent.getBoundingClientRect().width / 2;
}

function refreshGradientPreview() {
	const gradientPreview = document.getElementById("gradient-preview");
	const colorElements = document.getElementsByClassName("gradient-color");
	const colorLocations = document.getElementsByClassName("color-location");

	if (colorElements.length === 1) {
		gradientPreview.style.background = colorElements[0].style.background;
		return;
	}

	let background = "linear-gradient(to right";
	for (let i = 0; i < colorElements.length; i++) {
		background += ", " + colorElements[i].style.background + " " + colorLocations[i].value + "%";
	}
	background += ")";
	gradientPreview.style.background = background;
}

form.onsubmit = async (event) => {
	event.preventDefault();

	const colorElements = document.getElementsByClassName("gradient-color");
	const colorLocations = document.getElementsByClassName("color-location");
	const gradientName = document.getElementById("gradient-name-input").value;

	if (colorElements.length < 2) {
		displayFormError("Gradients need at least 2 colors");
		return;
	}

	var nameExists;
	await doesNameExist(gradientName).then((res) => {
		nameExists = res;
	});

	if (nameExists) {
		if (mode !== "edit" || (mode === "edit" && oldName !== gradientName)) {
			displayFormError('Gradient "' + gradientName + '" already exists');
			return;
		}
	}

	let obj;
	eval("obj = { 'grad': {" + gradientName + ": []}}");

	for (let i = 0; i < colorElements.length; i++) {
		const rgbVal = colorElements[i].style.background.replace(/\s+/g, "");
		eval(
			"obj.grad." + gradientName + ".push({" + "color:rgbVal," + "position: " + "colorLocations[i].value" + "})"
		);
	}

	if (mode === "edit") {
		obj._replace = oldName;
		const json = JSON.stringify(obj);
		editGradient(json);
	} else {
		const json = JSON.stringify(obj);
		addGradient(json);
	}

	// Remove errors so they are not shown when opening the form again
	const errors = document.getElementsByClassName("form-error");
	for (var i = 0; i < errors.length; i++) {
		errors[i].remove();
	}
	modal.style.display = "none";
	setTimeout(function () {
		window.location.reload();
	}, 10);
};

async function doesNameExist(name) {
	const gradients = await getGradients();
	for (var gradient in gradients) {
		if (Object.prototype.hasOwnProperty.call(gradients, gradient)) {
			if (gradient === name) {
				return true;
			}
		}
	}
	return false;
}

function displayFormError(msg) {
	var error = document.getElementsByClassName("form-error")[0];

	if (!error) {
		error = document.createElement("span");
		error.setAttribute("class", "form-error");
		modalContent.append(error);
	}

	error.textContent = msg;
}
