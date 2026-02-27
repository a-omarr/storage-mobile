import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyAbSEouytLHx4p0vuz6k8QvC7rKIDCcygk',
    authDomain: 'storageapp-f6795.firebaseapp.com',
    projectId: 'storageapp-f6795',
    storageBucket: 'storageapp-f6795.firebasestorage.app',
    messagingSenderId: '8540461805',
    appId: '1:8540461805:web:bfa43f626f6592acc1cae4',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Enable offline persistence for warehouse use without internet
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        console.warn('Offline persistence: multiple tabs open');
    } else if (err.code === 'unimplemented') {
        console.warn('Offline persistence not supported in this browser');
    }
});
