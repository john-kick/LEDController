import Effect, { EffectParameters } from './Effect';

interface FillParameters extends EffectParameters {
    red: string,
    green: string,
    blue: string
}

export default class Fill extends Effect {
    public initialize(parameters: FillParameters): void {
        this.strip.fill({ r: Number(parameters.red), g: Number(parameters.green), b: Number(parameters.blue) });
    }
}
