import BaseAnimation from './BaseAnimation';

export default class Fill extends BaseAnimation {
    public initialize(params: any[]): void {
        this.strip.fill({ r: params[0], g: params[1], b: params[2] });
    }
}