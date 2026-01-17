
export type Language = 'en' | 'si';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  images?: string[]; // Multiple base64 images
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: number;
}

export interface UserProfile {
  name: string;
  dob: string;
  tob: string;
  pob: string;
  notifications: boolean;
}

export interface HelpFormData {
  name: string;
  issue: string;
  message: string;
}

export interface ContactFormData {
  name: string;
  message: string;
}

// Data structures for astrology sections
export interface HoroscopeData {
  dob: string;
  tob: string;
  pob: string;
}

export interface PorondamData {
  groomName: string;
  groomNakshatra: string;
  brideName: string;
  brideNakshatra: string;
}

// UI Translation interface used by components
export interface Translation {
  horoscopeTitle: string;
  horoscopeDesc: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  loading: string;
  generateReading: string;
  results: string;
  porondamTitle: string;
  porondamDesc: string;
  groomName: string;
  brideName: string;
  matchCompatibility: string;
  ancientBooksTitle: string;
  ancientBooksDesc: string;
  uploadAncientBook: string;
  analyzeBook: string;
}
