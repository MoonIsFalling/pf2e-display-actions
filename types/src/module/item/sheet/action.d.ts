import { ActionPF2e } from "@item/action";
import { ItemSheetPF2e } from "./base";
export declare class ActionSheetPF2e extends ItemSheetPF2e<ActionPF2e> {
    getData(): {
        categories: {
            interaction: string;
            defensive: string;
            offensive: string;
        };
        weapons: import("../data").WeaponData[];
        actionTypes: {
            action: string;
            reaction: string;
            free: string;
            passive: string;
        };
        actionsNumber: {
            1: string;
            2: string;
            3: string;
        };
        featTraits: {
            move: string;
            manipulate: string;
            concentrate: string;
            rage: string;
            general: string;
            skill: string;
            fortune: string;
            downtime: string;
            secret: string;
            additive1: string;
            additive2: string;
            additive3: string;
            air: string;
            archetype: string;
            auditory: string;
            dedication: string;
            detection: string;
            emotion: string;
            exploration: string;
            fear: string;
            flourish: string;
            magical: string;
            metamagic: string;
            multiclass: string;
            oath: string;
            open: string;
            press: string;
            stance: string;
            stamina: string;
            alchemical: string;
            interact: string;
            aura: string;
            olfactory: string;
            finisher: string;
            lineage: string;
            vigilante: string;
            heritage: string;
            "versatile heritage": string;
            attack: string;
            cantrip: string;
            composition: string;
            curse: string;
            cursebound: string;
            darkness: string;
            death: string;
            disease: string;
            earth: string;
            extradimensional: string;
            fungus: string;
            healing: string;
            hex: string;
            incapacitation: string;
            inhaled: string;
            light: string;
            linguistic: string;
            litany: string;
            misfortune: string;
            morph: string;
            nonlethal: string;
            plant: string;
            possession: string;
            polymorph: string;
            prediction: string;
            revelation: string;
            scrying: string;
            shadow: string;
            sleep: string;
            teleportation: string;
            visual: string;
            water: string;
            arcane: string;
            divine: string;
            occult: string;
            primal: string;
            alchemist: string;
            barbarian: string;
            bard: string;
            champion: string;
            cleric: string;
            druid: string;
            fighter: string;
            investigator: string;
            monk: string;
            oracle: string;
            ranger: string;
            rogue: string;
            sorcerer: string;
            swashbuckler: string;
            witch: string;
            wizard: string;
            abjuration: string;
            conjuration: string;
            divination: string;
            enchantment: string;
            evocation: string;
            illusion: string;
            necromancy: string;
            transmutation: string;
            aasimar: string;
            aberration: string;
            android: string;
            aphorite: string;
            azarketi: string;
            beastkin: string;
            catfolk: string;
            changeling: string;
            conrasu: string;
            dhampir: string;
            duskwalker: string;
            dwarf: string;
            elf: string;
            fetchling: string;
            fleshwarp: string;
            ganzi: string;
            geniekin: string;
            gnome: string;
            goblin: string;
            grippli: string;
            "half-elf": string;
            halfling: string;
            "half-orc": string;
            human: string;
            hobgoblin: string;
            kitsune: string;
            kobold: string;
            ifrit: string;
            leshy: string;
            lizardfolk: string;
            orc: string;
            oread: string;
            ratfolk: string;
            shoony: string;
            sprite: string;
            strix: string;
            suli: string;
            sylph: string;
            tengu: string;
            tiefling: string;
            undine: string;
        };
        skills: {
            acrobatics: string;
            arcana: string;
            athletics: string;
            crafting: string;
            deception: string;
            diplomacy: string;
            intimidation: string;
            medicine: string;
            nature: string;
            occultism: string;
            performance: string;
            religion: string;
            society: string;
            stealth: string;
            survival: string;
            thievery: string;
            lore: string;
        };
        proficiencies: readonly [
            "PF2E.ProficiencyLevel0",
            "PF2E.ProficiencyLevel1",
            "PF2E.ProficiencyLevel2",
            "PF2E.ProficiencyLevel3",
            "PF2E.ProficiencyLevel4",
        ];
        traits: import("./data-types").SheetOptions;
        user: {
            isGM: boolean;
        };
        enabledRulesUI: boolean;
        activeEffects: import("./data-types").AESheetData;
        item: any;
        data: any;
        cssClass: string;
        editable: boolean;
        document: ActionPF2e;
        limited: boolean;
        options: FormApplicationOptions;
        owner: boolean;
        title: string;
    };
}
