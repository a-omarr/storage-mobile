import { Timestamp } from 'firebase/firestore';

export type SectionKey = 'A' | 'B' | 'C' | 'D' | 'THE_SIXTH' | 'EYES';

export interface Product {
    id: string;
    sections: SectionKey[];
    type: string;           // e.g. "Bordeaux"
    capacity: string;       // e.g. "750 ML"
    itemNo: string;         // Alternative No, e.g. "264"
    batchNumber: string;    // e.g. "264-006"
    color: string;          // e.g. "Flint"
    finishType: string;     // e.g. "CORK"
    qtyPerLayer: number;    // e.g. 233
    numberOfLayers: number; // e.g. 7
    piecesPerPallet: number;// e.g. 1631
    numberOfPallet: number; // e.g. 1108
    dateOfProduction: Timestamp;
    createdAt: Timestamp;
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'dateOfProduction'> & {
    dateOfProduction: Date | null;
};
