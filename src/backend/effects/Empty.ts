import Effect from "./Effect";

export default class Empty extends Effect {
    public initialize(_parameters: Object): void {
        this.strip.fill(({r: 0, g: 0, b: 0}));
    }
}