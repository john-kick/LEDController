import { createColorPicker } from "./colorPicker";
import { addGradient, getGradients, editGradient } from "./gradientOperations";
import { setParent } from "./newColorPicker";

const modal = document.getElementById("gradient-modal") as HTMLDivElement;
const modalContent = document.getElementsByClassName("modal-content")[0] as HTMLDivElement;
const addGradientButton = document.getElementById("add-gradient") as HTMLButtonElement;
const editGradientButton = document.getElementById("edit-gradient") as HTMLButtonElement;
const header = document.getElementsByClassName("close")[0] as HTMLButtonElement;

const colorPicker = document.getElementById("color-picker") as HTMLDivElement;

let mode = "add";
let oldName = "";

window.addEventListener("resize", resize);

addGradientButton.onclick = () => {
	mode = "add";
	modal.style.display = "block";
	resize();
};

editGradientButton.onclick = () => {
	mode = "edit";
	modal.style.display = "block";
	const selected = document.getElementsByClassName("selected")[0] as HTMLCanvasElement;
	oldName = selected.getAttribute("name") ?? "";

	const buttons = document.getElementsByClassName("remove-color") as HTMLCollectionOf<HTMLButtonElement>;
	while (buttons.length !== 0) {
		removeGradientColor(buttons[0]);
	}
	(document.getElementById("gradient-name-input") as HTMLInputElement).value = oldName;
	resize();

	let background = selected.style.background;
	let rgbstr = background.substring(26, background.lastIndexOf(")"));

	let colors: string[] = [];
	while (rgbstr !== "") {
		colors.push(rgbstr.substring(0, rgbstr.indexOf("%")));
		rgbstr = rgbstr.substring(rgbstr.indexOf("%") + 3);
	}

	colors.forEach((color) => {
		let rgbp = [color.substring(4, color.indexOf(")")).split(","), color.substring(color.indexOf(") ") + 2)];
		addGradientColor(Number(rgbp[0][0]), Number(rgbp[0][1]), Number(rgbp[0][2]), Number(rgbp[1]));
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
removeColorDummy.setAttribute("class", "remove-color secondary-button");
removeColorDummy.setAttribute("type", "button");
removeColorDummy.textContent = "X";

const colorDummy = document.createElement("div");
colorDummy.setAttribute("class", "gradient-color");

const inputDummy = document.createElement("input");
inputDummy.setAttribute("class", "color-location text-input");

const form = document.getElementById("gradient-form") as HTMLFormElement;
const gradientColorContainer = document.getElementById("gradient-colors") as HTMLDivElement;
const addGradientColorButton = document.getElementById("add-gradient-color") as HTMLButtonElement;

const placeholderColor: HTMLDivElement = document.createElement("div");
let prevClickedColor: HTMLDivElement = placeholderColor;

addGradientColorButton.addEventListener("click", () => {
	addGradientColor();
});
addGradientColor();

function addGradientColor(r: number = 0, g: number = 255, b: number = 255, p?: number) {
	const numColors = gradientColorContainer.getElementsByClassName("gradient-color").length;
	const div = document.createElement("div");
	div.setAttribute("class", "color-container");
	gradientColorContainer.appendChild(div);

	const colorClone = colorDummy.cloneNode(true) as HTMLDivElement;
	colorClone.setAttribute("style", "background: rgb(" + r + ", " + g + ", " + b + ")");

	colorClone.addEventListener("mousedown", (event) => {
		if (event.target === colorClone) {
			createColorPickerOnColor(colorClone);
		}
	});

	colorClone.addEventListener("change", () => {
		refreshGradientPreview();
	});

	const buttonClone = removeColorDummy.cloneNode(true) as HTMLButtonElement;
	buttonClone.addEventListener("click", () => {
		removeGradientColor(buttonClone);
		refreshGradientPreview();
	});

	const inputClone = inputDummy.cloneNode(true) as HTMLInputElement;
	inputClone.addEventListener("input", () => {
		refreshGradientPreview();
	});

	div.appendChild(buttonClone);
	div.appendChild(colorClone);
	div.appendChild(inputClone);

	if (!(p || p === 0)) {
		p = numColors === 0 ? 0 : 100;
	}
	inputClone.value = p.toString();

	if (numColors === 5) {
		addGradientColorButton.toggleAttribute("hidden");
	}
	refreshGradientPreview();
}

function removeGradientColor(button: HTMLButtonElement) {
	if (!button.parentElement) {
		throw new Error("The button is supposed to have a parent element");
	}
	button.parentElement.remove();
	if (gradientColorContainer.getElementsByClassName("gradient-color").length === 4) {
		addGradientColorButton.toggleAttribute("hidden");
	}
}

function createColorPickerOnColor(color: HTMLDivElement) {
	if (prevClickedColor === placeholderColor) {
		openColorPicker(color);
		prevClickedColor = color;
	} else {
		closeColorPicker();
		if (color === prevClickedColor) {
			prevClickedColor = placeholderColor;
		} else {
			openColorPicker(color);
			prevClickedColor = color
		}
	}
}

function openColorPicker(element: HTMLDivElement) {
	colorPicker.style.visibility = "";

	const colorBox = element.getBoundingClientRect();

	colorPicker.style.left = `${colorBox.right - colorBox.left}px`;
	colorPicker.style.top = `${colorBox.bottom}px`;

	setParent(element);

	// createColorPicker(color);
	prevClickedColor = element;
}

function closeColorPicker() {
	colorPicker.style.visibility = "hidden";
}

function resize() {
	modalContent.style.left = (window.innerWidth / 2 - modalContent.getBoundingClientRect().width / 2).toString();
}

export function refreshGradientPreview() {
	const gradientPreview = document.getElementById("gradient-preview") as HTMLDivElement;
	const colorElements = document.getElementsByClassName("gradient-color") as HTMLCollectionOf<HTMLDivElement>;
	const colorLocations = document.getElementsByClassName("color-location") as HTMLCollectionOf<HTMLInputElement>;

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

	const colorElements = document.getElementsByClassName("gradient-color") as HTMLCollectionOf<HTMLDivElement>;
	const gradientName = (document.getElementById("gradient-name-input") as HTMLInputElement).value;

	// used in eval(), do not remove
	const colorLocations = document.getElementsByClassName("color-location") as HTMLCollectionOf<HTMLInputElement>;

	if (colorElements.length < 2) {
		displayFormError("Gradients need at least 2 colors");
		return;
	}

	var nameExists: boolean = false;
	await doesNameExist(gradientName).then((res) => {
		nameExists = res;
	});

	if (nameExists) {
		if (mode !== "edit" || (mode === "edit" && oldName !== gradientName)) {
			displayFormError('Gradient "' + gradientName + '" already exists');
			return;
		}
	}

	let obj: Object = {};
	eval("obj = { " + gradientName + ": []}");

	for (let i = 0; i < colorElements.length; i++) {
		const rgbVal = colorElements[i].style.background.replace(/\s+/g, "");
		eval(
			"obj." + gradientName + ".push({" + "color:rgbVal," + "position: " + "colorLocations[i].value" + "})"
		);
	}

	if (mode === "edit") {
		// obj._replace = oldName;
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
	}, 100);
};

async function doesNameExist(name: string) {
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

function displayFormError(msg: string) {
	var error = document.getElementsByClassName("form-error")[0];

	if (!error) {
		error = document.createElement("span");
		error.setAttribute("class", "form-error");
		modalContent.append(error);
	}

	error.textContent = msg;
}
