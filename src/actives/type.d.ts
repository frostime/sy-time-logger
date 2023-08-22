/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-08-21 18:58:55
 * @FilePath     : /src/actives/type.d.ts
 * @LastEditTime : 2023-08-22 11:49:33
 * @Description  : 
 */
interface IActive {
    id?: string;
    emoji: {
        type: string;
        code: string;
    };
    title: string;
    parent?: IActive;
    children?: IActive[];
}

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
