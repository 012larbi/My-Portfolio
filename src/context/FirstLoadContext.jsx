import React, { createContext, useContext, useEffect, useState } from "react";
import LoadingSimple from "../components/LoadingSimple";

const FirstLoadContext = createContext(null);

export const FirstLoadProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasSeenLoading = sessionStorage.getItem("hasSeenLoading");

    if (hasSeenLoading) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("hasSeenLoading", "true");
    }, 2800); // 🔥 même durée que ton loader

    return () => clearTimeout(timer);
  }, []);

  return (
    <FirstLoadContext.Provider value={{ isLoading }}>
      {isLoading ? <LoadingSimple /> : children}
    </FirstLoadContext.Provider>
  );
};

export const useFirstLoad = () => {
  const context = useContext(FirstLoadContext);
  if (!context) {
    throw new Error("useFirstLoad must be used within FirstLoadProvider");
  }
  return context;
};
