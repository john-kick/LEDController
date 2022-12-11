import { getGradients, removeGradient } from "./gradientOperations.js";

const buttons = [
	{ name: "empty", command: "none" },
	{ name: "red", command: "full FF0000" },
	{ name: "green", command: "full 00FF00" },
	{ name: "blue", command: "full 0000FF" },
	{ name: "rainbow", command: "rainbow" },
	{ name: "vapor", command: "vapor" },
	{ name: "test", command: "test" },
];

const manualInputSubmit = document.getElementById("manualInputSubmit");
manualInputSubmit.addEventListener("click", () => {
	const input = document.getElementById("manualInput").value;
	send(input);
});

const buttonContainer = document.getElementById("button-container");

buttons.forEach((button) => {
	const buttonElem = document.createElement("button");

	buttonElem.setAttribute("class", "btn btn-lg btn-cmd");

	buttonElem.addEventListener("click", async () => {
		send(button.command);
	});

	buttonElem.textContent = button.name;

	buttonContainer.appendChild(buttonElem);
});

const sliders = document.getElementsByClassName("slider");
for (let slider of sliders) {
	const name = slider.getAttribute("id");
	slider.value = localStorage.getItem(name) ?? 50;
	slider.addEventListener("input", async () => {
		localStorage.setItem(name, slider.value);
		const cmd = name + " " + slider.value;
		send(cmd);
	});
}

getGradients().then((gradients) => {
	displayGradients(gradients);
});

const applyButton = document.getElementById("apply-gradient");
applyButton.addEventListener("click", () => {
	const selected = document.getElementsByClassName("selected")[0];
	fetch("/applyGradient", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			gradient: selected,
		}),
	});
});

function send(cmd) {
	fetch("/sendCommand", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			command: cmd,
		}),
	});
}

function displayGradients(gradients) {
	const gradientContainer = document.getElementById("gradients-container");
	if (Object.keys(gradients).length === 0) {
		gradientContainer.toggleAttribute("hidden");
		return;
	}

	for (var gradient in gradients) {
		if (Object.prototype.hasOwnProperty.call(gradients, gradient)) {
			var background = "linear-gradient(to right";

			const colors = eval("gradients." + gradient);

			colors.forEach((color) => {
				background += ", " + color.color + " " + color.position + "%";
			});
			background += ")";

			const wrapper = document.createElement("div");
			wrapper.setAttribute("class", "gradient-wrapper");
			const canvas = document.createElement("canvas");
			canvas.setAttribute("class", "gradient");
			canvas.style.background = background;
			canvas.name = gradient;
			canvas.addEventListener("click", () => {
				const prev = document.getElementsByClassName("selected")[0];
				const editButton = document.getElementById("edit-gradient");
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
				removeGradient(canvas.name);
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

			header.style.top = header.getBoundingClientRect().top + 5;
			header.style.left = header.getBoundingClientRect().left + 5;
		}
	}
}
