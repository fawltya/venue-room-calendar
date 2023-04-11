// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLBpWHQHCZdEXA9BQwueRek0R_K5NwmW4",
  authDomain: "venue-room-calendar.firebaseapp.com",
  projectId: "venue-room-calendar",
  storageBucket: "venue-room-calendar.appspot.com",
  messagingSenderId: "801152282682",
  appId: "1:801152282682:web:365128d696fc52212ac503",
  measurementId: "G-4QN1XFGB2R",
  databaseURL:
    "https://venue-room-calendar-default-rtdb.europe-west1.firebaseio.com",
};

const app = initializeApp(firebaseConfig, "secondary");

const database = getDatabase(app);

export { app, database };
