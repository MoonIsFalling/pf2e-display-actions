import { AbilityString } from "@actor/data/base";
import {
    BasePhysicalItemData,
    BasePhysicalItemSource,
    MagicItemSystemData,
    PhysicalItemTraits,
} from "@item/physical/data";
import { DamageType } from "@module/damage-calculation";
import type { LocalizePF2e } from "@module/system/localize";
import { ZeroToFour } from "@module/data";
import type { WeaponPF2e } from ".";
export declare type WeaponSource = BasePhysicalItemSource<"weapon", WeaponSystemData>;
export declare class WeaponData extends BasePhysicalItemData<WeaponPF2e> {
    /** @override */
    static DEFAULT_ICON: ImagePath;
}
export interface WeaponData extends Omit<WeaponSource, "_id" | "effects"> {
    type: WeaponSource["type"];
    data: WeaponSource["data"];
    readonly _source: WeaponSource;
}
export declare type WeaponTrait = keyof ConfigPF2e["PF2E"]["weaponTraits"];
declare type WeaponTraits = PhysicalItemTraits<WeaponTrait>;
export declare type WeaponCategory = keyof ConfigPF2e["PF2E"]["weaponCategories"];
export declare type WeaponGroup = keyof ConfigPF2e["PF2E"]["weaponGroups"];
export declare type BaseWeaponType = keyof typeof LocalizePF2e.translations.PF2E.Weapon.Base;
export interface WeaponDamage {
    value: string;
    dice: number;
    die: string;
    damageType: DamageType;
    modifier: number;
}
export declare type StrikingRuneType = "striking" | "greaterStriking" | "majorStriking";
interface WeaponSystemData extends MagicItemSystemData {
    traits: WeaponTraits;
    weaponType: {
        value: WeaponCategory | null;
    };
    group: {
        value: WeaponGroup | null;
    };
    baseItem: BaseWeaponType | null;
    hands: {
        value: boolean;
    };
    bonus: {
        value: number;
    };
    damage: WeaponDamage;
    bonusDamage?: {
        value: string;
    };
    splashDamage?: {
        value: string;
    };
    range: {
        value: string;
    };
    reload: {
        value: string;
    };
    ability: {
        value: AbilityString;
    };
    MAP: {
        value: string;
    };
    potencyRune: {
        value: ZeroToFour;
    };
    strikingRune: {
        value: StrikingRuneType | "";
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
    property1: {
        value: string;
        dice: number;
        die: string;
        damageType: string;
        critDice: number;
        critDie: string;
        critDamage: string;
        critDamageType: string;
    };
    selectedAmmoId?: string;
}
export {};
