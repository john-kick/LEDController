import { getGradients, removeGradient } from "./gradientOperations";
import { post } from "./util";

interface gradColor {
	color: string,
	position: string
}

const buttons = [
	{ name: "Empty", command: "empty" },
	{ name: "Fill red", command: "fill 255 0 0" },
	{ name: "Fill green", command: "fill 0 255 0" },
	{ name: "Fill blue", command: "fill 0 0 255" },
	{ name: "Fade", command: "fade 0.5" },
	{ name: "rainbow", command: "rainbow 0.5" },
	{ name: "Vapor", command: "vapor" },
	{ name: "Test", command: "fade" },
	{ name: "Show gradient", command: "showGradient" }
];

const manualInputSubmit = document.getElementById("manualInputSubmit") as HTMLButtonElement;
manualInputSubmit.addEventListener("click", () => {
	const input = (document.getElementById("manualInput") as HTMLInputElement).value;
	post({ value: input }, "manualInput");
});

const buttonContainer = document.getElementById("animation-buttons") as HTMLDivElement;

buttons.forEach((button) => {
	const buttonElem = document.createElement("button");

	buttonElem.setAttribute("class", "primary-button");

	buttonElem.addEventListener("click", async () => {
		post({ command: "animation " + button.command }, "command");
	});

	buttonElem.textContent = button.name;

	buttonContainer.appendChild(buttonElem);
});

const brightnessSlider = document.getElementById("brightness") as HTMLInputElement;
const brightnessInput = document.getElementById("brightness-text") as HTMLInputElement;
brightnessSlider.addEventListener("input", () => {
	brightnessInput.value = brightnessSlider.value;
});

brightnessSlider.addEventListener("input", () => {
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
	const selected = document.getElementsByClassName("selected")[0];
	fetch("/applyGradient", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ name: selected.getAttribute("name") ?? "" }),
	});
});

function displayGradients(gradients: String[]) {
	const gradientContainer = document.getElementById("gradients-container") as HTMLDivElement;
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
			canvas.addEventListener("click", () => {
				const prev = document.getElementsByClassName("selected")[0];
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
