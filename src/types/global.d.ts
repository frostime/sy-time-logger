/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-08-20 21:30:11
 * @FilePath     : /src/types/index.d.ts
 * @LastEditTime : 2023-08-27 13:51:56
 * @Description  : 
 */

/**
 * Frequently used data structures in SiYuan
 */
import { TEventBus } from "siyuan";

type DocumentId = string;
type BlockId = string;
type NotebookId = string;
type PreviousID = BlockId;
type ParentID = BlockId | DocumentId;

type Notebook = {
    id: NotebookId;
    name: string;
    icon: string;
    sort: number;
    closed: boolean;
}

type NotebookConf = {
    name: string;
    closed: boolean;
    refCreateSavePath: string;
    createDocNameTemplate: string;
    dailyNoteSavePath: string;
    dailyNoteTemplatePath: string;
}

type BlockType = "d" | "s" | "h" | "t" | "i" | "p" | "f" | "audio" | "video" | "other";

type BlockSubType = "d1" | "d2" | "s1" | "s2" | "s3" | "t1" | "t2" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "table" | "task" | "toggle" | "latex" | "quote" | "html" | "code" | "footnote" | "cite" | "collection" | "bookmark" | "attachment" | "comment" | "mindmap" | "spreadsheet" | "calendar" | "image" | "audio" | "video" | "other";

type Block = {
    id: BlockId;
    parent_id?: BlockId;
    root_id: DocumentId;
    hash: string;
    box: string;
    path: string;
    hpath: string;
    name: string;
    alias: string;
    memo: string;
    tag: string;
    content: string;
    fcontent?: string;
    markdown: string;
    length: number;
    type: BlockType;
    subtype: BlockSubType;
    /** string of { [key: string]: string } 
     * For instance: "{: custom-type=\"query-code\" id=\"20230613234017-zkw3pr0\" updated=\"20230613234509\"}" 
     */
    ial?: string;
    sort: number;
    created: string;
    updated: string;
}

type doOperation = {
    action: string;
    data: string;
    id: BlockId;
    parentID: BlockId | DocumentId;
    previousID: BlockId;
    retData: null;
}

interface Window {
    siyuan: {
        notebooks: any;
        menus: any;
        dialogs: any;
        blockPanels: any;
        storage: any;
        user: any;
        ws: any;
        languages: any;
    };
}

type TEvents = TEventBus
                | "on-session-stop" // log session 正常结束
                | "on-session-del" // log session 被关闭并删除
                | "open-settings"
                | "load-data"
                | "save-data"
                | "on-active-updated"
                | "open-log-history";

interface IEventBus {
    on(type: TEvents, listener: (event: CustomEvent<any>) => void): void;

    once(type: TEvents, listener: (event: CustomEvent<any>) => void): void;

    off(type: TEvents, listener: (event: CustomEvent<any>) => void): void;

    emit(type: TEvents, detail?: any): boolean;
}
