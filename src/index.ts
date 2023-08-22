/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-08-20 21:30:11
 * @FilePath     : /src/index.ts
 * @LastEditTime : 2023-08-22 11:44:56
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

const DATA_TIME_LOGGER = "time-log.json";

export default class PluginSample extends Plugin {

    isMobile: boolean;

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

        // set default storage
        let data_time_logger = await this.loadData(DATA_TIME_LOGGER);
        this.data[DATA_TIME_LOGGER] = data_time_logger || [];

        eventBus.on("on-session-stop", (event: CustomEvent<TimeLogSession>) => {
            let session = event.detail;
            let timelog: ITimeLog = session.export();
            this.data[DATA_TIME_LOGGER].push(timelog);
            this.saveData(DATA_TIME_LOGGER, this.data[DATA_TIME_LOGGER]);
        });

    }
    onunload() {
        this.saveData(DATA_TIME_LOGGER, this.data[DATA_TIME_LOGGER]);
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
