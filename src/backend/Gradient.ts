import { RGB, getPosition } from "./util";
import { getGradient } from "./gradientManager";

interface ColorStep {
    position: number,
    color: RGB
}

export default class Gradient {
    colors: ColorStep[] = [];

    constructor(name?: string) {
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
        } else {
            this.init(name);
        }
    }

    private async init(name: string) {
        const gradString = await getGradient(name);

        if (!gradString) {
            throw new Error("No such gradient.");
        }

        const data = gradString.substring(gradString.indexOf('[') + 2, getPosition(gradString, ']', 2) - 2).split("},{");
        const colors = data.map((color) => {
            return color.substring(color.indexOf('(') + 1, color.indexOf(')')).split(",");
        });
        const positions = data.map((color) => {
            return color.substring(color.indexOf('position') + 11, color.length - 1);
        });

        for (let i = 0; i < colors.length; i++) {
            this.addColor(Number(colors[i][0]), Number(colors[i][1]), Number(colors[i][2]), Number(positions[i]));
        }
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
}
