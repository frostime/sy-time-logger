/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-08-22 20:46:11
 * @FilePath     : /src/components/index.ts
 * @LastEditTime : 2023-08-22 20:56:31
 * @Description  : 
 */
import IconChooser from "./icon-chooser.svelte";
import { Dialog } from "siyuan";


export function chooseIcon() {
    const dialog = new Dialog({
        title: "选择图标",
        content: `<div id="IconChooser" style="width: 100%; height: 100%; margin-left: 8px;"/>`,
        width: "400px",
        height: "400px"
    });
    let ele = dialog.element.querySelector('#IconChooser');
    let comp = new IconChooser({
        target: ele,
    });
    return new Promise((resolve, reject) => {
        comp.$on("choose", ({detail}) => {
            dialog.destroy();
            resolve(detail);
        });
    });
}

