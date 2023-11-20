import Empty from "./effects/Empty";
import Effect from "./effects/Effect";
import Fade from "./effects/Fade";
import Fill from "./effects/Fill";
import Noise from "./effects/Noise";
import Rainbow from "./effects/Rainbow";
import ShowGradient from "./effects/ShowGradient";
import Theater from "./effects/Theater";

export default class EffectFactory {
    public static getEffect(name: string): Effect {
        switch (name) {
            case ('empty'):
                return new Empty();
            case ('fade'):
                return new Fade();
            case ('fill'):
                return new Fill();
            case ('noise'):
                return new Noise();
            case ('rainbow'):
                return new Rainbow();
            case ('showGradient'):
                return new ShowGradient();
            case ('theater'):
                return new Theater();
            default:
                throw new Error(`No such effect "${name}"`);
        }
    }
}
