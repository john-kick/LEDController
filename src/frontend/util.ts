/**
 * Color stuff
 */
export interface RGB {
	r: number,
	g: number,
	b: number
};

export function componentToHex(c: number) {
	var hex = c.toString(16).toUpperCase();
	return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r: number, g: number, b: number) {
	return componentToHex(Number(r)) + componentToHex(Number(g)) + componentToHex(Number(b));
}

export function hexToRgb(hex: string) {
	let r: number, g: number, b: number;

	if (hex.length === 3) {
		r = parseInt(hex.substring(0, 1).repeat(2), 16);
		g = parseInt(hex.substring(1, 2).repeat(2), 16);
		b = parseInt(hex.substring(2, 3).repeat(2), 16);
	} else {
		r = parseInt(hex.substring(0, 2), 16);
		g = parseInt(hex.substring(2, 4), 16);
		b = parseInt(hex.substring(4, 6), 16);
	}

	return { r, g, b }
}

export function rgbToHsv(r: number, g: number, b: number) {
	const v = Math.max(r, g, b);
	const c = v - Math.min(r, g, b);
	const h = c && (v == r ? (g - b) / c : v == g ? 2 + (b - r) / c : 4 + (r - g) / c);
	return [60 * (h < 0 ? h + 6 : h), v && c / v, v / 255];
}

export function hueToRgb(h: number): RGB {
	return hsvToRgb(h, 1, 1);
}

export function hsvToRgb(h: number, s: number, v: number): RGB {
	if (h < 0 || h > 360) throw new Error("Hue (h) must be between 0 and 360. Actual: " + h);
	if (s < 0 || s > 1) throw new Error("Saturation (s) must be between 0 and 1. Actual: " + s);
	if (v < 0 || s > 1) throw new Error("Brightness (v) must be between 0 and 1. Actual: " + v);

	if (s === 0) {
		return {
			r: Math.floor(v * 255),
			g: Math.floor(v * 255),
			b: Math.floor(v * 255)
		}
	}

	const hI = Math.floor(h / 60);
	const f = h / 60 - hI;
	let p = v * (1 - s);
	let q = v * (1 - s * f);
	let t = v * (1 - s * (1 - f));

	[v, t, p, q] = [v, t, p, q].map(val => { return Math.floor(val * 255); });

	switch (hI) {
		case 0:
		case 6:
			return {
				r: v,
				g: t,
				b: p
			};
		case 1:
			return {
				r: q,
				g: v,
				b: p
			};
		case 2:
			return {
				r: p,
				g: v,
				b: t
			};
		case 3:
			return {
				r: p,
				g: q,
				b: v
			};
		case 4:
			return {
				r: t,
				g: p,
				b: v
			};
		case 5:
			return {
				r: v,
				g: p,
				b: q
			};
		default:
			throw new Error("hI is not a whole number between 0 and 6. Actual: " + hI);
	}
}

export function isValidHex(hex: string) {
	return /^([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(hex);
}

export function post(obj: Object, page: string = "") {
	fetch("/" + page, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(obj),
	});
}