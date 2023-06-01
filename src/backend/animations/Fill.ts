import BaseAnimation from './BaseAnimation';

interface FillParams {
    red: string,
    green: string,
    blue: string
}

export default class Fill extends BaseAnimation {
    public initialize(params: FillParams): void {
        this.strip.fill({ r: Number(params.red), g: Number(params.green), b: Number(params.blue) });
    }
}
