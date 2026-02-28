import { SECTION_MAP } from '../constants/sections';
import type { SectionKey } from '../types/product';

/**
 * Returns which inventory a given section belongs to (1 or 2)
 */
export function getSectionInventory(sectionKey: SectionKey): 1 | 2 {
    const config = SECTION_MAP[sectionKey as keyof typeof SECTION_MAP];
    return config?.inventory || 1;
}

/**
 * Splits a sections array into inventory 1 and inventory 2 groups
 */
export function splitSectionsByInventory(sections: SectionKey[]): {
    inventory1: SectionKey[];
    inventory2: SectionKey[];
} {
    return {
        inventory1: sections.filter(s => getSectionInventory(s) === 1),
        inventory2: sections.filter(s => getSectionInventory(s) === 2),
    };
}
