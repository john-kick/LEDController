export interface RGB {
	r: number,
	g: number,
	b: number
}

/**
 * Honestly I have no fucking idea what is done here and what this function is used for...
 */
export function getPosition(
	str: string,
	substr: string,
	index: number
) {
	return str.split(substr, index).join(substr).length;
}

/**
 * The same as hsvToRgb but with s and v set to 1
 * @param h Hue (0 - 360)
 * @returns An RGB Object
 */
export function hueToRgb(h: number): RGB {
	return hsvToRgb(h, 1, 1);
}

/**
 * 
 * @param h Hue (0 - 360)
 * @param s Saturation (0 - 1)
 * @param v Visibility (0 - 1)
 * @returns An RGB Object
 */
export function hsvToRgb(
	h: number,
	s: number,
	v: number
): RGB {
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

/**
 * @param ms The amount of time to wait in milliseconds
 * @returns 
 */
export function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 
 * @param inMin Lower end of the input range
 * @param inMax Upper end of the input range
 * @param outMin Lower end of the output range
 * @param outMax Upper end of the output range
 * @param val The value to map from the input range to the output range. Must be inside the input range
 * @returns The mapped value in the output range
 */
export function mapNumber(
	inMin: number,
	inMax: number,
	outMin: number,
	outMax: number,
	val: number
) {
	if (val < inMin || val > inMax) {
		throw new Error(`val must be inside of the input range ${inMin} - ${inMax}. Actual value: ${val}`);
	}
	return ((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function validate(
	value: number,
	min?: number,
	max?: number
): boolean {
	if (min && value < min || max && value > max) return false;
	return true;
}

/**
 * Contains 10 chars with increasing "density" (white -> black)
 * Can be used to e.g. display noise in the console
 */
export const BlackWhiteCharRepresentation = [" ", ".", ":", "-", "=", "+", "*", "#", "%", "@"];
