/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-08-20 21:30:11
 * @FilePath     : /src/index.ts
 * @LastEditTime : 2023-08-24 00:23:01
 * @Description  : 
 */
import {
    Plugin,
    showMessage,
    Menu,
    getFrontend,
    Dialog,
} from "siyuan";
import "@/index.scss";

import TimeLogger from "./components/time-logger/index.svelte";
import ActiveConfig from "./components/active-config.svelte";
import { chooseIcon } from "./components";

import { eventBus, setEventBus, time2str } from "./utils";

import { TimeLogSession, sessionHub, PredefinedActives, activeHub } from "./actives";

const DATA_TIME_LOGGER = "time-log.json";
const DATA_ACTIVES = "actives.json";

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
                text: "Timer Logger",
                timelogger: null as TimeLogger,
            },
            type: 'dock_tab',
            init() {
                this.element.innerHTML = '<div id="TimeLogger"/>';
                this.data.timelogger = new TimeLogger({
                    target: this.element.querySelector('#TimeLogger')
                });
            },
            destroy() {
                // console.log("destroy dock:", DOCK_TYPE);
                this.data.timelogger.$destroy();
                this.data.timelogger = null;
                sessionHub.pause();
            }
        });

        eventBus.on("on-session-stop", (event: CustomEvent<TimeLogSession>) => {
            let session = event.detail;
            let timelog: ITimeLog = session.export();
            if (timelog.elapsed == 0) {
                return;
            }
            showMessage(`活动结束, 共 ${time2str(timelog.elapsed / 1000)}`);
            this.data[DATA_TIME_LOGGER].push(timelog);
            this.saveData(DATA_TIME_LOGGER, this.data[DATA_TIME_LOGGER]);
        });

        const del = (event: CustomEvent<TimeLogSession>) => {
            let session = event.detail;
            sessionHub.del(session);
        }
        eventBus.on("on-session-stop", del);
        eventBus.on("on-session-del", del);
        eventBus.on("open-settings", () => {
            this.openSetting();
        });

        eventBus.on("save-data", (event: CustomEvent<{name: string, data: any}>) => {
            let { name, data } = event.detail;
            this.data[name] = data;
            this.saveData(name, data);
        });
        eventBus.on("load-data", (event: CustomEvent<{name: string, callback: CallableFunction}>) => {
            let { name, callback } = event.detail;
            this.loadData(name).then((data) => {
                this.data[name] = data;
                callback(data);
            });
        });
        eventBus.on("on-active-updated", (e: CustomEvent<IActive>) => {
            let active = e.detail;
            for (let id in sessionHub.sessions) {
                let session = sessionHub.sessions[id];
                if (session.active.id === active.id) {
                    session.active = active;
                    session.updateActiveCallback();
                }
            }
        });

        // set default storage
        let data_time_logger = await this.loadData(DATA_TIME_LOGGER);
        this.data[DATA_TIME_LOGGER] = data_time_logger || [];

        let data_actives = await this.loadData(DATA_ACTIVES);
        this.data[DATA_ACTIVES] = data_actives || PredefinedActives;
        for (let active of this.data[DATA_ACTIVES]) {
            activeHub.add(active);
        }

    }
    onunload() {
        this.saveData(DATA_TIME_LOGGER, this.data[DATA_TIME_LOGGER]);
    }

    openSetting(): void {
        const dialog = new Dialog({
            title: "配置",
            content: `<div id="ActiveConfig" style="height: 100%; margin: 5px;"/>`,
            width: "500px",
            height: "500px"
        });
        let ele = dialog.element.querySelector('#ActiveConfig');
        new ActiveConfig({
            target: ele,
        });
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
