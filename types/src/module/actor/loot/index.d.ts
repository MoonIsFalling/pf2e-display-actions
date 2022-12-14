import { ActorPF2e } from "@actor/base";
import { PhysicalItemPF2e } from "@item/physical";
import { ItemPF2e } from "@item/base";
import { UserPF2e } from "@module/user";
import { LootData, LootSource } from "./data";
import { ActiveEffectPF2e } from "@module/active-effect";
import { ItemSourcePF2e } from "@item/data";
export declare class LootPF2e extends ActorPF2e {
    static get schema(): typeof LootData;
    get isLoot(): boolean;
    get isMerchant(): boolean;
    /** Should this actor's token(s) be hidden when there are no items in its inventory? */
    get hiddenWhenEmpty(): boolean;
    /** Anyone with Limited permission can update a loot actor */
    canUserModify(user: UserPF2e, action: UserAction): boolean;
    /** A user can see a loot actor in the actor directory only if they have at least Observer permission */
    get visible(): boolean;
    transferItemToActor(
        targetActor: ActorPF2e,
        item: Embedded<ItemPF2e>,
        quantity: number,
        containerId?: string,
    ): Promise<Embedded<PhysicalItemPF2e> | null>;
    /** Hide this actor's token(s) when in loot (rather than merchant) mode, empty, and configured thus */
    toggleTokenHiding(): Promise<void>;
    protected _onCreate(
        data: LootSource,
        options: DocumentModificationContext,
        userId: string,
    ): void;
    protected _onUpdate(
        changed: DeepPartial<this["data"]["_source"]>,
        options: DocumentModificationContext,
        userId: string,
    ): void;
    protected _onCreateEmbeddedDocuments(
        embeddedName: "ActiveEffect" | "Item",
        documents: ActiveEffectPF2e[] | ItemPF2e[],
        result: foundry.data.ActiveEffectSource[] | ItemSourcePF2e[],
        options: DocumentModificationContext,
        userId: string,
    ): void;
    protected _onDeleteEmbeddedDocuments(
        embeddedName: "ActiveEffect" | "Item",
        documents: ActiveEffectPF2e[] | ItemPF2e[],
        result: foundry.data.ActiveEffectSource[] | ItemSourcePF2e[],
        options: DocumentModificationContext,
        userId: string,
    ): void;
}
export interface LootPF2e extends ActorPF2e {
    readonly data: LootData;
    getFlag(scope: string, key: string): any;
    getFlag(scope: "core", key: "sourceId"): string | undefined;
    getFlag(scope: "pf2e", key: "editLoot.value"): boolean | undefined;
}
