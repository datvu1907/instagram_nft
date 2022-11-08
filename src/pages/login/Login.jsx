import React from "react";
import { TwitterLoginButton } from "react-social-login-buttons";
import { signInWithTwitter } from "../../firebase";

import { useAuth } from "../../hooks/Auth";
import { useOutlet, Navigate } from "react-router-dom";

import "./Login.css";
const Login = () => {
  const { currentUser } = useAuth();
  const outlet = useOutlet();
  const { login } = useAuth();
  if (currentUser != null) {
    return <Navigate to="/home" replace />;
  }
  return (
    <div className="container">
      <div className="button_click">
        <TwitterLoginButton onClick={() => signInWithTwitter(login)}>
          <span>Log in with Twitter</span>
        </TwitterLoginButton>
        
      </div>
      {outlet}
    </div>
  );
};

export default Login;
