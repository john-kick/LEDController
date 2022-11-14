const modal = document.getElementById("gradient-modal");
const addGradientButton = document.getElementById("add-gradient");
const span = document.getElementsByClassName("close")[0];

addGradientButton.onclick = () => {
	modal.style.display = "block";
};

span.onclick = () => {
	modal.style.display = "none";

	window.onclick = (event) => {
		if (event.target === modal) {
			modal.style.display = "none";
		}
	};
};

const colorMarker = document.getElementsByClassName("marker");

const removeColorDummy = document.createElement("button");
removeColorDummy.setAttribute("class", "lead remove-color btn-dark form-button");
removeColorDummy.setAttribute("type", "button");
removeColorDummy.textContent = "X";

const colorDummy = document.createElement("div");
colorDummy.setAttribute("class", "gradient-color");

const inputDummy = document.createElement("input");
inputDummy.setAttribute("class", "color-input");

const form = document.getElementById("gradient-form");
const gradientColorContainer = document.getElementById("gradient-colors");
const addGradientColor = document.getElementById("add-gradient-color");

addGradientColor.addEventListener("click", () => {
	const numColors = gradientColorContainer.getElementsByClassName("gradient-color").length;
	if (numColors !== 5) {
		const div = document.createElement("div");
		div.setAttribute("class", "color-container");
		gradientColorContainer.appendChild(div);

		const colorClone = colorDummy.cloneNode(true);
		colorClone.setAttribute("style", "background-color: #0ff");

		const buttonClone = removeColorDummy.cloneNode(true);
		buttonClone.addEventListener("click", (event) => {
			event.target.parentElement.remove();
			if (gradientColorContainer.getElementsByClassName("gradient-color").length === 4) {
				addGradientColor.toggleAttribute("hidden");
			}
		});

		div.appendChild(buttonClone);
		div.appendChild(colorClone);
		div.appendChild(inputDummy.cloneNode(true));

		if (numColors === 4) {
			addGradientColor.toggleAttribute("hidden");
		}
	}
});

form.onsubmit = (event) => {
	event.preventDefault();
};
