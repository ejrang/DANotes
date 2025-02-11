import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"danotes-2e516","appId":"1:535067045578:web:6a7a9c3fafcb434ebf0e33","storageBucket":"danotes-2e516.firebasestorage.app","apiKey":"AIzaSyAQjoACR9YeNmaArlEoS7Z91e9_t7KW-4M","authDomain":"danotes-2e516.firebaseapp.com","messagingSenderId":"535067045578","measurementId":"G-JW5HCDZEBZ"}))),
    importProvidersFrom(provideFirestore(() => getFirestore()))]
};
