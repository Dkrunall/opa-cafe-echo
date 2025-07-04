
export interface StoredFeedback {
  data: any[];
  expiry: number;
}

const FEEDBACK_STORAGE_KEY = 'feedback_data';
const EXPIRY_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export const saveFeedbackToStorage = (feedback: any[]) => {
  const now = new Date().getTime();
  const expiry = now + EXPIRY_DURATION;
  
  const storedData: StoredFeedback = {
    data: feedback,
    expiry: expiry
  };
  
  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(storedData));
};

export const loadFeedbackFromStorage = (): any[] => {
  try {
    const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!stored) return [];
    
    const parsedData: StoredFeedback = JSON.parse(stored);
    const now = new Date().getTime();
    
    // Check if data has expired
    if (now > parsedData.expiry) {
      localStorage.removeItem(FEEDBACK_STORAGE_KEY);
      return [];
    }
    
    return parsedData.data || [];
  } catch (error) {
    console.error('Error loading feedback from storage:', error);
    return [];
  }
};

export const clearExpiredFeedback = () => {
  const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
  if (!stored) return;
  
  try {
    const parsedData: StoredFeedback = JSON.parse(stored);
    const now = new Date().getTime();
    
    if (now > parsedData.expiry) {
      localStorage.removeItem(FEEDBACK_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error checking feedback expiry:', error);
  }
};
