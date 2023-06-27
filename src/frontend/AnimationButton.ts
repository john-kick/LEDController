export default class AnimationButton extends HTMLButtonElement {
    private command: string;
    private params: AnimationParameter[];

    /**
     * Extends the HTMLButtonElement to easily implement the animation parameters
     * 
     * @param name Will be displayed on browser
     * @param command The identifier of the animation. Needs to match with Animator::animations
     * @param params Parameters of the animation. Will be displayed as sliders in the browser and needs to match the animations parameter interface
     */
    constructor(
        name: string,
        command: string,
        params: AnimationParameter[]
    ) {
        super();
        this.name = name;
        this.command = command;
        this.params = params;

        this.classList.add("primary-button");
        this.textContent = this.name;
    }

    /**
     * @returns The HTML elements of the animation's parameters in an array
     */
    public getParamsHTML() {
        const elements: HTMLElement[] = [];
        this.params.forEach((param) => {
            const id = param.name.toLowerCase();
            const label = document.createElement("label");
            label.setAttribute("for", id);
            label.textContent = param.name;

            const input = document.createElement("input");
            input.id = id;
            input.type = param.type[0];
            input.name = param.name;
            input.classList.add("get-value");

            let value: HTMLInputElement | undefined;
            if (param.type[0] === "range") {
                input.min = param.type[1];
                input.max = param.type[2];
                input.step = param.type[3];
                input.value = param.type[2];
                input.setAttribute("orient", "vertical");
                input.classList.add("slider");

                value = document.createElement("input") as HTMLInputElement;
                value.value = input.value;
                value.type = "text";
                value.classList.add("text-input");
                value.readOnly = true;

                input.addEventListener("input", () => {
                    value!.value = input.value;
                });
            }

            input.addEventListener("input", () => {
                const autoApply = document.getElementById("auto-apply") as HTMLInputElement;
                if (autoApply.checked) {
                    const form = document.getElementById("params-form") as HTMLFormElement;
                    form.requestSubmit();
                }
            });

            const wrapper = document.createElement("div");
            wrapper.classList.add("param");
            wrapper.appendChild(label);
            wrapper.appendChild(input);
            if (value) {
                wrapper.appendChild(value);
            }

            elements.push(wrapper);
        });
        return elements;
    }

    public getName() {
        return this.name;
    }

    public getCommand() {
        return this.command;
    }

    public getParams() {
        return this.params;
    }
}

customElements.define('animation-button', AnimationButton, { extends: 'button' });

export interface AnimationParameter {
    name: string,
    type: string[]
};