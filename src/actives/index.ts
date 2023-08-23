import { eventBus } from "@/utils";

class Active implements IActive {

    id: string;
    emoji: {
        type: string;
        code: string;
    };
    title: string;
    isGroup: boolean;

    parent?: Active;
    children?: Active[];

    constructor(data: IActive) {
        let timedelta = Date.now() - 1672531200000;
        this.id = data.id ?? `#${timedelta.toString(36).toUpperCase()}`;
        this.emoji = data.emoji;
        this.title = data.title;
        this.isGroup = data.isGroup ?? false;
        this.parent = null;
        this.children = [];
    }

    addChild(active: Active) {
        this.children.push(active);
        active.parent = this;
    }
}

export const PredefinedActives: IActive[] = [
    {
        id: "#001",
        emoji: {
            type: "objects",
            code: "1f4bb",
        },
        title: "学习",
        isGroup: false,
    },
    {
        id: "#002",
        emoji: {
            type: "objects",
            code: "270f",
        },
        title: "写作",
        isGroup: false,
    },
    {
        id: "#003",
        emoji: {
            type: "objects",
            code: "1f914",
        },
        title: "思考",
        isGroup: false,
    },
];

export class ActiveHub {
    rootActives: Active[];
    allActives: Map<string, Active>;

    constructor() {
        this.rootActives = [];
        this.allActives = new Map();
    }

    getActives(root?: IActive) {
        if (!root) {
            return this.rootActives;
        }
        let active = this.allActives.get(root.id);
        if (!active) {
            return [];
        }
        return active.children;
    }

    add(active: IActive | Active) {
        let item = active instanceof Active ? active : new Active(active);
        this.rootActives.push(item);
        this.allActives.set(item.id, item);
        eventBus.emit("on-active-updated");
        return true;
    }

    del(active: IActive) {
        let item = this.allActives.get(active.id);
        if (!item) {
            console.error("Active not found", active);
            return false;
        }
        if (item.parent) {
            let index = item.parent.children.indexOf(item);
            if (index >= 0) {
                item.parent.children.splice(index, 1);
            }
        } else {
            let index = this.rootActives.indexOf(item);
            if (index >= 0) {
                this.rootActives.splice(index, 1);
            }
        }
        this.allActives.delete(active.id);
        eventBus.emit("on-active-updated", item);
        return true;
    }

    update(active: IActive) {
        let item = this.allActives.get(active.id);
        if (!item) {
            console.error("Active not found", active);
            return false;
        }
        item.emoji = active.emoji;
        item.title = active.title;
        item.isGroup = active.isGroup;

        eventBus.emit("on-active-updated", item);

        return true;
    }
}

export let activeHub = new ActiveHub();


export class TimeLogSession implements ITimeLog {
    active: IActive;
    beg: TTimestamp;
    end: TTimestamp;
    elapsed: number;
    procedure: IInterval[];
    memo: string;

    timer: any;
    currentInterval: IInterval;
    runningElapsed: number;
    runId: string;

    status: "running" | "pause" | "stop";

    callbacks = [];

    constructor(active: IActive) {
        this.active = active;
        this.procedure = [];
        this.beg = null;
        this.end = null;
        this.elapsed = 0;
        this.memo = "";
        this.runningElapsed = 0;
        this.callbacks = [];
        this.status = "pause";
    }

    export(): ITimeLog {
        return {
            active: this.active,
            beg: this.beg,
            end: this.end,
            procedure: this.procedure,
            elapsed: this.elapsed,
            memo: this.memo,
        }
    }

    addCallback(callback: Function) {
        this.callbacks.push(callback);
    }

    /**
     * 供 svelte 组件重载, 以方便触发更新
     */
    updateActiveCallback() {

    }

    start() {
        // console.log("start");
        let startTime = Date.now();
        this.beg = startTime;
        let intervale: IInterval = {
            beg: startTime,
            end: 0,
            elapsed: 0,
        };
        this.procedure.push(intervale);

        this.currentInterval = intervale;
        this.timer = setInterval(() => {
            let elapsed = Date.now() - this.currentInterval.beg;
            this.currentInterval.elapsed = elapsed;
            this.runningElapsed = this.elapsed + elapsed;
            // console.log(this.runningElapsed);
            this.callbacks.forEach(callback => {
                callback(this.runningElapsed);
            });
        }, 1000);
    }

    pause() {
        if (!this.currentInterval) return;
        let endTime = Date.now();
        this.currentInterval.end = endTime;
        this.currentInterval.elapsed = endTime - this.currentInterval.beg;
        this.elapsed += this.currentInterval.elapsed;
        this.runningElapsed = this.elapsed;
        clearInterval(this.timer);
        this.currentInterval = null;
        // console.log("pause");
    }

    stop() {
        if (!this.currentInterval) return;
        this.pause();
        this.end = Date.now();
        this.callbacks = [];
    }

    del() {
        if (!this.currentInterval) return;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.currentInterval = null;
        this.callbacks = [];
    }
}

export class TimeLogSessionHub {
    sessions: { [key: string]: TimeLogSession };

    constructor() {
        this.sessions = {};
    }

    new(active: IActive) {
        let session = new TimeLogSession(active);
        let id = `${active.id}#${Date.now()}`;
        this.sessions[id] = session;
        session.runId = id;
        return session;
    }

    del(session: TimeLogSession | string) {
        let id = typeof session === "string" ? session : session.runId;
        delete this.sessions[id];
        console.log("Delete session", session);
    }

    pause() {
        for (let id in this.sessions) {
            this.sessions[id].pause();
        }
    }
}

export let sessionHub = new TimeLogSessionHub();
