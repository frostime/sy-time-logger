import type { IEventBus } from "./types/index.d.ts";
import { confirm, Dialog } from "siyuan";

export function time2str(time: number) {
    // console.log(time);
    time = Math.round(time);
    let hour = Math.floor(time / 3600);
    let minute = Math.floor((time % 3600) / 60);
    let second = (time % 60);
    let timeArr = [];
    timeArr.push(hour.toString().padStart(2, "0"));
    timeArr.push(minute.toString().padStart(2, "0"));
    timeArr.push(second.toString().padStart(2, "0"));
    return timeArr.join(":");
}

export let eventBus: IEventBus;
export let setEventBus = (bus: IEventBus) => {
    eventBus = bus;
}

export function inputDialog(title: string, text: string = "", placeholder?: string): Promise<string> {
    let inputDom = `
    <div class="b3-form__icon">
        <svg class="b3-form__icon-icon"><use xlink:href="#iconEdit"></use></svg>
        <input
            class="b3-text-field fn__block b3-form__icon-input"
            id="input-text" value="${text}" placeholder="${placeholder || ""}"
        />
    </div>
    `;
    return new Promise<string>((resolve, reject) => {
        confirm(title, inputDom,
            (dialog: Dialog) => {
                let input = dialog.element.querySelector("#input-text") as HTMLInputElement;
                resolve(input.value);
            },
            () => {
                reject();
            }
        );
    });
}

