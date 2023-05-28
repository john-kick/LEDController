import Strip from "../Strip";

export default class BaseAnimation {
    strip: Strip;
    isAnimated: boolean = false;
    usesGradient: boolean = false;

    public constructor() {
        this.strip = new Strip(288);
    }

    public initialize(_params?: any[]): void {
        this.strip.clear();
    }

    public refresh(params?: any[]): void {
        // Animation has no refresh function. Initialize again instead
        this.initialize(params);
    }

    public step(_params?: any[]): void {
        // noop
    }
}