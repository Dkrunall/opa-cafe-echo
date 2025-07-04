
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { THANK_YOU_MESSAGES } from "@/lib/constants";
import { saveFeedbackToStorage, loadFeedbackFromStorage, clearExpiredFeedback } from "@/lib/localStorage";

export type Feedback = {
  id: string;
  rating: number;
  emojiReaction?: string;
  category?: string;
  message?: string;
  name?: string;
  email?: string;
  isAnonymous: boolean;
  photoUrl?: string;
  createdAt: string;
};

type FeedbackContextType = {
  feedback: Feedback[];
  currentFeedback: Partial<Feedback>;
  setCurrentFeedback: React.Dispatch<React.SetStateAction<Partial<Feedback>>>;
  addFeedback: (feedback: Feedback) => void;
  getRandomThankYouMessage: () => string;
  isAdmin: boolean;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
};

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<Partial<Feedback>>({});
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Load feedback from localStorage on component mount
  useEffect(() => {
    clearExpiredFeedback(); // Clear any expired data first
    const storedFeedback = loadFeedbackFromStorage();
    setFeedback(storedFeedback);
  }, []);

  const addFeedback = (newFeedback: Feedback) => {
    console.log('Adding new feedback:', newFeedback);
    const updatedFeedback = [newFeedback, ...feedback];
    setFeedback(updatedFeedback);
    saveFeedbackToStorage(updatedFeedback);
  };

  const getRandomThankYouMessage = () => {
    const randomIndex = Math.floor(Math.random() * THANK_YOU_MESSAGES.length);
    return THANK_YOU_MESSAGES[randomIndex];
  };

  const loginAdmin = (email: string, password: string) => {
    // This is a simple mock implementation
    // In a real app, this would validate against a secure backend
    if (email === "admin@feedback.com" && password === "admin123") {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  return (
    <FeedbackContext.Provider
      value={{
        feedback,
        currentFeedback,
        setCurrentFeedback,
        addFeedback,
        getRandomThankYouMessage,
        isAdmin,
        loginAdmin,
        logoutAdmin
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
};
