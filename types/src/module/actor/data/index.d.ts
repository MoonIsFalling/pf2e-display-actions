import { CreatureType } from "@actor/creature/data";
import type { CharacterData } from "@actor/character/data";
import type { HazardData } from "@actor/hazard/data";
import type { LootData } from "@actor/loot/data";
import type { VehicleData } from "@actor/vehicle/data";
import type { FamiliarData } from "@actor/familiar/data";
import type { NPCData } from "@actor/npc/data";
import { AbilityString } from "./base";
export declare type CreatureData = CharacterData | NPCData | FamiliarData;
export declare type ActorType = CreatureType | "hazard" | "loot" | "vehicle";
export declare type ActorDataPF2e = CreatureData | HazardData | LootData | VehicleData;
export declare type ActorSourcePF2e = ActorDataPF2e["_source"];
export { AbilityString, CharacterData, NPCData, FamiliarData, HazardData, LootData, VehicleData };
