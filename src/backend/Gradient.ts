import { RGB } from "./util";

interface ColorStep {
    position: number,
    color: RGB
}

export default class Gradient {
    colors: ColorStep[] = [];

    constructor(col1: RGB, col2: RGB) {
        this.colors = [
            {
                position: 1,
                color: col1
            },
            {
                position: 100,
                color: col2
            }
        ]
    }

    public addColor(pos: number, r: number, g: number, b: number) {
        if (pos < 1 || pos > 100) throw new Error("pos needs to be between 1 and 100. Actual: " + pos);
        this.colors.forEach((step) => {
            if (step.position === pos) throw new Error("There is already a color defined for position " + pos);
        })

        this.colors.push({ position: pos, color: { r, g, b } });
        this.colors.sort((a, b) => a.position - b.position);
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
