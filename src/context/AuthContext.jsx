import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const DEFAULT_USERS = [
  {
    id: 'usr_manikanta',
    name: 'Gopala Manikanta',
    email: 'gopala.manikanta@edusync.com',
    password: 'student123',
    role: 'Student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_admin',
    name: 'Admin User',
    email: 'admin@edusync.com',
    password: 'admin123',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_rahul',
    name: 'Rahul Sharma',
    email: 'rahul@gmail.com',
    password: 'student123',
    role: 'Student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  }
];

export const AuthProvider = ({ children }) => {
  // Store registered users in Local Storage
  const [users, setUsers] = useState(() => {
    const localUsers = localStorage.getItem('edusync_users');
    if (localUsers) {
      try {
        const parsed = JSON.parse(localUsers);
        // Update admin avatar if old avatar present
        const updatedUsers = parsed.map((u) =>
          u.role === 'Admin' || u.email === 'admin@edusync.com'
            ? { ...u, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }
            : u
        );
        // Ensure Gopala Manikanta exists in stored users
        if (!updatedUsers.some((u) => u.name?.toLowerCase().includes('manikanta'))) {
          const updated = [DEFAULT_USERS[0], ...updatedUsers];
          localStorage.setItem('edusync_users', JSON.stringify(updated));
          return updated;
        }
        localStorage.setItem('edusync_users', JSON.stringify(updatedUsers));
        return updatedUsers;
      } catch (e) {
        console.error('Failed to parse local users', e);
      }
    }
    localStorage.setItem('edusync_users', JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  });

  // Store active session user in Local Storage
  const [user, setUser] = useState(() => {
    const session = localStorage.getItem('edusync_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.role === 'Admin' || parsed.email === 'admin@edusync.com') {
          const updatedAdmin = { ...parsed, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' };
          localStorage.setItem('edusync_session', JSON.stringify(updatedAdmin));
          return updatedAdmin;
        }
        // If session was Rahul or missing Manikanta, upgrade session to Gopala Manikanta
        if (parsed.name === 'Rahul Sharma') {
          const manikantaSession = {
            id: 'usr_manikanta',
            name: 'Gopala Manikanta',
            email: 'gopala.manikanta@edusync.com',
            role: 'Student',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            token: `jwt_token_${Date.now()}`,
            loginTime: new Date().toLocaleString(),
          };
          localStorage.setItem('edusync_session', JSON.stringify(manikantaSession));
          return manikantaSession;
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse active session', e);
      }
    }
    const defaultManikantaSession = {
      id: 'usr_manikanta',
      name: 'Gopala Manikanta',
      email: 'gopala.manikanta@edusync.com',
      role: 'Student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      token: `jwt_token_${Date.now()}`,
      loginTime: new Date().toLocaleString(),
    };
    localStorage.setItem('edusync_session', JSON.stringify(defaultManikantaSession));
    return defaultManikantaSession;
  });

  useEffect(() => {
    localStorage.setItem('edusync_users', JSON.stringify(users));
  }, [users]);

  // Login handler
  const login = async (email, password, rememberMe = false) => {
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      toast.error('Invalid email address or password.');
      return { success: false, error: 'Invalid credentials' };
    }

    const sessionData = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      avatar: foundUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      token: `jwt_token_${Date.now()}`,
      loginTime: new Date().toLocaleString(),
    };

    setUser(sessionData);
    localStorage.setItem('edusync_session', JSON.stringify(sessionData));

    if (rememberMe) {
      localStorage.setItem('edusync_remember_me', email);
    } else {
      localStorage.removeItem('edusync_remember_me');
    }

    toast.success(`Welcome back, ${foundUser.name}!`);
    return { success: true, user: sessionData };
  };

  // Register handler
  const register = async (userData) => {
    const existing = users.find(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase()
    );

    if (existing) {
      toast.error('An account with this email address already exists.');
      return { success: false, error: 'Email already registered' };
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'Student',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('edusync_users', JSON.stringify(updatedUsers));

    const sessionData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
      token: `jwt_token_${Date.now()}`,
      loginTime: new Date().toLocaleString(),
    };

    setUser(sessionData);
    localStorage.setItem('edusync_session', JSON.stringify(sessionData));
    toast.success('Registration successful! Session saved.');
    return { success: true, user: sessionData };
  };

  // Forgot Password handler
  const forgotPassword = async (email) => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      toast.error('No account found with this email address.');
      return { success: false };
    }

    toast.info('Password reset link sent to your email.');
    return { success: true };
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('edusync_session');
    toast.info('Logged out successfully.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        forgotPassword,
        logout,
        users,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
