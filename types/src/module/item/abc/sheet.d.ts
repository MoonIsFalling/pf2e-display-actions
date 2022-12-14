/// <reference types="jquery" />
/// <reference types="tooltipster" />
import { AbilityString } from "@actor/data";
import { AncestryPF2e, BackgroundPF2e, ClassPF2e } from "@item/index";
import { ItemSheetPF2e } from "../sheet/base";
import { ABCSheetData } from "../sheet/data-types";
declare type ABCItem = AncestryPF2e | BackgroundPF2e | ClassPF2e;
export declare abstract class ABCSheetPF2e<TItem extends ABCItem> extends ItemSheetPF2e<TItem> {
    static get defaultOptions(): {
        scrollY: string[];
        dragDrop: {
            dropSelector: string;
        }[];
        classes: string[];
        template: string;
        viewPermission: number;
        editable?: boolean | undefined;
        closeOnSubmit?: boolean | undefined;
        submitOnClose?: boolean | undefined;
        submitOnChange?: boolean | undefined;
        baseApplication?: string | undefined;
        width?: string | number | undefined;
        height?: string | number | undefined;
        top?: number | undefined;
        left?: number | undefined;
        popOut?: boolean | undefined;
        minimizable?: boolean | undefined;
        resizable?: boolean | undefined;
        id?: string | undefined;
        tabs?: TabsOptions[] | undefined;
        title?: string | undefined;
    };
    getData(): ABCSheetData<TItem>;
    protected getLocalizedAbilities(traits: { value: AbilityString[] }): {
        [key: string]: string;
    };
    /** Is the dropped feat or feature valid for the given section? */
    private isValidDrop;
    protected _onDrop(event: ElementDragEvent): Promise<void>;
    private removeItem;
    activateListeners(html: JQuery): void;
}
export {};
