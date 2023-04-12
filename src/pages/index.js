import React from "react";
import { app, EmailAuthProvider } from "../firebase"; // Import EmailAuthProvider from firebase.js
import dynamic from "next/dynamic";

const FirebaseAuthComponent = dynamic(() => import("../firebaseAuth"), {
  ssr: false,
});

const firebaseUIConfig = {
  signInFlow: "popup",
  signInOptions: [
    // List the authentication providers you want to support.
    // For example, GoogleAuthProvider and EmailAuthProvider.
    EmailAuthProvider.PROVIDER_ID, // Use imported EmailAuthProvider
  ],
  signInSuccessUrl: "https://venue-room-calendar-h2nn.vercel.app/calendar/",
  callbacks: {
    signInSuccessWithAuthResult: (authResult) => {
      console.log("Sign in successful:", authResult);
      return false; // Prevents redirect
    },
  },
};

const Index = () => {
  return (
    <div>
      <h1>Welcome to Venue Room Calendar</h1>
      <FirebaseAuthComponent config={firebaseUIConfig} />
    </div>
  );
};

export default Index;
