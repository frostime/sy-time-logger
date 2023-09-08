/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-08-20 21:30:11
 * @FilePath     : /src/index.ts
 * @LastEditTime : 2023-09-08 12:16:37
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
import HistoryTimelog from "./components/dashboard/history-timelog.svelte";

import { eventBus, setEventBus, time2str, setI18n } from "./utils";

import { TimeLogSession, sessionHub, PredefinedActives, activeHub, timeLogManager, ActiveHub } from "@/core";

const DATA_TIME_LOGGER = "time-log.json";
const DATA_ACTIVES = "actives.json";

export default class PluginSample extends Plugin {

    isMobile: boolean;

    async onload() {

        const frontEnd = getFrontend();
        this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile";

        setEventBus(this.eventBus);
        setI18n(this.i18n);
        ActiveHub.SpecialActives.Back.title = this.i18n.goback;

        this.addIcons(`<symbol id="iconTimeLogger" viewBox="0 0 1024 1024"><path d="M926.25224691 926.25224691h-51.91961494c1.65700898-67.108864-35.07335691-130.90371003-84.78362654-191.38453808-0.27616816-0.27616816-0.27616816-0.55233633-0.55233633-0.82850448-33.41634791-40.32055203-72.35605913-79.26026325-109.91492952-116.2667973-35.34952507-35.07335691-71.52755463-70.97521831-101.07754823-105.77240705 29.27382545-34.79718875 65.45185502-70.69905013 101.07754823-105.77240705 37.55887038-37.00653407 76.4985816-75.94624527 109.91492952-116.2667973 0.27616816-0.27616816 0.55233633-0.55233633 0.8285045-1.10467265 49.71026963-60.48082805 86.16446736-124.27567408 84.78362654-191.10836991H926.25224691c28.72148912 0 51.91961495-23.19812583 51.91961496-51.91961496s-23.19812583-51.91961495-51.91961496-51.91961493H97.74775309c-28.72148912 0-51.64344678 23.19812583-51.64344678 51.91961493S69.02626397 97.74775309 97.74775309 97.74775309h51.64344677c-1.65700898 66.83269584 34.79718875 130.62754187 84.50745838 190.83220174 0.55233633 0.55233633 0.8285045 1.10467265 1.10467266 1.38084082 33.41634791 40.32055203 72.35605913 78.98409508 109.91492952 116.2667973 35.34952507 35.07335691 71.52755463 70.97521831 101.07754823 105.77240705-29.27382545 34.79718875-65.45185502 70.69905013-101.07754823 105.77240705-37.55887038 37.00653407-76.4985816 75.94624527-109.91492952 116.2667973-0.27616816 0.27616816-0.55233633 0.8285045-0.8285045 1.10467265-49.71026963 60.20465988-86.16446736 123.99950592-84.50745837 191.10836991H97.74775309c-28.72148912 0-51.64344678 23.19812583-51.64344678 51.91961496s23.19812583 51.91961495 51.64344678 51.91961493h828.50449382c28.72148912 0 51.91961495-23.19812583 51.91961496-51.91961493S954.97373603 926.25224691 926.25224691 926.25224691zM297.14116794 201.31081482c-28.72148912-38.38737488-45.291579-72.35605913-43.35840186-103.56306173h516.43446784c1.93317715 31.2070026-14.63691274 65.17568685-43.35840186 103.56306173H297.14116794z m120.68548792 131.17987818l-27.61681645-27.61681647H633.51399243l-27.61681646 27.61681647c-32.03550709 31.75933893-64.89951868 64.34718237-94.17334413 97.21119395-28.99765728-32.86401158-61.86166887-65.45185502-93.89717598-97.21119395z m0 359.018614c32.03550709-31.75933893 64.89951868-64.34718237 94.17334414-97.21119395 29.27382545 33.14017975 62.13783703 65.45185502 94.17334414 97.21119395l27.61681645 27.61681647H390.48600757c8.83738127-9.11354943 17.67476253-17.9509307 27.34064829-27.61681647z m-164.04388978 234.74293991c-1.93317715-31.2070026 14.63691274-65.17568685 43.35840186-103.56306173h429.71766412c28.72148912 38.38737488 45.291579 72.35605913 43.35840186 103.56306173h-516.43446784z" p-id="6262"></path></symbol>`);
        this.addIcons(`<symbol id="iconMoveToGroup" viewBox="0 0 1024 1024"><path d="M352 432c0 13.248 5.376 25.248 14.064 33.936l112 112c8.688 8.688 20.688 14.064 33.936 14.064s25.248-5.376 33.936-14.064l112-112a48 48 0 1 0-67.872-67.872L560 428.128V128a48 48 0 1 0-96 0v300.112l-30.064-30.064A48 48 0 0 0 352 432z m668.8 158.784l-127.648-335.056A48 48 0 0 0 848 224H608v96h206.912l91.44 240H752a48 48 0 0 0-48 48v48H320v-48a48 48 0 0 0-48-48H117.648l91.424-240H416v-96H176c-20.8 0-38.496 13.232-45.168 31.712L3.2 590.784c-2.064 5.344-3.2 11.152-3.2 17.216v304a48 48 0 0 0 48 48h928a48 48 0 0 0 48-48V608c0-6.064-1.12-11.872-3.2-17.216z" fill="#218dc5" p-id="6544"></path></symbol>`);

        // const topBarElement = this.addTopBar({
        //     icon: "iconFace",
        //     title: this.i18n.addTopBarIcon,
        //     position: "right",
        //     callback: () => {
        //         if (this.isMobile) {
        //             this.addMenu();
        //         } else {
        //             let rect = topBarElement.getBoundingClientRect();
        //             // 如果被隐藏，则使用更多按钮
        //             if (rect.width === 0) {
        //                 rect = document.querySelector("#barMore").getBoundingClientRect();
        //             }
        //             if (rect.width === 0) {
        //                 rect = document.querySelector("#barPlugins").getBoundingClientRect();
        //             }
        //             this.addMenu(rect);
        //         }
        //     }
        // });

        this.addDock({
            config: {
                position: "RightBottom",
                size: { width: 320, height: 0 },
                icon: "iconTimeLogger",
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
            let txt = this.i18n.msg_session_stop
                        .replace("${title}", session.active.title)
                        .replace("${elapsed}", time2str(timelog.elapsed / 1000));
            showMessage(txt);
            // this.data[DATA_TIME_LOGGER].push(timelog);
            // this.saveData(DATA_TIME_LOGGER, this.data[DATA_TIME_LOGGER]);
            timeLogManager.add(timelog);
            timeLogManager.save();
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
            this.data[DATA_ACTIVES] = activeHub.dump();
            this.saveData(DATA_ACTIVES, this.data[DATA_ACTIVES]);
            console.log("on-active-updated", this.data[DATA_ACTIVES]);

            if (!active) return;
            //更新正在运行的session 的 Active 信息
            for (let id in sessionHub.sessions) {
                let session = sessionHub.sessions[id];
                if (session.active.id === active.id) {
                    session.active = active;
                    session.updateActiveCallback();
                }
            }
        });

        eventBus.on("open-log-history", () => {
            const dialog = new Dialog({
                title: this.i18n.dialog_history,
                content: `<div id="LogHistory" style="height: 100%;"/>`,
                width: "500px",
                height: "500px"
            });
            let ele = dialog.element.querySelector('#LogHistory');
            new HistoryTimelog({
                target: ele,
            });
        });

        // set default storage
        await timeLogManager.init(this);

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
            title: this.i18n.dialog_setting,
            content: `<div id="ActiveConfig" style="height: 100%;"/>`,
            width: "500px",
            height: "600px"
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
