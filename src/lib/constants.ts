
export const FEEDBACK_CATEGORIES = [
  { id: 'food', label: 'Food' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'service', label: 'Service' },
  { id: 'ambience', label: 'Ambience' },
  { id: 'cleanliness', label: 'Cleanliness' },
  { id: 'value', label: 'Value for Money' }
];

export const EMOJI_REACTIONS = [
  { emoji: '😍', label: 'Loved it', value: 'loved' },
  { emoji: '😊', label: 'Enjoyed it', value: 'enjoyed' },
  { emoji: '😐', label: 'It was okay', value: 'neutral' },
  { emoji: '😕', label: 'Needs improvement', value: 'improvement' },
  { emoji: '😞', label: 'Disappointed', value: 'disappointed' }
];

export const THANK_YOU_MESSAGES = [
  "Thank you for your valuable feedback!",
  "We appreciate your time and thoughts!",
  "Your opinion matters to us, thank you!",
  "Thanks for helping us improve!",
  "We're grateful for your feedback!"
];

export const DEFAULT_ADMIN = {
  email: "admin@opacafe.com",
  password: "admin123" // This would be securely stored in a production app
};
