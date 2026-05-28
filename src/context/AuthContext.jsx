import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });
  const [loading] = useState(false);

  // LOGIN
  const login = (employee, jwtToken) => {

    setUser(employee);

    setToken(jwtToken);

    localStorage.setItem(
      "user",
      JSON.stringify(employee)
    );

    localStorage.setItem(
      "token",
      jwtToken
    );
  };

  // LOGOUT
  const logout = () => {

    setUser(null);

    setToken(null);

    localStorage.removeItem("user");

    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);