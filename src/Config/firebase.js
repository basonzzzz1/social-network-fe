// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBT3HHX0fHiNy7k-mFYCEd-WJ73wN3XHHc",
    authDomain: "uploadingfile-e1825.firebaseapp.com",
    projectId: "uploadingfile-e1825",
    storageBucket: "uploadingfile-e1825.appspot.com",
    messagingSenderId: "853271689994",
    appId: "1:853271689994:web:502d3cd3c88741da8e98f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);