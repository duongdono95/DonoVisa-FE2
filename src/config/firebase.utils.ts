import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { firebaseConfig } from './firebase';
import { initializeApp } from 'firebase/app';

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
console.log(firebaseApp);
// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();

// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({
  prompt: 'select_account ',
});
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
