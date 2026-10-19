import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import * as authService from "./authService";

// Visitors can use FedoraQuest without creating an account. A guest-shaped
// user keeps optional profile and settings screens safe to render while the
// services correctly avoid persisting data without a Firebase uid.
const GUEST_USER = {
  id: null,
  uid: null,
  fullName: "Guest learner",
  username: "guest",
  email: "",
  role: "student",
  isGuest: true,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(GUEST_USER);
  const [isLoading, setIsLoading] = useState(true);

  // Firebase Authentication is meant to be consumed via a persistent
  // listener rather than a one-shot fetch — it fires immediately with
  // the restored session (or null) on load, then again on every
  // login/logout, so `user` stays correct without AuthProvider polling.
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((currentUser) => {
      setUser(currentUser || GUEST_USER);
      setIsLoading(false);
    });

    return unsubscribe;
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

  const loginWithGoogle = async () => {
    const loggedInUser = await authService.loginWithGoogle();
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = async () => {
    await authService.logout();
    setUser(GUEST_USER);
  };

  const requestPasswordReset = async (email) => {
    return authService.requestPasswordReset(email);
  };

  const resendEmailVerification = () => authService.resendEmailVerification();

  const refreshEmailVerification = async () => {
    const refreshedUser = await authService.refreshEmailVerification();
    setUser(refreshedUser);
    return refreshedUser;
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
        loginWithGoogle,
        logout,
        requestPasswordReset,
        resendEmailVerification,
        refreshEmailVerification,
        updateAccount,
        changePassword,
        getSessionInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
