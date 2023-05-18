import { Animator } from "./Animator";

export function handleCommand(command: string, animator: Animator) {
    const components: string[] = command.split(" ");
    console.log(components);
    switch (components[0]) {
        case "animation":
            const animationName = components[1];
            const params = components.splice(2);

            animator.switchAnimation(animationName, params);
    }
}