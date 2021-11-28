//Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";       //todo
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import firebase from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDj6wX_eMei9nSQVbGR0ALPAur8PR1boi8",
  authDomain: "chatter-29d38.firebaseapp.com",
  projectId: "chatter-29d38",
  storageBucket: "chatter-29d38.appspot.com",
  messagingSenderId: "593980385500",
  appId: "1:593980385500:web:eb72dde82a8fafb654ec19"
};

// Initialize Firebase                                              //todo
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export {app,db,storage};