
export class TimeLogSession implements ITimeLog {
    active: IActive;
    procedure: IInterval[];
    elapsed: number;
    memo: string;

    timer: any;
    currentInterval: IInterval;
    runningElapsed: number;
    runId: string;

    callbacks = [];

    constructor(active: IActive) {
        this.active = active;
        this.procedure = [];
        this.elapsed = 0;
        this.memo = "";
        this.runningElapsed = 0;
        this.callbacks = [];
    }

    addCallback(callback: Function) {
        this.callbacks.push(callback);
    }

    start() {
        // console.log("start");
        let startTime = Date.now();
        let intervale: IInterval = {
            start: startTime,
            end: 0,
            elapsed: 0,
        };
        this.procedure.push(intervale);

        this.currentInterval = intervale;
        this.timer = setInterval(() => {
            let elapsed = Date.now() - this.currentInterval.start;
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
        this.currentInterval.elapsed = endTime - this.currentInterval.start;
        this.elapsed += this.currentInterval.elapsed;
        this.runningElapsed = this.elapsed;
        clearInterval(this.timer);
        this.currentInterval = null;
        // console.log("pause");
    }

    stop() {
        this.pause();
        this.callbacks = [];
    }
}

export class TimeLogSessionHub {
    sessions: { [key: string]: TimeLogSession};

    constructor() {
        this.sessions = {};
    }

    new(active: IActive) {
        let session = new TimeLogSession(active);
        let id = active.id + Date.now();
        this.sessions[id] = session;
        session.runId = id;
        return session;
    }

    del(session: TimeLogSession | string) {
        let id = typeof session === "string" ? session : session.runId;
        this.sessions[id].stop();
        delete this.sessions[id];
    }
}

export let sessionHub = new TimeLogSessionHub();
