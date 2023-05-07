// https://dev.to/dayvster/use-react-context-for-auth-288g
// https://blog.devgenius.io/how-to-add-authentication-to-a-react-app-26865ecaca4b

// TokenContext.js
import { createContext, useState, useEffect } from "react";

const TokenContext = createContext({
  token: null,
  setToken: () => {},
});

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export default TokenContext;
