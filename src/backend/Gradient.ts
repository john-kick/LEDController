import { RGB, getPosition } from "./util";
import { getGradient } from "./gradientManager";

interface RawColor {
    color: string,
    position: string
}

export interface ColorStep {
    position: number,
    color: RGB
}

export default class Gradient {
    colors: ColorStep[] = [];
    name: string | undefined;

    public async get(name?: string) {
        if (!name) {
            this.colors = [
                {
                    position: 0,
                    color: {
                        r: 255,
                        g: 0,
                        b: 255
                    }
                },
                {
                    position: 50,
                    color: {
                        r: 0,
                        g: 0,
                        b: 255
                    }
                },
                {
                    position: 100,
                    color: {
                        r: 0,
                        g: 0,
                        b: 255
                    }
                }
            ];
            this.name = "--default--";
        } else {
            let gradString = await getGradient(name);
            if (!gradString) {
                throw new Error("No such gradient.");
            }

            gradString = gradString.replace(/\s/g, "");
            const rawColors = gradString.substring(gradString.indexOf(":") + 1);
            const colorsArray = JSON.parse(rawColors);

            this.colors = colorsArray.map((color: RawColor) => {
                const colorStr = color.color;
                const [r, g, b] = colorStr.substring(colorStr.indexOf("(") + 1, colorStr.indexOf(")")).split(",");

                return {
                    position: Number(color.position),
                    color: {
                        r: Number(r),
                        g: Number(g),
                        b: Number(b)
                    }
                };
            });

            this.name = name;
        }
    }

    public build(colors: ColorStep[]) {
        this.colors = colors;
        this.name = "--generated--";
    }

    public toString() {
        let str = "{";
        this.colors.forEach((step) => {
            str += step.position + ":[";
            str += step.color.r + "," + step.color.g + "," + step.color.b;
            str += "],";
        });
        return str + "}";
    }

    public addColor(rP: number, gP: number, bP: number, pos: number) {
        this.colors.push({
            position: pos,
            color: {
                r: rP,
                g: gP,
                b: bP
            }
        });
    }

    public getColorAtPos(pos: number) {
        // Get prev and next color stop of i
        if (pos < 1 || pos > 100) throw new Error("pos needs to be between 1 and 100. Actual: " + pos);
        if (this.colors.length < 1) { throw new Error("Gradient has no colors"); }

        let i;
        for (i = 0; i < this.colors.length; i++) {
            if (this.colors[i].position >= pos) break;
        }
        if (this.colors[i].position === pos) return this.colors[i].color;
        const curr = this.colors[i];
        const prev = this.colors[i - 1];
        const relPos = (pos - prev.position) / (curr.position - prev.position);
        return this.lerp(curr.color, prev.color, relPos);
    }

    public static getColorAtPos(colors: RGB[], pos: number) {

    }

    public static getDefaultGradient() {
        const grad = new Gradient();
    }

    private lerp(col1: RGB, col2: RGB, i: number): RGB {
        if (i < 0 || i > 1) throw new Error("i needs to be between 0 and 1. Actual: " + i);
        const arr = [
            [col1.r, col2.r],
            [col1.g, col2.g],
            [col1.b, col2.b]
        ].map(([a, b]) => {
            return Math.floor((((a / 255) - (b / 255)) * i + (b / 255)) * 255);
        });
        return { r: arr[0], g: arr[1], b: arr[2] };
    }

    public getName() {
        return this.name;
    }

    public getColors() {
        return this.colors;
    }
}
