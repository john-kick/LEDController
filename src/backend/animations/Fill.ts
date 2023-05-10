import BaseAnimation from './BaseAnimation';

export default class Fill extends BaseAnimation {
    public initialize(params: any[]): void {
        this.strip.fill(params[0], params[1], params[2]);
    }
}