import Strip from "../Strip";

export default class BaseAnimation {
    strip: Strip;
    isAnimated: boolean = false;
    isRefreshable: boolean = false;
    usesGradient: boolean = false;

    public constructor() {
        this.strip = new Strip(288);
    }

    public initialize(_params?: any[]): void {
        this.strip.clear();
    }

    public refresh(_params?: any[]): void {
        // noop
    }

    public step(_params?: any[]): void {
        // noop
    }
}