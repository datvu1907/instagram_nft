// Import the functions you need from the SDKs you need
import React from 'react'
import { auth } from "../firebase";
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logOut } from "../firebase";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);
  const navigate = useNavigate();
  const login = async (data) => {
    setCurrentUser(data);
    navigate("/home");
  };
  const signOut = () => {
    setCurrentUser(null);
    logOut(navigate);
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false);
    });
  }, []);
  const value = useMemo(
    () => ({
      currentUser,
      login,
      signOut,
    }),
    [currentUser]
  );
  if (pending) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  return useContext(AuthContext);
};
