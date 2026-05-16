import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );
  const [loading, setLoading] = useState(true);



  useEffect(() => {

  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

  setLoading(false);

}, []);

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