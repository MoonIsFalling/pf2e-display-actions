import { ItemSystemData } from "@item/data/base";
import { BaseNonPhysicalItemData, BaseNonPhysicalItemSource } from "@item/data/non-physical";
import { ActionPF2e } from ".";
export declare type ActionType = keyof ConfigPF2e["PF2E"]["actionTypes"];
export declare type ActionSource = BaseNonPhysicalItemSource<"action", ActionSystemData>;
export declare class ActionData extends BaseNonPhysicalItemData<ActionPF2e> {
    /** @override */
    static DEFAULT_ICON: ImagePath;
}
export interface ActionData extends Omit<ActionSource, "_id" | "effects"> {
    type: ActionSource["type"];
    data: ActionSource["data"];
    readonly _source: ActionSource;
}
interface ActionSystemData extends ItemSystemData {
    actionType: {
        value: ActionType;
    };
    actionCategory: {
        value: string;
    };
    weapon: {
        value: string;
    };
    actions: {
        value: string;
    };
    requirements: {
        value: string;
    };
    trigger: {
        value: string;
    };
}
export {};
