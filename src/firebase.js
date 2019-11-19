import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyAuIPJv7wrSCskVU0V18oi0vmTAK9xQPCc",
  authDomain: "favorites-ae543.firebaseapp.com",
  databaseURL: "https://favorites-ae543.firebaseio.com",
  projectId: "favorites-ae543",
  storageBucket: "favorites-ae543.appspot.com",
  messagingSenderId: "50934377817",
  appId: "1:50934377817:web:e20208a028edaa84f17048",
  measurementId: "G-0LVS0L38NG"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const db = firebase.firestore();
