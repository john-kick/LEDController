import { refreshGradientPreview } from "./gradientForm";
import { RGB, hexToRgb, hsvToRgb, hueToRgb, isValidHex, rgbToHex, rgbToHsv } from "./util";

const sbCanvas = document.getElementById("sb-canvas") as HTMLCanvasElement;
const sbContext = sbCanvas.getContext("2d") as CanvasRenderingContext2D;
const sbMarker = document.getElementById("sb-marker") as HTMLDivElement;

const gradientPreview = document.getElementById("gradient-preview") as HTMLDivElement;

const hueSlider = document.getElementById("hue-slider") as HTMLInputElement;
const hueSliderContainer = document.getElementById("hue-slider-container") as HTMLDivElement;

const canvasWidth = sbCanvas.width;
const canvasHeight = sbCanvas.height;

const markerSize = 10;

let parent = document.getElementById("placeholder-color") as HTMLDivElement;

let markerPosition = {
    x: 255,
    y: 0
};

const redInput = document.getElementById("red-input") as HTMLInputElement;
const greenInput = document.getElementById("green-input") as HTMLInputElement;
const blueInput = document.getElementById("blue-input") as HTMLInputElement;
const hexInput = document.getElementById("hex-input") as HTMLInputElement;

const btn = document.getElementById("test-button");
btn?.addEventListener("click", () => {
    redInput.value = "255";
    greenInput.value = "0";
    blueInput.value = "0";

    updateColor(true);
});

let ignoreInputUpdate = false; // Flag to ignore input updates triggered by code
let ignoreHexInputUpdate = false; // Flag to ignore input updates triggered by code

function updateColor(fromInput: boolean) {
    ignoreInputUpdate = fromInput;

    const red = Number(redInput.value);
    const green = Number(greenInput.value);
    const blue = Number(blueInput.value);

    // Update hex input value
    hexInput.value = rgbToHex(red, green, blue);
    const hex = hexInput.value;

    // Convert RGB to HSV
    const [h, s, v] = rgbToHsv(red, green, blue);

    // Update marker position
    const markerX = s * canvasWidth;
    const markerY = (1 - v) * canvasHeight;
    updateMarkerPosition(markerX, markerY);

    // Update hue slider value
    updateHueSlider(h);

    // Update color preview
    parent.style.backgroundColor = hex;
    refreshGradientPreview();
}

function updateInputsFromColor(rgb: RGB, hex: string) {
    if (ignoreInputUpdate) {
        ignoreInputUpdate = false;
    } else {
        redInput.value = String(rgb.r);
        greenInput.value = String(rgb.g);
        blueInput.value = String(rgb.b);
    }

    if (ignoreHexInputUpdate) {
        ignoreHexInputUpdate = false;
    } else {
        hexInput.value = hex;
    }
}

redInput.addEventListener("input", () => { updateColor(true); });
greenInput.addEventListener("input", () => { updateColor(true); });
blueInput.addEventListener("input", () => { updateColor(true); });

hexInput.addEventListener("input", () => {
    ignoreHexInputUpdate = true;
    let hex = hexInput.value;

    hexInput.value = hex.toUpperCase();
    if (!isValidHex(hex)) {
        hexInput.style.color = "red";
        return;
    } else {
        hexInput.style.color = ""
    }

    // Convert hex to RGB
    const rgb = hexToRgb(hex);

    if (rgb) {
        // Update marker position
        const [h, s, v] = rgbToHsv(rgb.r, rgb.g, rgb.b);
        const markerX = s * canvasWidth;
        const markerY = (1 - v) * canvasHeight;
        updateMarkerPosition(markerX, markerY);

        // Update hue slider value
        updateHueSlider(h);

        // Update color preview
        if (hex.length === 3) {
            hex = hex.substring(0, 1).repeat(2)
                + hex.substring(1, 2).repeat(2)
                + hex.substring(2, 3).repeat(2)
        }
        parent.style.backgroundColor = hex;
        refreshGradientPreview();

        // Update RGB input values
        redInput.value = String(rgb.r);
        greenInput.value = String(rgb.g);
        blueInput.value = String(rgb.b);
    }
});

function updateHueSlider(hue: number) {
    hueSlider.value = String(hue);
    drawSB(hue);
}

function drawSB(hue: number) {
    // Clear the canvas
    sbContext.clearRect(0, 0, canvasWidth, canvasHeight);

    // Create gradient for saturation and brightness
    const color = hueToRgb(hue);
    const sbGradient = sbContext.createLinearGradient(0, 0, canvasWidth, 0);
    sbGradient.addColorStop(0, "white");
    sbGradient.addColorStop(1, '#' + rgbToHex(color.r, color.g, color.b));

    sbContext.fillStyle = sbGradient;
    sbContext.fillRect(0, 0, canvasWidth, canvasHeight);

    // Create gradient for transparency (top to bottom)
    const alphaGradient = sbContext.createLinearGradient(0, 0, 0, canvasHeight);
    alphaGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    alphaGradient.addColorStop(1, "rgba(0, 0, 0, 1)");

    sbContext.fillStyle = alphaGradient;
    sbContext.fillRect(0, 0, canvasWidth, canvasHeight);
}

function updateMarkerPosition(x: number, y: number) {
    const markerX = Math.max(0, Math.min(x, canvasWidth));
    const markerY = Math.max(0, Math.min(y, canvasHeight));

    sbMarker.style.left = markerX - markerSize / 2 + "px";
    sbMarker.style.top = markerY - markerSize / 2 + "px";

    const saturation = markerX / canvasWidth;
    const brightness = 1 - markerY / canvasHeight;

    const hue = Number(hueSlider.value);

    const rgb = hsvToRgb(hue, saturation, brightness);
    rgb.r = Math.floor(rgb.r);
    rgb.g = Math.floor(rgb.g);
    rgb.b = Math.floor(rgb.b);

    const color = "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";
    parent.style.backgroundColor = color;
    refreshGradientPreview();

    markerPosition = {
        x: markerX,
        y: markerY
    };

    // Update input fields
    const rgbColor = hsvToRgb(hue, saturation, brightness);
    const hex = rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b);
    updateInputsFromColor(rgbColor, hex);
}

sbCanvas.addEventListener("mousedown", (event) => {
    const handleMove = (event: MouseEvent) => {
        const rect = sbCanvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        updateMarkerPosition(mouseX, mouseY);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", handleMove);
    });

    const initialX = event.offsetX;
    const initialY = event.offsetY;
    updateMarkerPosition(initialX, initialY);
});

hueSlider.addEventListener("input", () => {
    const hue = Number(hueSlider.value);
    const { x, y } = markerPosition; // Store marker position

    drawSB(hue);
    updateMarkerPosition(x, y); // Restore marker position

    // Get the current color values
    const rgbColor = hsvToRgb(hue, markerPosition.x / canvasWidth, 1 - markerPosition.y / canvasHeight);
    const hex = rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b);
    updateInputsFromColor(rgbColor, hex);
});

export function setParent(pParent: HTMLDivElement) {
    parent = pParent;

    const color = parent.style.background;
    const rgb = color.substring(color.indexOf("(") + 1, color.indexOf(")")).split(", ");

    redInput.value = rgb[0];
    greenInput.value = rgb[1];
    blueInput.value = rgb[2];

    updateColor(true);
}

// Display the hue circle on the hue slider
hueSliderContainer.style.backgroundImage = "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)";

drawSB(0);
updateMarkerPosition(markerPosition.x, markerPosition.y);
