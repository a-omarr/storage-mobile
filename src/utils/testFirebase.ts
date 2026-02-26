import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export async function testFirestoreConnection() {
    try {
        console.log('Testing Firestore connection...');
        const testCol = collection(db, 'test_connection');
        
        // Try writing
        const docRef = await addDoc(testCol, {
            test: true,
            timestamp: new Date()
        });
        console.log('Write successful! Doc ID:', docRef.id);
        
        // Try reading
        const snapshot = await getDocs(testCol);
        console.log(`Read successful! Found ${snapshot.size} documents.`);
        
        return { success: true, message: 'Firestore is fully connected! (Read/Write OK)' };
    } catch (error: any) {
        console.error('Firestore connection test failed:', error);
        return { success: false, message: `Failed: ${error.message}` };
    }
}
