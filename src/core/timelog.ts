import { date2str, time2datestr } from "@/utils";
import { Plugin } from "siyuan";

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

const INDEX_FILE = "log-index.json";
const LOG_FILE = (year?: number) => {
    year = year ?? (new Date()).getFullYear();
    return `logs/${year}-history.json`;
}
export class TimeLogManager {
    plugin: Plugin;
    logHistory: Map<TDateStr, ITimeLog[]>; // 以日期为 key 的日志, 方便查询
    index: Map<TYear, Map<TMonth, Set<TDateStr>> | undefined>; // logHistory 的索引, 方便查询, undefined 表示存在对应日志, 但是还没有导入

    constructor() {
        this.plugin = null;
        this.logHistory = new Map();
        this.index = new Map();
    }

    async init(plugin: Plugin) {
        console.log("TimeLogManager.init()")
        this.plugin = plugin;
        let thisYear = new Date().getFullYear();
        // plugin.data[DATA_TIME_LOGGER] = this.history;
        let index: {[key: TYear]: any} = (await plugin.loadData(INDEX_FILE)) || {};
        for (let year in index) {
            this.index.set(parseInt(year), undefined);
        }

        //默认只导入今年一年的记录
        let record: ILogHistory = (await plugin.loadData(LOG_FILE(thisYear))) || {};
        for (let datestr in record) {
            this.logHistory.set(datestr, record[datestr]);
            this.updateIndex(datestr);
        }
    }

    private pickHistory(year: TYear, months?: TMonth[]): {[key: TDateStr]: ITimeLog[]} {
        let yearIndex = this.index.get(year);
        if (!yearIndex) {
            return {};
        }
        if (!months) {
            let results = {};
            for (let month of yearIndex.keys()) {
                let set = yearIndex?.get(month);
                if (set === undefined || set.size === 0) {
                    continue;
                }
                for (let datestr of set) {
                    results[datestr] = this.logHistory.get(datestr);
                }
            }
            return results;
        }
        let results = {};
        for (let month of months) {
            let set = yearIndex?.get(month);
            if (set === undefined || set.size === 0) {
                continue;
            }
            for (let datestr of set) {
                results[datestr] = this.logHistory.get(datestr);
            }
        }
        return results;
    }

    /**
     * 根据日期字符串更新索引, 从而方便在 logHistory 中快速查询
     * @param datestr yyyy-mm-dd
     */
    updateIndex(datestr: TDateStr) {
        let date = new Date(datestr);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let yearIndex = this.index.get(year);
        if (!yearIndex) {
            yearIndex = new Map();
            this.index.set(year, yearIndex);
        }
        let monthIndex = yearIndex.get(month);
        if (!monthIndex) {
            monthIndex = new Set();
            yearIndex.set(month, monthIndex);
        }
        monthIndex.add(datestr);
    }

    add(timelog: ITimeLog) {
        let begDate = time2datestr(timelog.beg);
        let dateLog = this.logHistory.get(begDate);
        if (!dateLog) {
            dateLog = [];
            this.logHistory.set(begDate, dateLog);
        }
        dateLog.push(timelog);
        this.updateIndex(begDate);
    }

    async save() {
        //不需要保存完整的 index, 只需要保存的 year 一级, 用来确认存在哪些日志就行了
        let index = {};
        for (let year of this.index.keys()) {
            let monthIndex = this.index.get(year);
            index[year] = monthIndex.keys();
        }
        await this.plugin.saveData(INDEX_FILE, index);
        for (let year of this.index.keys()) {
            let months = this.index.get(year);
            if (months !== undefined) {
                const file = LOG_FILE(year);
                const data = this.pickHistory(year);
                await this.plugin.saveData(file, data);
            }
        }
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

    /**
     * 给定 dates, 自动逆序排序并获取所有的历史记录
     * @param dates 
     * @returns 
     */
    getDateLogs(dates: TDateStr[]) {
        dates = dates.sort((a, b) => a > b ? -1 : a < b ? 1 : 0); //逆序排序
        dates = dates.filter((date: TDateStr) => this.logHistory.has(date));
        return dates.map((date: TDateStr) => {
            let timeLogs = this.logHistory.get(date);
            timeLogs = timeLogs.sort(compareTimelog);
            timeLogs.forEach(timelog => {
                timelog.procedure = timelog.procedure.sort(
                    (a, b) => a.beg > b.beg ? -1 : a.beg < b.beg ? 1 : 0
                );
            });
            return {
                date: new Date(date),
                timeLogs: timeLogs
            };
        });
    }

    queryYearLogs(year: TYear): IDateLog[] {
        let monthIndex = this.index.get(year);
        if (!monthIndex) {
            return [];
        }
        let alldates: TDateStr[] = [];
        monthIndex.forEach((set: Set<TDateStr>) => {
            alldates = [...alldates, ...set];
        });
        return this.getDateLogs(alldates);
    }

    queryMonthLogs(year: TYear, month: TMonth): IDateLog[] {
        let monthIndex = this.index.get(year);
        if (!monthIndex) {
            return [];
        }
        let dateIndex = monthIndex.get(month);
        if (!dateIndex) {
            return [];
        }
        return this.getDateLogs(Array.from(dateIndex));
    }

    queryDateLogs(date: Date) {
        let datestr = date2str(date);
        return this.getDateLogs([datestr]);
    }

    qeuryDurationLogs(start: Date, end: Date): IDateLog[] {
        let allDate = Array.from(this.logHistory.keys());
        let startStr = date2str(start);
        let endStr = date2str(end);
        let dates = allDate.filter(date => date >= startStr && date <= endStr);
        return this.getDateLogs(dates);
    }
}

export let timeLogManager = new TimeLogManager();