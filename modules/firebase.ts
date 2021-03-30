import firebase from "firebase";
import firebaseJson from "../firebase.json";

const firebaseConfig = {
  apiKey: "AIzaSyAmlsQbDAEmGjskylPx2dbJf3-K6YOhtZk",
  authDomain: "chocolock-prod.firebaseapp.com",
  projectId: "chocolock-prod",
  storageBucket: "chocolock-prod.appspot.com",
  messagingSenderId: "608665566800",
  appId: "1:608665566800:web:df24fc2c57148490bfdb55",
  measurementId: "G-BLZLTG0P6P",
};

const nodeEnv = process.env.NODE_ENV;
const app = firebase.initializeApp(firebaseConfig);

const analytics = app.analytics();
const firestore = app.firestore();
const functions = app.functions(firebaseJson.region);
const auth = app.auth();

if (nodeEnv === "development") {
  firestore.settings({
    host: `localhost:${firebaseJson.emulators.firestore.port}`,
    ssl: false,
  });
  functions.useEmulator("localhost", firebaseJson.emulators.functions.port);
  auth.useEmulator(`http://localhost:${firebaseJson.emulators.auth.port}`);
}

export { analytics, firestore, functions, auth };
