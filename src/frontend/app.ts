import { getGradients, removeGradient } from "./gradientOperations";

interface gradColor {
	color: string,
	position: string
}

const buttons = [
	{ name: "empty", command: "empty" },
	{ name: "red", command: "fill 255 0 0" },
	{ name: "green", command: "fill 0 255 0" },
	{ name: "blue", command: "fill 0 0 255" },
	{ name: "fade", command: "fade 0.5" },
	{ name: "rainbow", command: "rainbow 0.5" },
	{ name: "vapor", command: "vapor" },
	{ name: "test", command: "fade" },
];

const manualInputSubmit = document.getElementById("manualInputSubmit") as HTMLButtonElement;
manualInputSubmit.addEventListener("click", () => {
	const input = (document.getElementById("manualInput") as HTMLInputElement).value;
	send(input);
});

const buttonContainer = document.getElementById("button-container") as HTMLDivElement;

buttons.forEach((button) => {
	const buttonElem = document.createElement("button");

	buttonElem.setAttribute("class", "btn btn-lg btn-cmd");

	buttonElem.addEventListener("click", async () => {
		send("animation " + button.command);
	});

	buttonElem.textContent = button.name;

	buttonContainer.appendChild(buttonElem);
});

const sliders = document.getElementsByClassName("slider") as HTMLCollectionOf<HTMLInputElement>;
for (let slider of sliders) {
	const name = slider.getAttribute("id") ?? "";
	slider.value = localStorage.getItem(name) ?? "50";
	slider.addEventListener("input", async () => {
		localStorage.setItem(name, slider.value);
		const cmd = name + " " + slider.value;
		send(cmd);
	});
}

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

function send(cmd: string) {
	fetch("/command", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			command: cmd,
		}),
	});
}

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

			header.style.top = (header.getBoundingClientRect().top + 5).toString();
			header.style.left = (header.getBoundingClientRect().left + 5).toString();
		}
	}
}
