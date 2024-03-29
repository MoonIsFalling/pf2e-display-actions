declare module foundry {
    module data {
        /**
         * The data schema for a Item document.
         * @see BaseItem
         *
         * @param data Initial data used to construct the data object
         * @param [document] The document to which this data object belongs
         *
         * @property _id          The _id which uniquely identifies this Item document
         * @property name         The name of this Item
         * @property type         An Item subtype which configures the system data model applied
         * @property [img]        An image file path which provides the artwork for this Item
         * @property [data]       The system data object which is defined by the system template.json model
         * @property folder       The _id of a Folder which contains this Item
         * @property [sort]       The numeric sort value which orders this Item relative to its siblings
         * @property [ownership] An object which configures user permissions to this Item
         * @property [flags={}]   An object of optional key/value flags
         */
        interface ItemSource<TType extends string = string, TSystemSource extends object = object> {
            _id: string;
            name: string;
            type: TType;
            img: ImageFilePath;
            system: TSystemSource;
            effects: ActiveEffectSource[];
            folder?: string | null;
            sort: number;
            ownership: Record<string, DocumentOwnershipLevel>;
            flags: documents.ItemFlags;
        }

        interface ItemData<TDocument extends documents.BaseItem>
            extends Omit<ItemSource, "effects">,
                abstract.DocumentData<TDocument> {
            readonly _source: ItemSource;
        }
    }
}
