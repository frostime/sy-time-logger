/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-08-27 14:42:09
 * @FilePath     : /src/global.d.ts
 * @LastEditTime : 2023-09-09 18:25:56
 * @Description  : 
 */
declare type Item = import("svelte-dnd-action").Item;
declare type DndEvent<ItemType = Item> = import("svelte-dnd-action").DndEvent<ItemType>;
declare namespace svelte.JSX {
    interface HTMLAttributes<T> {
        onconsider?: (event: CustomEvent<DndEvent<ItemType>> & {target: EventTarget & T}) => void;
        onfinalize?: (event: CustomEvent<DndEvent<ItemType>> & {target: EventTarget & T}) => void;
    }
}

interface IWeek {
    index?: number;
    start: Date;
    end: Date;
}

type TSecond = number;
type TMiliSecond = number;
type TYear = number;
type TMonth = number;
type TDateStr = string; //yyyy-mm-dd
interface ILogHistory {
    [key: TDateStr]: ITimeLog[];
}
