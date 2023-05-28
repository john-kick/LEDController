import { rgbToHex, rgbToHsv } from "./util";

interface RGB {
	r: number,
	g: number,
	b: number
}

export function createColorPicker(parent: HTMLElement) {
	parent = parent || document.getElementsByClassName("content")[0];

	const colorPickerWrapper = create();
	parent.append(colorPickerWrapper);

	const colorCanvas: HTMLCanvasElement = document.getElementById("color-canvas") as HTMLCanvasElement;
	const CanvasCtx = colorCanvas.getContext("2d") as CanvasRenderingContext2D;

	const colorSlider = document.getElementById("color-slider") as HTMLCanvasElement;
	const SliderCtx = colorSlider.getContext("2d") as CanvasRenderingContext2D;

	let gradientSlider = SliderCtx.createLinearGradient(0, 0, 360, 0);
	gradientSlider.addColorStop(0 / 6.0, "rgb(255, 0, 0)");
	gradientSlider.addColorStop(0.01 / 6.0, "rgb(255, 0, 0)");
	gradientSlider.addColorStop(1 / 6.0, "rgb(255, 255, 0)");
	gradientSlider.addColorStop(2 / 6.0, "rgb(0, 255, 0)");
	gradientSlider.addColorStop(3 / 6.0, "rgb(0, 255, 255)");
	gradientSlider.addColorStop(4 / 6.0, "rgb(0, 0, 255)");
	gradientSlider.addColorStop(5 / 6.0, "rgb(255, 0, 255)");
	gradientSlider.addColorStop(6 / 6.0, "rgb(255, 0, 0)");
	SliderCtx.fillStyle = gradientSlider;
	SliderCtx.fillRect(0, 0, SliderCtx.canvas.width, SliderCtx.canvas.height);

	let canvasBounds = colorCanvas.getBoundingClientRect();
	const canvasMarker = colorCanvas.nextElementSibling as HTMLDivElement;
	canvasMarker.style.top = "-7";
	canvasMarker.style.left = "-7";

	let sliderBounds = colorSlider.getBoundingClientRect();
	const sliderMarker = colorSlider.nextElementSibling as HTMLDivElement;
	sliderMarker.style.top = "-3";
	sliderMarker.style.left = "-7";

	positionColorPicker();
	window.addEventListener("resize", () => {
		positionColorPicker();
		canvasBounds = colorCanvas.getBoundingClientRect();
		sliderBounds = colorSlider.getBoundingClientRect();
	});

	const rgbInput = Array.from((document.getElementById("input-wrapper") as HTMLDivElement).children).filter(
		(elmnt) => elmnt.tagName === "INPUT"
	) as HTMLInputElement[];
	[rgbInput[0], rgbInput[1], rgbInput[2]].forEach((elmnt) => {
		elmnt.addEventListener("input", () => {
			applyTextInput("rgb");
		});
	});
	rgbInput[3].addEventListener("input", () => {
		applyTextInput("hex");
	});

	let pixel: Uint8ClampedArray;

	const rgbStr = parent.style.background;
	const initialRGB = rgbStr
		.substring(4, rgbStr.length - 1)
		.split(", ");

	updateColorInput(initialRGB);
	applyTextInput("rgb");

	updateSliderMarkerColor();

	colorCanvas.addEventListener("mousedown", (event) => {
		canvasMarker.style.left = (event.clientX - canvasBounds.left - 7).toString();
		canvasMarker.style.top = (event.clientY - canvasBounds.top - 7).toString();

		updateCanvasMarkerColor();

		canvasMarker.dispatchEvent(new Event("mousedown"));
	});

	colorSlider.addEventListener("mousedown", (event) => {
		sliderMarker.style.left = (event.clientX - sliderBounds.left - 7).toString();

		updateSliderMarkerColor();

		sliderMarker.dispatchEvent(new Event("mousedown"));
	});

	makeDraggable(canvasMarker, dragCanvasMarker);
	makeDraggable(sliderMarker, dragSliderMarker);

	function makeDraggable(elmnt: HTMLElement, onDrag: Function) {
		elmnt.onmousedown = dragMouseDown;

		function dragMouseDown(e: MouseEvent) {
			e = e || window.event;
			e.preventDefault();
			document.onmouseup = closeDragElement;
			document.onmousemove = elementDrag;
		}

		function elementDrag(e: MouseEvent) {
			e = e || window.event;
			e.preventDefault();

			onDrag(e);
		}

		function closeDragElement() {
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}

	function updateCanvasMarkerColor() {
		let x = canvasMarker.offsetLeft + 7;
		let y = canvasMarker.offsetTop + 7;
		pixel = CanvasCtx.getImageData(x, y, 1, 1).data;
		const rgb = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
		canvasMarker.style.background = rgb;
		parent.style.background = rgb;

		parent.dispatchEvent(new Event("change"));
	}

	function updateSliderMarkerColor() {
		let x = sliderMarker.offsetLeft + 8;
		const pixel = SliderCtx.getImageData(x, 1, 1, 1)["data"];
		const hue = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
		sliderMarker.style.background = hue;

		updateCanvas({
			r: pixel[0],
			g: pixel[1],
			b: pixel[2],
		});

		updateCanvasMarkerColor();
	}

	function dragCanvasMarker(event: MouseEvent) {
		let x = event.clientX - canvasBounds.left;
		let y = event.clientY - canvasBounds.top;

		if (x < 1) {
			x = 1;
		} else if (x > 255) {
			x = 255;
		}

		if (y < 1) {
			y = 1;
		} else if (y > 256) {
			y = 256;
		}

		canvasMarker.style.left = (x - 8).toString();
		canvasMarker.style.top = (y - 8).toString();

		updateCanvasMarkerColor();

		updateColorInput();
	}

	function dragSliderMarker(event: MouseEvent) {
		let x = event.clientX - sliderBounds.left;

		if (x < 0) {
			x = 0;
		} else if (x > 359) {
			x = 359;
		}

		sliderMarker.style.left = (x - 8).toString();

		updateSliderMarkerColor();

		updateColorInput();
	}

	function applyTextInput(type: string) {
		if (type === "rgb") {
			rgbInput[3].value = rgbToHex(Number(rgbInput[0].value), Number(rgbInput[1].value), Number(rgbInput[2].value));
		} else if (type === "hex") {
			// Do some other stuff idk
		}

		const hsv = rgbToHsv(Number(rgbInput[0].value), Number(rgbInput[1].value), Number(rgbInput[2].value));
		canvasMarker.style.top = (255 - hsv[2] - 8).toString();
		canvasMarker.style.left = (255 * hsv[1] - 8).toString();
		sliderMarker.style.left = (hsv[0] - 8).toString();

		updateSliderMarkerColor();
	}

	function updateColorInput(rgb?: string[]) {
		if (rgb !== undefined) {
			rgbInput[0].value = rgb[0];
			rgbInput[1].value = rgb[1];
			rgbInput[2].value = rgb[2];
			rgbInput[3].value = rgbToHex(Number(rgb[0]), Number(rgb[1]), Number(rgb[2]));
		} else {
			rgbInput[0].value = (pixel[0]).toString();
			rgbInput[1].value = (pixel[1]).toString();
			rgbInput[2].value = (pixel[2]).toString();
			rgbInput[3].value = rgbToHex(Number(pixel[0]), Number(pixel[1]), Number(pixel[2]));
		}
	}

	function updateCanvas(sliderColor: RGB) {
		const color = `rgba(${sliderColor.r},${sliderColor.g},${sliderColor.b},1)`;
		let gradientH = CanvasCtx.createLinearGradient(0, 0, CanvasCtx.canvas.width, 0);
		gradientH.addColorStop(0, "#fff");
		gradientH.addColorStop(1, color);
		CanvasCtx.fillStyle = gradientH;
		CanvasCtx.fillRect(0, 0, CanvasCtx.canvas.width, CanvasCtx.canvas.height);

		let gradientV = CanvasCtx.createLinearGradient(0, 0, 0, 255);
		gradientV.addColorStop(0, "rgba(0,0,0,0)");
		gradientV.addColorStop(1, "#000");
		CanvasCtx.fillStyle = gradientV;
		CanvasCtx.fillRect(0, 0, CanvasCtx.canvas.width, CanvasCtx.canvas.height);
	}

	function positionColorPicker() {
		const colorBounds = parent.getBoundingClientRect();
		const colorPickerBounds = colorPickerWrapper.getBoundingClientRect();
		const formBounds = document.getElementsByClassName("modal-content")[0].getBoundingClientRect();
		const colorListBounds = (document.getElementById("gradient-colors") as HTMLDivElement).getBoundingClientRect();

		colorPickerWrapper.style.top = (colorBounds.top + 30 - formBounds.top).toString();
		colorPickerWrapper.style.left = (colorListBounds.width / 2 - colorPickerBounds.width / 2).toString();

		canvasBounds = colorCanvas.getBoundingClientRect();
		sliderBounds = colorSlider.getBoundingClientRect();
	}
}

function create() {
	const wrapper = document.createElement("div");
	wrapper.setAttribute("id", "color-picker-wrapper");
	wrapper.style.position = "absolute";

	const selectionWrapper = document.createElement("div");
	selectionWrapper.style.marginTop = "5px";

	const canvasWrapper = document.createElement("div");
	canvasWrapper.style.position = "relative";
	canvasWrapper.setAttribute("id", "canvas-wrapper");
	const colorCanvas = document.createElement("canvas");
	colorCanvas.setAttribute("id", "color-canvas");
	colorCanvas.setAttribute("width", "255px");
	colorCanvas.setAttribute("height", "255px");
	const canvasMarker = document.createElement("div");
	canvasMarker.setAttribute("id", "canvas-marker");

	const sliderWrapper = document.createElement("div");
	sliderWrapper.style.position = "relative";
	sliderWrapper.setAttribute("id", "slider-wrapper");
	const sliderCanvas = document.createElement("canvas");
	sliderCanvas.setAttribute("id", "color-slider");
	sliderCanvas.setAttribute("width", "360px");
	sliderCanvas.setAttribute("height", "30px");
	const sliderMarker = document.createElement("div");
	sliderMarker.setAttribute("id", "slider-marker");

	const inputWrapper = document.createElement("div");
	inputWrapper.setAttribute("id", "input-wrapper");

	const rLabel = document.createElement("span");
	rLabel.textContent = "R:";
	const r = document.createElement("input");
	r.style.width = "50px";
	r.setAttribute("class", "color-input");

	const gLabel = document.createElement("span");
	gLabel.textContent = "G:";
	const g = document.createElement("input");
	g.style.width = "50px";
	g.setAttribute("class", "color-input");

	const bLabel = document.createElement("span");
	bLabel.textContent = "B:";
	const b = document.createElement("input");
	b.style.width = "50px";
	b.setAttribute("class", "color-input");

	const hexLabel = document.createElement("span");
	hexLabel.textContent = "HEX:";
	const hex = document.createElement("input");
	hex.style.width = "100px";
	hex.setAttribute("class", "color-input");

	sliderWrapper.appendChild(sliderCanvas);
	sliderWrapper.appendChild(sliderMarker);
	wrapper.appendChild(sliderWrapper);

	canvasWrapper.appendChild(colorCanvas);
	canvasWrapper.appendChild(canvasMarker);
	wrapper.appendChild(canvasWrapper);

	wrapper.appendChild(inputWrapper);

	inputWrapper.appendChild(rLabel);
	inputWrapper.appendChild(r);
	inputWrapper.appendChild(gLabel);
	inputWrapper.appendChild(g);
	inputWrapper.appendChild(bLabel);
	inputWrapper.appendChild(b);
	inputWrapper.appendChild(hexLabel);
	inputWrapper.appendChild(hex);

	return wrapper;
}
