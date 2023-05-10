/**
 * Color stuff
 */

export function componentToHex(c: number) {
	var hex = c.toString(16).toUpperCase();
	return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r: number, g: number, b: number) {
	return "#" + componentToHex(Number(r)) + componentToHex(Number(g)) + componentToHex(Number(b));
}

export function rgb2hsv(r: number, g: number, b: number) {
	const v = Math.max(r, g, b);
	const c = v - Math.min(r, g, b);
	const h = c && (v == r ? (g - b) / c : v == g ? 2 + (b - r) / c : 4 + (r - g) / c);
	return [60 * (h < 0 ? h + 6 : h), v && c / v, v];
}
