
import React, { createContext, useState, useContext, ReactNode } from "react";
import { THANK_YOU_MESSAGES } from "@/lib/constants";

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

// Sample data for demonstration
const initialFeedback: Feedback[] = [
  {
    id: "1",
    rating: 5,
    emojiReaction: "loved",
    category: "food",
    message: "The Greek salad was amazing! Perfect balance of flavors.",
    name: "Maria K.",
    isAnonymous: false,
    createdAt: "2023-05-10T15:30:00Z"
  },
  {
    id: "2",
    rating: 4,
    emojiReaction: "enjoyed",
    category: "drinks",
    message: "Great wine selection, but I'd love to see more craft beers.",
    isAnonymous: true,
    createdAt: "2023-05-09T18:45:00Z"
  },
  {
    id: "3",
    rating: 3,
    emojiReaction: "neutral",
    category: "service",
    message: "The waiter was friendly but the service was a bit slow on a busy Friday night.",
    name: "Alex T.",
    email: "alex@example.com",
    isAnonymous: false,
    createdAt: "2023-05-08T20:15:00Z"
  }
];

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [feedback, setFeedback] = useState<Feedback[]>(initialFeedback);
  const [currentFeedback, setCurrentFeedback] = useState<Partial<Feedback>>({});
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const addFeedback = (newFeedback: Feedback) => {
    setFeedback([newFeedback, ...feedback]);
  };

  const getRandomThankYouMessage = () => {
    const randomIndex = Math.floor(Math.random() * THANK_YOU_MESSAGES.length);
    return THANK_YOU_MESSAGES[randomIndex];
  };

  const loginAdmin = (email: string, password: string) => {
    // This is a simple mock implementation
    // In a real app, this would validate against a secure backend
    if (email === "admin@opacafe.com" && password === "admin123") {
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
