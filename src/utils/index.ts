/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-08-22 14:45:10
 * @FilePath     : /src/utils.ts
 * @LastEditTime : 2023-09-08 09:57:11
 * @Description  : 
 */
import type { IEventBus } from "../types/global.js";
import { confirm, Dialog } from "siyuan";
import I18n from "../i18n/zh_CN.json";


export let i18n: typeof I18n;
export const setI18n = (i18nObj: any) => {
    i18n = i18nObj;
};

/**
 * 将 timestamp 转换为 HH:mm:ss 格式 的字符串
 * @param time timestamp
 * @returns string, HH:mm:ss
 */
export function time2str(time: number) {
    if (time < 0) {
        return "--:--:--";
    }
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

/**
 * 将 Date 转换为 yyyy-MM-dd 格式 的字符串
 * @param date , Date
 * @returns str, yyyy-MM-dd
 */
export function date2str(date: Date): TDateStr {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

/**
 * 将 timestamp 转换为 yyyy-MM-dd 格式 的字符串
 * @param time 
 * @returns 
 */
export function time2datestr(time: number) {
    return date2str(new Date(time));
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

//@ts-ignore
const siyuan = window.siyuan;


export const confirmDialog = (title: string, text: string, confirm?: (ele?: HTMLElement) => void, cancel?: (ele?: HTMLElement) => void) => {
    const dialog = new Dialog({
        title,
        content: `<div class="b3-dialog__content">
    <div class="ft__breakword">${text}</div>
</div>
<div class="b3-dialog__action">
    <button class="b3-button b3-button--cancel">${siyuan.languages.cancel}</button><div class="fn__space"></div>
    <button class="b3-button b3-button--text" id="confirmDialogConfirmBtn">${siyuan.languages.confirm}</button>
</div>`,
        width: "520px",
    });
    const target: HTMLElement = dialog.element.querySelector(".b3-dialog__content>div.ft__breakword");
    const btnsElement = dialog.element.querySelectorAll(".b3-button");
    btnsElement[0].addEventListener("click", () => {
        if (cancel) {
            cancel(target);
        }
        dialog.destroy();
    });
    btnsElement[1].addEventListener("click", () => {
        if (confirm) {
            confirm(target);
        }
        dialog.destroy();
    });
    return dialog;
};

