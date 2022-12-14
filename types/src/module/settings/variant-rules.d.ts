/// <reference types="jquery" />
/// <reference types="tooltipster" />
export declare class VariantRulesSettings extends FormApplication {
    static get defaultOptions(): FormApplicationOptions & {
        title: string;
        id: string;
        template: string;
        width: number;
        height: string;
        closeOnSubmit: boolean;
    };
    getData(): any;
    static registerSettings(): void;
    activateListeners(html: JQuery): void;
    /**
     * Handle button click to reset default settings
     * @param event The initial button click event
     */
    private onResetDefaults;
    protected _onSubmit(
        event: Event,
        options?: OnSubmitFormOptions,
    ): Promise<Record<string, unknown>>;
    protected _updateObject(_event: Event, data: Record<string, unknown>): Promise<void>;
}
