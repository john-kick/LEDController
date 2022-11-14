export function createColorPicker() {
	const parent = document.getElementsByClassName("content")[0];

	parent.append(create());

	const colorCanvas = document.getElementById("color-canvas");
	const CanvasCtx = colorCanvas.getContext("2d");

	updateCanvas({
		r: 255,
		g: 0,
		b: 0,
	});

	const colorSlider = document.getElementById("color-slider");
	const SliderCtx = colorSlider.getContext("2d");

	let gradientSlider = SliderCtx.createLinearGradient(0, 0, 0, 300);
	gradientSlider.addColorStop(0, "rgb(255, 0, 0)");
	gradientSlider.addColorStop(0.16, "rgb(255, 255, 0)");
	gradientSlider.addColorStop(0.32, "rgb(0, 255, 0)");
	gradientSlider.addColorStop(0.5, "rgb(0, 255, 255)");
	gradientSlider.addColorStop(0.66, "rgb(0, 0, 255)");
	gradientSlider.addColorStop(0.83, "rgb(255, 0, 255)");
	gradientSlider.addColorStop(1, "rgb(255, 0, 0)");
	SliderCtx.fillStyle = gradientSlider;
	SliderCtx.fillRect(0, 0, SliderCtx.canvas.width, SliderCtx.canvas.height);

	const preview = document.getElementById("preview");

	const canvasBounds = colorCanvas.getBoundingClientRect();
	const canvasMarker = colorCanvas.nextElementSibling;
	canvasMarker.style.left = localStorage.getItem("canvasMarkerX") ?? canvasBounds.left - 8;
	canvasMarker.style.top = localStorage.getItem("canvasMarkerY") ?? canvasBounds.top - 8;

	const sliderBounds = colorSlider.getBoundingClientRect();
	const sliderMarker = colorSlider.nextElementSibling;
	sliderMarker.style.left = sliderBounds.left - 3;
	sliderMarker.style.top = localStorage.getItem("sliderMarker") ?? sliderBounds.top - 8;

	updateSliderMarkerColor();
	updateCanvasMarkerColor();

	colorCanvas.addEventListener("mousedown", (event) => {
		canvasMarker.style.top = event.clientY - 8;
		canvasMarker.style.left = event.clientX - 8;

		localStorage.setItem("canvasMarkerX", canvasMarker.offsetLeft);
		localStorage.setItem("canvasMarkerY", canvasMarker.offsetTop);

		updateCanvasMarkerColor();

		canvasMarker.dispatchEvent(new Event("mousedown"));
	});

	colorSlider.addEventListener("mousedown", (event) => {
		sliderMarker.style.top = event.clientY - 8;

		localStorage.setItem("sliderMarker", sliderMarker.offsetTop);

		updateSliderMarkerColor();

		sliderMarker.dispatchEvent(new Event("mousedown"));
	});

	makeDraggable(canvasMarker, dragCanvasMarker);
	makeDraggable(sliderMarker, dragSliderMarker);

	function makeDraggable(elmnt, onDrag) {
		elmnt.onmousedown = dragMouseDown;

		function dragMouseDown(e) {
			e = e || window.event;
			e.preventDefault();
			// get the mouse cursor position at startup:
			document.onmouseup = closeDragElement;
			// call a function whenever the cursor moves:
			document.onmousemove = elementDrag;
		}

		function elementDrag(e) {
			e = e || window.event;
			e.preventDefault();

			onDrag(e, elmnt);
		}

		function closeDragElement() {
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}

	function updateCanvasMarkerColor() {
		let x = canvasMarker.offsetLeft - canvasBounds.left + 8;
		let y = canvasMarker.offsetTop - canvasBounds.top + 8;
		const pixel = CanvasCtx.getImageData(x, y, 1, 1)["data"];
		const rgb = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
		canvasMarker.style.background = rgb;
		preview.style.background = rgb;
	}

	function updateSliderMarkerColor() {
		let y = sliderMarker.offsetTop - sliderBounds.top + 8;
		const pixel = SliderCtx.getImageData(1, y, 1, 1)["data"];
		const rgb = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
		sliderMarker.style.background = rgb;

		updateCanvas({
			r: pixel[0],
			g: pixel[1],
			b: pixel[2],
		});
	}

	function dragCanvasMarker(event, elmnt) {
		const x = event.clientX;
		const y = event.clientY;

		if (y < canvasBounds.top) {
			elmnt.style.top = canvasBounds.top - 7;
		} else if (y > canvasBounds.bottom) {
			elmnt.style.top = canvasBounds.bottom - 9;
		} else {
			elmnt.style.top = y - 8;
		}

		if (x < canvasBounds.left) {
			elmnt.style.left = canvasBounds.left - 7;
		} else if (x > canvasBounds.right) {
			elmnt.style.left = canvasBounds.right - 9;
		} else {
			elmnt.style.left = x - 8;
		}

		localStorage.setItem("canvasMarkerX", elmnt.offsetLeft);
		localStorage.setItem("canvasMarkerY", elmnt.offsetTop);

		updateCanvasMarkerColor();
	}

	function dragSliderMarker(event, elmnt) {
		const y = event.clientY;

		if (y < sliderBounds.top) {
			elmnt.style.top = sliderBounds.top - 8;
		} else if (y > sliderBounds.bottom) {
			elmnt.style.top = sliderBounds.bottom - 8;
		} else {
			elmnt.style.top = y - 8;
		}

		localStorage.setItem("sliderMarker", elmnt.offsetTop);

		updateSliderMarkerColor();
		updateCanvasMarkerColor();
	}

	function updateCanvas(sliderColor) {
		const color = `rgba(${sliderColor.r},${sliderColor.g},${sliderColor.b},1)`;
		let gradientH = CanvasCtx.createLinearGradient(0, 0, CanvasCtx.canvas.width, 0);
		gradientH.addColorStop(0, "#fff");
		gradientH.addColorStop(1, color);
		CanvasCtx.fillStyle = gradientH;
		CanvasCtx.fillRect(0, 0, CanvasCtx.canvas.width, CanvasCtx.canvas.height);

		let gradientV = CanvasCtx.createLinearGradient(0, 0, 0, 300);
		gradientV.addColorStop(0, "rgba(0,0,0,0)");
		gradientV.addColorStop(1, "#000");
		CanvasCtx.fillStyle = gradientV;
		CanvasCtx.fillRect(0, 0, CanvasCtx.canvas.width, CanvasCtx.canvas.height);
	}
}

function create() {
	const wrapper = document.createElement("div");
	wrapper.setAttribute("id", "color-picker-wrapper");

	const preview = document.createElement("div");
	preview.setAttribute("id", "preview");

	const selectionWrapper = document.createElement("div");
	selectionWrapper.style.display = "flex";
	selectionWrapper.style.marginTop = "5px";

	const colorCanvas = document.createElement("canvas");
	colorCanvas.setAttribute("id", "color-canvas");
	colorCanvas.setAttribute("width", "300px");
	colorCanvas.setAttribute("height", "300px");

	const canvasMarker = document.createElement("div");
	canvasMarker.setAttribute("id", "canvas-marker");

	const sliderCanvas = document.createElement("canvas");
	sliderCanvas.setAttribute("id", "color-slider");
	sliderCanvas.setAttribute("width", "30px");
	sliderCanvas.setAttribute("height", "300px");

	const sliderMarker = document.createElement("div");
	sliderMarker.setAttribute("id", "slider-marker");

	wrapper.append(preview);
	wrapper.append(selectionWrapper);
	selectionWrapper.appendChild(colorCanvas);
	selectionWrapper.appendChild(canvasMarker);
	selectionWrapper.appendChild(sliderCanvas);
	selectionWrapper.appendChild(sliderMarker);

	return wrapper;
}
