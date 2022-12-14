import { AbilityString } from "@actor/data/base";
import { TrickMagicItemCastData } from "@item/data";
import { ItemLevelData, ItemSystemData, ItemTraits } from "@item/data/base";
import { BaseNonPhysicalItemData, BaseNonPhysicalItemSource } from "@item/data/non-physical";
import { ValuesList, ZeroToTen } from "@module/data";
import type { SpellPF2e } from ".";
export declare type SpellSource = BaseNonPhysicalItemSource<"spell", SpellSystemData>;
export declare class SpellData extends BaseNonPhysicalItemData<SpellPF2e> {
    /** Prepared data */
    isCantrip: boolean;
    isFocusSpell: boolean;
    isRitual: boolean;
    /** @override */
    static DEFAULT_ICON: ImagePath;
}
export interface SpellData extends Omit<SpellSource, "_id" | "effects"> {
    type: SpellSource["type"];
    data: SpellSource["data"];
    readonly _source: SpellSource;
}
export declare type MagicSchool = keyof ConfigPF2e["PF2E"]["magicSchools"];
export declare type SaveType = keyof ConfigPF2e["PF2E"]["saves"];
export declare type SpellTrait = keyof ConfigPF2e["PF2E"]["spellTraits"];
export declare type SpellTraits = ItemTraits<SpellTrait>;
export interface SpellSystemData extends ItemSystemData, ItemLevelData {
    traits: SpellTraits;
    level: {
        value: ZeroToTen;
    };
    spellType: {
        value: string;
    };
    category: {
        value: keyof ConfigPF2e["PF2E"]["spellCategories"];
    };
    traditions: ValuesList<keyof ConfigPF2e["PF2E"]["spellTraditions"]>;
    school: {
        value: MagicSchool;
    };
    components: {
        value: string;
    };
    materials: {
        value: string;
    };
    target: {
        value: string;
    };
    range: {
        value: string;
    };
    area: {
        value: keyof ConfigPF2e["PF2E"]["areaSizes"];
        areaType: keyof ConfigPF2e["PF2E"]["areaTypes"];
    };
    time: {
        value: string;
    };
    duration: {
        value: string;
    };
    damage: {
        value: string;
        applyMod: false;
    };
    damageType: {
        value: string;
    };
    scaling: {
        mode: string;
        formula: string;
    };
    save: {
        basic: string;
        value: SaveType | "";
        dc?: number;
        str?: string;
    };
    sustained: {
        value: false;
    };
    cost: {
        value: string;
    };
    ability: {
        value: AbilityString;
    };
    prepared: {
        value: boolean;
    };
    location: {
        value: string;
    };
    heightenedLevel: {
        value: number;
    };
    hasCounteractCheck: {
        value: boolean;
    };
    isSave?: boolean;
    damageLabel?: string;
    isAttack?: boolean;
    spellLvl?: string;
    properties?: (number | string)[];
    item?: string;
    trickMagicItemData?: TrickMagicItemCastData;
    isSignatureSpell?: boolean;
}
