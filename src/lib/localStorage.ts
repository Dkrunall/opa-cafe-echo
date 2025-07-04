
export interface StoredFeedback {
  data: any[];
  expiry: number;
}

const FEEDBACK_STORAGE_KEY = 'feedback_data';
const EXPIRY_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export const saveFeedbackToStorage = (feedback: any[]) => {
  try {
    const now = new Date().getTime();
    const expiry = now + EXPIRY_DURATION;
    
    const storedData: StoredFeedback = {
      data: feedback,
      expiry: expiry
    };
    
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(storedData));
    console.log('Feedback saved to localStorage:', feedback.length, 'items');
  } catch (error) {
    console.error('Error saving feedback to storage:', error);
  }
};

export const loadFeedbackFromStorage = (): any[] => {
  try {
    const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!stored) {
      console.log('No feedback found in localStorage');
      return [];
    }
    
    const parsedData: StoredFeedback = JSON.parse(stored);
    const now = new Date().getTime();
    
    // Check if data has expired
    if (now > parsedData.expiry) {
      console.log('Feedback data expired, clearing storage');
      localStorage.removeItem(FEEDBACK_STORAGE_KEY);
      return [];
    }
    
    console.log('Feedback loaded from localStorage:', parsedData.data.length, 'items');
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
      console.log('Clearing expired feedback data');
      localStorage.removeItem(FEEDBACK_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error checking feedback expiry:', error);
  }
};
