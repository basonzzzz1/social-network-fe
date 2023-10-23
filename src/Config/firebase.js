// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC0Uw60rjPtDFTVXYXlaL0SviVrZn5sD58",
    authDomain: "social-network-38449.firebaseapp.com",
    projectId: "social-network-38449",
    storageBucket: "social-network-38449.appspot.com",
    messagingSenderId: "94117122662",
    appId: "1:94117122662:web:2a142fd548c53a3d9f93a7",
    measurementId: "G-GR73XZJZEW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);