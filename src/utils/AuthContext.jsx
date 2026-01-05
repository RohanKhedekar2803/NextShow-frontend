import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = ({ token, username, userId }) => {
    setToken(token);
    setUsername(username);
    setUserId(userId);
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        userId,
        isAuthenticated: !!token, // only for UI
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
