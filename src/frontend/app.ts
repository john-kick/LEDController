import AnimationButton, { AnimationParameter } from "./AnimationButton";
import { getGradients, removeGradient } from "./gradientOperations";
import { post } from "./util";

interface gradColor {
	color: string,
	position: string
}

interface button {
	name: string,
	command: string,
	params: AnimationParameter[]
}

const buttons: button[] = [
	{
		name: "Empty",
		command: "empty",
		params: []
	},
	{
		name: "Fill",
		command: "fill",
		params: [
			{ name: "Red", type: ["range", "0", "255", "1"] },
			{ name: "Green", type: ["range", "0", "255", "1"] },
			{ name: "Blue", type: ["range", "0", "255", "1"] }
		]
	},
	{
		name: "Fade",
		command: "fade",
		params: [
			{ name: "Speed", type: ["range", "0", "10", "0.1"] }
		]
	},
	{
		name: "Rainbow",
		command: "rainbow",
		params: [
			{ name: "Speed", type: ["range", "0", "10", "0.1"] }
		]
	},
	{
		name: "Show gradient",
		command: "showGradient",
		params: []
	},
	{
		name: "Noise",
		command: "noise",
		params: []
	},
	{
		name: "Test",
		command: "test",
		params: []
	}
];

const buttonContainer = document.getElementById("animation-buttons") as HTMLDivElement;
const paramsFormContainer = document.getElementById("params-form-container") as HTMLDivElement;
const paramsForm = document.getElementById("params-form") as HTMLFormElement;
const paramsContainer = document.getElementById("params-container") as HTMLDivElement;
const gradientContainer = document.getElementById("gradients-container") as HTMLDivElement;

buttons.forEach((button) => {
	const buttonElem = new AnimationButton(button.name, button.command, button.params);
	buttonElem.addEventListener("click", async () => {
		if (buttonElem.classList.contains("selected")) {
			buttonElem.classList.remove("selected");
			paramsFormContainer.style.visibility = "hidden";
			paramsForm.style.height = "0px";
		} else {
			const prevSelected = buttonContainer.getElementsByClassName("selected")[0];
			if (prevSelected) prevSelected.classList.remove("selected");
			buttonElem.classList.add("selected");
			paramsFormContainer.style.visibility = "";
			paramsForm.style.height = "fit-content";
		}

		// Remove any existing param elements in form
		const prevParams = document.getElementsByClassName("param");
		const length = prevParams.length;
		for (let i = 0; i < length; i++) {
			paramsContainer.removeChild(prevParams[0]);
		}

		const params = buttonElem.getParamsHTML();

		params.forEach((param) => {
			paramsContainer.appendChild(param);
		});
	});

	buttonContainer.appendChild(buttonElem);
});

paramsForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const formData = new FormData(paramsForm);

	const postData: { [key: string]: string } = {};

	for (const [key, value] of formData.entries()) {
		postData[key.toLowerCase()] = value.toString();
	}

	const selected = buttonContainer.getElementsByClassName("selected")[0] as AnimationButton;

	post({ name: selected.getCommand(), params: postData }, "command");
});

const brightnessSlider = document.getElementById("brightness") as HTMLInputElement;
const brightnessInput = document.getElementById("brightness-text") as HTMLInputElement;

brightnessSlider.addEventListener("input", () => {
	brightnessInput.value = brightnessSlider.value;
	post({ brightness: Math.floor(Number(brightnessSlider.value)) }, "brightness");
});

brightnessInput.addEventListener("input", () => {
	const pattern: RegExp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	if (!pattern.test(brightnessInput.value)) {
		brightnessInput.style.color = "red";
		return;
	}
	brightnessInput.style.color = "";
	brightnessSlider.value = brightnessInput.value;
	post({ brightness: brightnessInput.value }, "brightness");
});

getGradients().then((gradients) => {
	displayGradients(gradients);
});

const applyButton = document.getElementById("apply-gradient") as HTMLButtonElement;
applyButton.addEventListener("click", () => {
	const selected = gradientContainer.getElementsByClassName("selected")[0] as HTMLCanvasElement;
	fetch("/applyGradient", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ name: selected.getAttribute("name") ?? "" }),
	});
});

function displayGradients(gradients: String[]) {
	if (Object.keys(gradients).length === 0) {
		gradientContainer.toggleAttribute("hidden");
		return;
	}

	for (var gradient in gradients) {
		if (Object.prototype.hasOwnProperty.call(gradients, gradient)) {
			var background = "linear-gradient(to right";

			const colors: gradColor[] = Object.values(eval("gradients." + gradient));

			colors.forEach((color: gradColor) => {
				background += ", " + color.color + " " + color.position + "%";
			});
			background += ")";

			const wrapper = document.createElement("div");
			wrapper.setAttribute("class", "gradient-wrapper");
			const canvas = document.createElement("canvas");
			canvas.setAttribute("class", "gradient");
			canvas.style.background = background;
			canvas.setAttribute("name", gradient);
			wrapper.addEventListener("click", () => {
				const prev = gradientContainer.getElementsByClassName("selected")[0];
				const editButton = document.getElementById("edit-gradient") as HTMLButtonElement;
				if (prev) {
					prev.classList.remove("selected");
					editButton.classList.add("disabled");
					applyButton.classList.add("disabled");
					if (canvas !== prev) {
						canvas.classList.add("selected");
						editButton.classList.remove("disabled");
						applyButton.classList.remove("disabled");
					}
				} else {
					canvas.classList.add("selected");
					editButton.classList.remove("disabled");
					applyButton.classList.remove("disabled");
				}
			});

			const header = document.createElement("div");
			header.setAttribute("class", "gradient-header");
			const remove = document.createElement("a");
			remove.href = "#";
			remove.setAttribute("class", "remove-gradient");
			remove.addEventListener("click", () => {
				removeGradient(canvas.getAttribute("name") ?? "");
				setTimeout(function () {
					window.location.reload();
				}, 10);
			});
			const title = document.createElement("h5");
			title.setAttribute("class", "gradient-name");
			title.textContent = gradient;

			wrapper.appendChild(canvas);
			wrapper.appendChild(header);
			header.appendChild(remove);
			header.appendChild(title);
			gradientContainer.appendChild(wrapper);
		}
	}
}
