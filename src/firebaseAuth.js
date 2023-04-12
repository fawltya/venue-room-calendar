import React, { useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";
import { app } from "./firebase";
import * as firebaseui from "firebaseui";

const FirebaseAuth = ({ config }) => {
  const authUIRef = useRef(null);

  useEffect(() => {
    if (!authUIRef.current) {
      authUIRef.current = new firebaseui.auth.AuthUI(getAuth(app));
    }

    const containerElement = document.getElementById(
      "firebaseui-auth-container"
    );
    if (containerElement) {
      authUIRef.current.start("#firebaseui-auth-container", config);
    }

    return () => {
      authUIRef.current.reset();
    };
  }, [config]);

  return <div id="firebaseui-auth-container" />;
};

export default FirebaseAuth;
