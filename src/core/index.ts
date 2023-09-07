import { eventBus, time2datestr } from "@/utils";
import { Plugin } from "siyuan";

class Active implements IActive {

    id: string;
    emoji: {
        type: string;
        code: string;
    };
    title: string;
    isGroup: boolean;
    groupId: string;

    constructor(data: IActive) {
        let timedelta = Date.now() - 1672531200000;
        this.id = data.id ?? `#${timedelta.toString(36).toUpperCase()}`;
        this.emoji = data.emoji;
        this.title = data.title;
        this.isGroup = data.isGroup ?? false;
        this.groupId = data.groupId ?? "";
    }

    dump(): IActive {
        return {
            id: this.id,
            emoji: this.emoji,
            title: this.title,
            isGroup: this.isGroup === true ? true : undefined,
            groupId: this.groupId !== "" ? this.groupId : undefined,
        }
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


const RootGroup = "";
const BackActive: IActive = {
    id: "#Active::GoBack",
    title: "返回",
    emoji: {
        type: "#icon",
        code: "#iconBack",
    },
    isGroup: false,
};

export class ActiveHub {
    static RootGroup = "";
    static SpecialActives = {
        Back: BackActive
    };

    private id2Actives: Map<string, Active>; // ActiveId -> Active
    private group2Actives: Map<string, Active[]>; // GroupId -> Actives, 默认的 root group 为 ""

    constructor() {
        this.id2Actives = new Map();
        this.group2Actives = new Map();
        this.group2Actives.set(RootGroup, []);
    }

    dump(): IActive[] {
        let allGroups = Array.from(this.group2Actives.keys());
        allGroups = allGroups.sort((a, b) => a > b ? 1 : a < b ? -1 : 0);
        let actives: IActive[] = [];
        allGroups.forEach(group => {
            let groupActives = this.group2Actives.get(group);
            groupActives.forEach(active => {
                actives.push(active.dump());
            });
        });
        return actives;
    }

    get(activeId: string): IActive {
        return this.id2Actives.get(activeId).dump();
    }

    allGroups(): IActive[] {
        let allGroups = Array.from(this.group2Actives.keys());
        allGroups.splice(allGroups.indexOf(RootGroup), 1);
        return allGroups.map(group => this.id2Actives.get(group).dump());
    }

    groupActiveCount(group: TActiveGroupID = "") {
        return this.group2Actives.get(group)?.length ?? 0;
    }

    getGroupActives(group: TActiveGroupID = "") {
        let actives = this.group2Actives.get(group);
        if (!actives) {
            return [];
        }
        return actives.map(active => active.dump());
    }

    setGroupActives(actives: IActive[] | Active[], group?: TActiveGroupID) {
        if (!group) {
            // this.rootActives = actives.map(active => active instanceof Active ? active : new Active(active));
            group = RootGroup;
        }
        let activeList: Active[] = actives.map(active => active instanceof Active ? active : new Active(active));
        this.group2Actives.set(group, activeList);
        activeList.forEach(active => {
            active.groupId = group;
            this.id2Actives.set(active.id, active);
        });
        eventBus.emit("on-active-updated");
    }

    add(active: IActive | Active, group?: TActiveGroupID) {
        console.log("Add active", active);
        if (this.id2Actives.has(active.id)) {
            console.error("Active already exists", active);
            return false;
        }

        let item = active instanceof Active ? active : new Active(active);

        this.id2Actives.set(item.id, item);
        group = group ?? RootGroup;
        let groupActives = this.group2Actives.get(group);
        if (!groupActives) {
            groupActives = [];
            this.group2Actives.set(group, groupActives);
        }
        groupActives.push(item);
        item.groupId = group;

        if (item.isGroup) {
            this.group2Actives.set(item.id, []);
        }

        eventBus.emit("on-active-updated");
        return true;
    }

    del(active: IActive) {
        let item = this.id2Actives.get(active.id);
        if (!item) {
            console.error("Active not found", active);
            return false;
        }
        let groupActives = this.group2Actives.get(active.groupId);
        if (!groupActives) {
            console.error("Group not found", active);
            return false;
        }
        this.id2Actives.delete(active.id);
        let index = groupActives.findIndex(item => item.id === active.id);
        if (index < 0) {
            console.error("Active not found in group", active);
            return false;
        }
        groupActives.splice(index, 1);
        eventBus.emit("on-active-updated", item);
        return true;
    }

    update(active: IActive) {
        let item = this.id2Actives.get(active.id);
        if (!item) {
            console.error("Active not found", active);
            return false;
        }
        item.emoji = active.emoji;
        item.title = active.title;
        item.isGroup = active.isGroup ?? false;
        let oldGroupId = item.groupId;
        item.groupId = active.groupId ?? "";

        if (oldGroupId !== item.groupId) {
            let oldGroup = this.group2Actives.get(oldGroupId);
            if (!oldGroup) {
                return false;
            }
            let index = oldGroup.findIndex(item => item.id === active.id);
            if (index < 0) {
                return false;
            }
            oldGroup.splice(index, 1);
            let newGroup = this.group2Actives.get(item.groupId);
            if (!newGroup) {
                this.group2Actives.set(item.groupId, [item]);
            } else {
                newGroup.push(item);
            }
        }
        console.log("ActiveHub: Update active", item);
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

/**从远往前排序 */
const compareTimelog = (a: ITimeLog, b: ITimeLog) => {
    if (a.beg < b.beg) {
        return 1;
    } else if (a.beg > b.beg) {
        return -1;
    } else {
        if (a.end < b.end) {
            return 1;
        } else if (a.end > b.end) {
            return -1;
        } else {
            return 0;
        }
    }
};

const DATA_TIME_LOGGER = "time-log.json";
type TDateStr = string;
interface ILogHistory {
    [key: TDateStr]: ITimeLog[];
}

export class TimeLogManager {
    plugin: Plugin;
    logHistory: Map<TDateStr, ITimeLog[]>; // 以日期为 key 的日志, 方便查询

    constructor() {
        this.plugin = null;
        this.logHistory = new Map();
    }

    async init(plugin: Plugin) {
        this.plugin = plugin;
        // plugin.data[DATA_TIME_LOGGER] = this.history;


        let record: ITimeLog[] | ILogHistory = await plugin.loadData(DATA_TIME_LOGGER);
        //if is ITimelog[]
        if (Array.isArray(record)) {
            console.log("Got old style history storage, converting...")
            for (let i = 0; i < record.length; i++) {
                this.add(record[i]);
            }
        } else {
            for (let datestr in record) {
                this.logHistory.set(datestr, record[datestr]);
            }
        }
    }

    add(timelog: ITimeLog) {
        let begDate = time2datestr(timelog.beg);
        let dateLog = this.logHistory.get(begDate);
        if (!dateLog) {
            dateLog = [];
            this.logHistory.set(begDate, dateLog);
        }
        dateLog.push(timelog);
    }

    save() {
        this.plugin.saveData(DATA_TIME_LOGGER, Object.fromEntries(this.logHistory.entries()));
    }

    allLogs(): IDateLog[] {
        let dateRange = Array.from(this.logHistory.keys());
        dateRange = dateRange.sort((a, b) => a > b ? -1 : a < b ? 1 : 0);
        let dateLogs: IDateLog[] = [];
        dateRange.forEach(datestr => {
            let timeLogs = this.logHistory.get(datestr);
            timeLogs = timeLogs.sort(compareTimelog);
            timeLogs.forEach(timelog => {
                timelog.procedure = timelog.procedure.sort((a, b) => a.beg > b.beg ? -1 : a.beg < b.beg ? 1 : 0);
            });

            let date = new Date(datestr);
            date.setHours(0, 0, 0, 0);
            dateLogs.push({
                date: new Date(date),
                timeLogs: timeLogs,
            });
        });
        return dateLogs;
    }

    queryLogs(startDate?: Date, endDate?: Date): IDateLog[] {
        let start = startDate ? startDate.getTime() : new Date().setHours(0, 0, 0, 0);
        let end = endDate ? endDate.getTime() : new Date().setHours(23, 59, 59, 999);
        let startStr = time2datestr(start);
        let endStr = time2datestr(end);
        let allDate = Array.from(this.logHistory.keys());
        let dateRange = allDate.filter(date => date >= startStr && date <= endStr);
        dateRange = dateRange.sort((a, b) => a > b ? -1 : a < b ? 1 : 0);
        let dateLogs: IDateLog[] = [];
        dateRange.forEach(date => {
            let timeLogs = this.logHistory.get(date);
            timeLogs = timeLogs.sort(compareTimelog);
            timeLogs.forEach(timelog => {
                timelog.procedure = timelog.procedure.sort((a, b) => a.beg > b.beg ? -1 : a.beg < b.beg ? 1 : 0);
            });
            dateLogs.push({
                date: new Date(date),
                timeLogs: timeLogs,
            });
        });
        return dateLogs;
    }
}

export let timeLogManager = new TimeLogManager();
