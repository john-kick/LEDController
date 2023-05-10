export interface RGB {
	r: number,
	g: number,
	b: number
}

export function getPosition(str: string, substr: string, index: number) {
	return str.split(substr, index).join(substr).length;
}

export function hueToRgb(h: number): RGB {
	return hsvToRgb(h, 1, 1);
}

export function hsvToRgb(h: number, s: number, v: number): RGB {
	if (h < 0 || h > 360) throw new Error("Hue (h) must be between 0 and 360. Actual: " + h);
	if (s < 0 || s > 1) throw new Error("Saturation (s) must be between 0 and 1. Actual: " + s);
	if (v < 0 || s > 1) throw new Error("Brightness (v) must be between 0 and 1. Actual: " + v);

	if (s === 0) return {
		r: v * 255,
		g: v * 255,
		b: v * 255
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

export function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}