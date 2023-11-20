import Effect from "./Effect";

export default abstract class AnimatedEffect extends Effect {
    public abstract step(): void;
}