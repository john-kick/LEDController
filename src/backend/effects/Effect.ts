import Strip from "../Strip";

export interface EffectParameters {}

export default abstract class Effect {
    strip: Strip;
    isAnimated: boolean = false;
    usesGradient: boolean = false;

    public constructor() {
        this.strip = new Strip(288);
    }

    public abstract initialize(parameters: Object): void;
}
