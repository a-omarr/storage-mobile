export type SectionKey = 'A' | 'B' | 'C' | 'D' | 'THE_SIXTH' | 'EYES';

export interface Product {
    id: string;
    sections: SectionKey[];
    inventory: 1 | 2;
    type: string;           // e.g. "Bordeaux" (Product Name)
    capacity?: string;      // Optional for Inventory 2
    itemNo?: string;        // Optional for Inventory 2
    batchNumber?: string;   // Optional for Inventory 2
    color?: string;         // Optional for Inventory 2
    finishType?: string;    // Optional for Inventory 2
    qtyPerLayer?: number;   // Optional for Inventory 2
    numberOfLayers?: number;// Optional for Inventory 2
    piecesPerPallet?: number;// Optional for Inventory 2
    numberOfPallet?: number;// Optional for Inventory 2
    dateOfProduction?: string | null; // ISO date string, optional for Inventory 2
    createdAt: string;      // ISO date string
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'dateOfProduction'> & {
    dateOfProduction: Date | null;
};

