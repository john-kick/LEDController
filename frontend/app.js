/*import ColorPicker from './colorPicker.js';
import * as ReactDOM from 'react-dom/client';*/

const buttons = [
	{ name: "red", command: "full FF0000" },
	{ name: "green", command: "full 00FF00" },
	{ name: "blue", command: "full 0000FF" },
	{ name: "rainbow", command: "rainbow" },
	{ name: "vapor", command: "vapor" },
	{ name: "test", command: "test" },
];

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

function send(cmd) {
	fetch("/connector", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			command: cmd,
		}),
	});
}

/*const domContainer = document.getElementById('react-container');
const root = ReactDOM.createRoot(domContainer);
root.render(<ColorPicker></ColorPicker>);*/
