import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import * as authService from "./authService";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    authService.getCurrentUser().then((currentUser) => {
      if (isMounted) {
        setUser(currentUser);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password, rememberMe) => {
    const loggedInUser = await authService.login(email, password, rememberMe);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (fullName, username, email, password) => {
    const newUser = await authService.register(
      fullName,
      username,
      email,
      password
    );
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const requestPasswordReset = async (email) => {
    return authService.requestPasswordReset(email);
  };

  const updateAccount = async (updates) => {
    const updatedUser = await authService.updateAccount(user.id, updates);
    setUser(updatedUser);
    return updatedUser;
  };

  const changePassword = async (currentPassword, newPassword) => {
    return authService.changePassword(user.id, currentPassword, newPassword);
  };

  const getSessionInfo = () => authService.getSessionInfo();

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        requestPasswordReset,
        updateAccount,
        changePassword,
        getSessionInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
