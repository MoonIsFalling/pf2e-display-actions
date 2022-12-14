import {
    ActorSystemData,
    BaseActorDataPF2e,
    BaseActorSourcePF2e,
    BaseTraitsData,
} from "@actor/data/base";
import { HazardPF2e } from ".";
/** The stored source data of a hazard actor */
export declare type HazardSource = BaseActorSourcePF2e<"hazard", HazardSystemData>;
export declare class HazardData extends BaseActorDataPF2e<HazardPF2e> {
    static DEFAULT_ICON: ImagePath;
}
/** Wrapper type for hazard-specific data. */
export interface HazardData extends Omit<HazardSource, "effects" | "items" | "token"> {
    type: HazardSource["type"];
    data: HazardSource["data"];
    readonly _source: HazardSource;
}
interface HazardAttributes {
    ac: {
        value: number;
    };
    hasHealth: boolean;
    hp: {
        value: number;
        max: number;
        temp: number;
        details: string;
    };
    hardness: number;
    stealth: {
        value: number;
        details: string;
    };
}
/** The raw information contained within the actor data object for hazards. */
export interface HazardSystemData extends ActorSystemData {
    attributes: HazardAttributes;
    /** Traits, languages, and other information. */
    traits: BaseTraitsData;
    [key: string]: any;
}
export {};
