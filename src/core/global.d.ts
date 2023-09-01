/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-08-21 18:58:55
 * @FilePath     : /src/core/global.d.ts
 * @LastEditTime : 2023-08-28 22:31:39
 * @Description  : 
 */
type TActiveID = string;
interface IActive {
    id: string;
    emoji: {
        type: string;
        code: string;
    };
    title: string;
    isGroup?: boolean;
    groupId?: TActiveGroupID;
}
type TActiveGroupID = "" | TActiveID;

type TTimestamp = number;

interface IInterval {
    beg: TTimestamp;
    end: TTimestamp;
    elapsed: number;
}


interface ITimeLog {
    active: IActive;
    beg: TTimestamp;  // 开始时间
    end: TTimestamp;  // 结束时间
    elapsed: number;  // 有效的记录, 不算暂停时间, 所以可能会小于 end - beg
    procedure: IInterval[];
    memo: string;
}

interface IDateLog {
    date: Date;
    timeLogs: ITimeLog[];
}
