"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AuthModal from "@/components/AuthModal";

export type User = {
  id: string; // email as id for simplicity
  name: string;
  email: string;
  password?: string; // storing in plaintext local storage (mock only!)
  bookmarks: number[]; // array of location IDs
};

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signUp: (email: string, name: string, password: string) => string | null; // returns error message or null if success
  login: (email: string, password: string) => string | null;
  logout: () => void;
  toggleBookmark: (locationId: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem("LOCAL_DB_USERS");
    const storedCurrentUser = localStorage.getItem("LOCAL_DB_CURRENT_USER");

    if (storedUsers) {
      try { setUsers(JSON.parse(storedUsers)); } catch (e) {}
    }
    if (storedCurrentUser) {
      try { setCurrentUser(JSON.parse(storedCurrentUser)); } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  // Sync to localStorage whenever they change
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("LOCAL_DB_USERS", JSON.stringify(users));
  }, [users, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (currentUser) {
      localStorage.setItem("LOCAL_DB_CURRENT_USER", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("LOCAL_DB_CURRENT_USER");
    }
  }, [currentUser, isLoaded]);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const signUp = (email: string, name: string, password: string) => {
    if (users.some(u => u.email === email)) {
      return "이미 가입된 이메일입니다.";
    }
    if (name.trim().length === 0 || email.trim().length === 0 || password.length === 0) {
      return "모든 정보를 입력해주세요.";
    }

    const newUser: User = {
      id: email,
      email,
      name,
      password,
      bookmarks: []
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser); // Auto login
    closeAuthModal();
    return null;
  };

  const login = (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return "이메일 또는 비밀번호가 틀렸습니다.";
    }
    setCurrentUser(user);
    closeAuthModal();
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const toggleBookmark = (locationId: number) => {
    if (!currentUser) {
      openAuthModal();
      return;
    }

    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      let newBookmarks = [...prevUser.bookmarks];
      if (newBookmarks.includes(locationId)) {
        newBookmarks = newBookmarks.filter(id => id !== locationId);
      } else {
        newBookmarks.push(locationId);
      }

      const updatedUser = { ...prevUser, bookmarks: newBookmarks };

      // Update the user inside the `users` array as well so it persists globally
      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));

      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, isAuthModalOpen, openAuthModal, closeAuthModal, signUp, login, logout, toggleBookmark }}>
      {children}
      {isAuthModalOpen && <AuthModal />}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
