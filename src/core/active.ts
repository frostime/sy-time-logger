import { eventBus } from "@/utils";

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
        title: "Learning",
        isGroup: false,
    },
    {
        id: "#002",
        emoji: {
            type: "objects",
            code: "270f",
        },
        title: "Writing",
        isGroup: false,
    },
    {
        id: "#003",
        emoji: {
            type: "objects",
            code: "1f914",
        },
        title: "Thinking",
        isGroup: false,
    },
];


const RootGroup = "";
const BackActive: IActive = {
    id: "#Active::GoBack",
    title: "back",
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
        return this.id2Actives.get(activeId)?.dump();
    }

    allGroups(): IActive[] {
        let allGroups = Array.from(this.group2Actives.keys());
        allGroups.splice(allGroups.indexOf(RootGroup), 1);
        return allGroups.map(group => this.id2Actives.get(group).dump());
    }

    groupActiveCount(group: TActiveGroupID = "") {
        console.log("groupActiveCount", group)
        return this.group2Actives.get(group)?.length ?? 0;
    }

    getGroupActives(group: TActiveGroupID = "") {
        group = group ?? "";
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

    add(active: IActive | Active) {
        console.log("Add active", active);
        if (this.id2Actives.has(active.id)) {
            console.error("Active already exists", active);
            return false;
        }

        let item = active instanceof Active ? active : new Active(active);

        let group = active?.groupId;
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
        //1. 找到对应的 active 和 group
        let item = this.id2Actives.get(active.id);
        if (!item) {
            console.error("Active not found", active);
            return false;
        }
        let groupId = active.groupId ?? RootGroup;
        let groupActives = this.group2Actives.get(groupId);
        if (!groupActives) {
            console.error("Group not found", active);
            return false;
        }
        //2. 删除
        this.id2Actives.delete(active.id);
        let index = groupActives.findIndex(item => item.id === active.id);
        if (index < 0) {
            console.error("Active not found in group", active);
            return false;
        }
        groupActives.splice(index, 1);
        if (item.isGroup) {
            console.log("删除分组", active);
            this.group2Actives.delete(active.id);
        }
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