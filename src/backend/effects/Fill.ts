import Effect, { EffectParams } from './Effect';

interface FillParams extends EffectParams {
    red: string,
    green: string,
    blue: string
}

export default class Fill extends Effect {
    public initialize(parameters: FillParams): void {
        this.strip.fill({ r: Number(parameters.red), g: Number(parameters.green), b: Number(parameters.blue) });
    }
}
