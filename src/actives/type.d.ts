/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-08-21 18:58:55
 * @FilePath     : /src/actives/type.d.ts
 * @LastEditTime : 2023-08-21 19:05:07
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
    start: TTimestamp;
    end: TTimestamp;
    elapsed: number;
}


interface ITimeLog {
    active: IActive;
    procedure: IInterval[];
    elapsed: number;
    memo: string;
}
