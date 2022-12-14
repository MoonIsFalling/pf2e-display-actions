import {
    BasePhysicalItemData,
    BasePhysicalItemSource,
    MagicItemSystemData,
    PhysicalItemTraits,
} from "@item/physical/data";
import { ZeroToFour } from "@module/data";
import type { LocalizePF2e } from "@module/system/localize";
import type { ArmorPF2e } from ".";
export declare type ArmorSource = BasePhysicalItemSource<"armor", ArmorSystemData>;
export declare class ArmorData extends BasePhysicalItemData<ArmorPF2e> {
    /** @override */
    static DEFAULT_ICON: ImagePath;
}
export interface ArmorData extends Omit<ArmorSource, "_id" | "effects"> {
    type: ArmorSource["type"];
    data: ArmorSource["data"];
    readonly _source: ArmorSource;
}
export declare type ArmorTrait = keyof ConfigPF2e["PF2E"]["armorTraits"];
declare type ArmorTraits = PhysicalItemTraits<ArmorTrait>;
export declare type ArmorCategory = keyof ConfigPF2e["PF2E"]["armorTypes"];
export declare type ArmorGroup = keyof ConfigPF2e["PF2E"]["armorGroups"];
export declare type BaseArmorType = keyof typeof LocalizePF2e.translations.PF2E.Item.Armor.Base;
export declare type ResilientRuneType = "" | "resilient" | "greaterResilient" | "majorResilient";
interface ArmorSystemData extends MagicItemSystemData {
    traits: ArmorTraits;
    armor: {
        value: number;
    };
    armorType: {
        value: ArmorCategory;
    };
    baseItem: BaseArmorType | null;
    group: {
        value: ArmorGroup | null;
    };
    strength: {
        value: number;
    };
    dex: {
        value: number;
    };
    check: {
        value: number;
    };
    speed: {
        value: number;
    };
    potencyRune: {
        value: ZeroToFour;
    };
    resiliencyRune: {
        value: ResilientRuneType | "";
    };
    propertyRune1: {
        value: string;
    };
    propertyRune2: {
        value: string;
    };
    propertyRune3: {
        value: string;
    };
    propertyRune4: {
        value: string;
    };
}
export {};
