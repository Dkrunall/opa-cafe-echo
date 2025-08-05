
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
    console.log('FeedbackProvider mounting, loading from localStorage...');
    clearExpiredFeedback(); // Clear any expired data first
    const storedFeedback = loadFeedbackFromStorage();
    if (storedFeedback.length > 0) {
      setFeedback(storedFeedback);
      console.log('Loaded feedback from storage:', storedFeedback.length, 'items');
    }
  }, []);

  // Save to localStorage whenever feedback changes
  useEffect(() => {
    if (feedback.length > 0) {
      console.log('Feedback changed, saving to localStorage:', feedback.length, 'items');
      saveFeedbackToStorage(feedback);
    }
  }, [feedback]);

  const addFeedback = async (newFeedback: Feedback) => {
    console.log('Adding new feedback:', newFeedback);
    
    // Save to Google Sheets if URL is provided
    await saveToGoogleSheets(newFeedback);
    
    setFeedback(prevFeedback => {
      const updatedFeedback = [newFeedback, ...prevFeedback];
      console.log('Total feedback after adding:', updatedFeedback.length);
      return updatedFeedback;
    });
  };

  const saveToGoogleSheets = async (feedback: Feedback) => {
    // Replace this URL with your Google Apps Script web app URL
    const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
    
    // Skip if no URL is configured
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      console.log('Google Sheets URL not configured');
      return;
    }

    try {
      const payload = {
        id: feedback.id,
        date: feedback.createdAt,
        rating: feedback.rating,
        category: feedback.category,
        emojiReaction: feedback.emojiReaction,
        message: feedback.message,
        name: feedback.isAnonymous ? 'Anonymous' : feedback.name,
        email: feedback.isAnonymous ? '' : feedback.email,
        submissionType: feedback.isAnonymous ? 'Anonymous' : 'Named'
      };

      console.log('Saving to Google Sheets:', payload);

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Data sent to Google Sheets successfully');
    } catch (error) {
      console.error('Error saving to Google Sheets:', error);
    }
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
      console.log('Admin logged in successfully');
      return true;
    }
    console.log('Admin login failed');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    console.log('Admin logged out');
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
