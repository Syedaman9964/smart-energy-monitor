import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { addToast } = useToast();

  const [user, setUser] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial session restoration on page load
  const checkAuth = useCallback(async () => {
    try {
      const data = await authService.getMe();
      if (data && data.user) {
        setUser(data.user);
        setSessionInfo(data.session);
      } else {
        setUser(null);
        setSessionInfo(null);
      }
    } catch (err) {
      setUser(null);
      setSessionInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Administrator Login Action
   */
  const login = async (username, password, rememberMe = false) => {
    try {
      const result = await authService.login(username, password, rememberMe);
      if (result.success && result.user) {
        setUser(result.user);
        setSessionInfo(result.session);

        addToast({
          type: 'success',
          title: 'Gateway Access Granted',
          message: `Authenticated as ${result.user.name} (${result.user.role}).`
        });

        return { success: true, user: result.user };
      }
      throw new Error('Authentication response invalid.');
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Authentication Denied',
        message: err.message || 'Invalid username or password.'
      });
      throw err;
    }
  };

  /**
   * User Logout Action
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Ignored
    } finally {
      setUser(null);
      setSessionInfo(null);
      addToast({
        type: 'info',
        title: 'Session Terminated',
        message: 'You have been safely signed out of WattVision.'
      });
    }
  };

  /**
   * Change Password Action
   */
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await authService.changePassword(currentPassword, newPassword);
      addToast({
        type: 'success',
        title: 'Security Updated',
        message: 'Your account password has been changed successfully.'
      });
      return res;
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not change password.'
      });
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionInfo,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        changePassword,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export default AuthContext;
