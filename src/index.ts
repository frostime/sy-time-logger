/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-08-20 21:30:11
 * @FilePath     : /src/index.ts
 * @LastEditTime : 2023-08-21 20:55:27
 * @Description  : 
 */
import {
    Plugin,
    showMessage,
    Menu,
    getFrontend,
} from "siyuan";
import "@/index.scss";

import { eventBus, setEventBus } from "./utils";

import TimeLogger from "./components/time-logger/index.svelte";
import { TimeLogSession } from "./actives";


export default class PluginSample extends Plugin {

    isMobile: boolean;

    DATA_TIME_LOGGER = "time-log.json";

    async onload() {

        const frontEnd = getFrontend();
        this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile";

        setEventBus(this.eventBus);

        const topBarElement = this.addTopBar({
            icon: "iconFace",
            title: this.i18n.addTopBarIcon,
            position: "right",
            callback: () => {
                if (this.isMobile) {
                    this.addMenu();
                } else {
                    let rect = topBarElement.getBoundingClientRect();
                    // 如果被隐藏，则使用更多按钮
                    if (rect.width === 0) {
                        rect = document.querySelector("#barMore").getBoundingClientRect();
                    }
                    if (rect.width === 0) {
                        rect = document.querySelector("#barPlugins").getBoundingClientRect();
                    }
                    this.addMenu(rect);
                }
            }
        });

        this.addDock({
            config: {
                position: "RightBottom",
                size: { width: 320, height: 0 },
                icon: "iconSettings",
                title: "Timer Logger",
            },
            data: {
                text: "Timer Logger"
            },
            type: 'dock_tab',
            init() {
                this.element.innerHTML = '<div id="TimeLogger"/>';
                new TimeLogger({
                    target: this.element.querySelector('#TimeLogger')
                });
            },
            destroy() {
                // console.log("destroy dock:", DOCK_TYPE);
            }
        });

        eventBus.on("on-session-stop", (event: CustomEvent<TimeLogSession>) => {
            let session = event.detail;
            
        });

    }
    onunload() {
        console.log(this.i18n.byePlugin);
        showMessage("Goodbye SiYuan Plugin");
        console.log("onunload");
    }

    private addMenu(rect?: DOMRect) {
        const menu = new Menu("topBarSample");
        if (this.isMobile) {
            menu.fullscreen();
        } else {
            menu.open({
                x: rect.right,
                y: rect.bottom,
                isLeft: true,
            });
        }
    }
}
