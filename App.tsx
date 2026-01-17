import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Heart, 
  Home as HomeVastu, 
  Calendar, 
  Clock, 
  Hand, 
  ShieldCheck, 
  Flame, 
  UserPlus, 
  CloudMoon, 
  Hash, 
  Scroll, 
  Feather, 
  Infinity, 
  Flower, 
  Landmark, 
  TrendingUp, 
  Activity, 
  GraduationCap, 
  Plane, 
  MessageSquare, 
  MessageCircle, 
  X, 
  Send, 
  Image as ImageIcon, 
  Mic, 
  Loader2, 
  Eye, 
  User, 
  LayoutDashboard, 
  Phone, 
  ChevronRight, 
  ArrowRight, 
  Ticket, 
  Sun, 
  Bug, 
  Sprout, 
  Leaf, 
  Bird, 
  BookOpen, 
  Hammer, 
  Wind, 
  EyeOff, 
  UserCheck, 
  Search, 
  CloudSun, 
  Languages, 
  Gift, 
  PawPrint, 
  Hexagon, 
  Compass, 
  Wand2, 
  Save, 
  Trash2, 
  History, 
  Bell, 
  UserCircle, 
  LogOut, 
  Shield, 
  LogIn 
} from 'lucide-react';
import SolarSystem from './components/SolarSystem';
import StarBackground from './components/StarBackground';
import { Gurunnanse, DummalaEffect } from './components/MagicEffects';
import { analyzeHoroscopeAdvanced } from './services/gemini';
import { ChatMessage, ChatSession, Language, UserProfile } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { LoginScreen, SignupScreen } from './components/AuthScreens';
import { AdminDashboard } from './components/AdminDashboard';

// The 41 Features of HADAHANA AI
const FEATURES = [
  { id: 1, name: "කේන්දර පරීක්ෂාව", enName: "Horoscope", icon: Sparkles, color: "text-amber-300", desc: "ග්‍රහ පිහිටීම් විශ්ලේෂණය" },
  { id: 2, name: "පොරොන්දම් ගැලපීම", enName: "Porondam", icon: Heart, color: "text-rose-400", desc: "විවාහ ගැලපීම" },
  { id: 3, name: "වාස්තු විද්‍යාව", enName: "Vastu", icon: HomeVastu, color: "text-emerald-400", desc: "නිවාස හා ඉඩම්" },
  { id: 4, name: "පුද්ගලික ලිත", enName: "Litha", icon: Calendar, color: "text-blue-400", desc: "දෛනික පලාපල" },
  { id: 5, name: "සුබ නැකැත්", enName: "Nekath", icon: Clock, color: "text-orange-400", desc: "සුබ මුහුර්ත" },
  { id: 6, name: "අත් රේඛා", enName: "Palmistry", icon: Hand, color: "text-purple-400", desc: "අත්ල පරීක්ෂාව" },
  { id: 7, name: "ශාන්ති කර්ම", enName: "Shanthikarma", icon: ShieldCheck, color: "text-red-400", desc: "ආරක්ෂක විධි" },
  { id: 8, name: "මන්ත්‍ර සහ ගුරුකම්", enName: "Mantras", icon: Flame, color: "text-yellow-500", desc: "පුරාණ මන්ත්‍ර" },
  { id: 9, name: "නම තැබීම", enName: "Naming", icon: UserPlus, color: "text-cyan-400", desc: "වාසනාවන්ත නම්" },
  { id: 10, name: "සිහින පලාපල", enName: "Dreams", icon: CloudMoon, color: "text-indigo-300", desc: "සිහින විග්‍රහය" },
  { id: 11, name: "අංක විද්‍යාව", enName: "Numerology", icon: Hash, color: "text-pink-400", desc: "ඉලක්කම් අනාවැකි" },
  { id: 12, name: "පුස්කොළ පොත්", enName: "Manuscripts", icon: Scroll, color: "text-amber-600", desc: "පෞරාණික දැනුම" },
  { id: 13, name: "සෙත් කවි", enName: "Seth Kavi", icon: Feather, color: "text-teal-300", desc: "ආශිර්වාද කාව්‍ය" },
  { id: 14, name: "පෙර භවය", enName: "Past Life", icon: Infinity, color: "text-fuchsia-400", desc: "පුනරුත්පත්තිය විග්‍රහය" },
  { id: 15, name: "දහම් මඟ", enName: "Daham Maga", icon: Flower, color: "text-pink-300", desc: "සත්‍ය බෞද්ධ දර්ශනය" },
  { id: 16, name: "බහිරව පූජා", enName: "Bahirawa Puja", icon: Landmark, color: "text-orange-300", desc: "භූමි ආරක්ෂාව" },
  { id: 17, name: "ව්‍යාපාර ජය", enName: "Business Success", icon: TrendingUp, color: "text-lime-400", desc: "දියුණුවේ මාවත" },
  { id: 18, name: "සර්ප විද්‍යාව", enName: "Sarpa Vidya", icon: Activity, color: "text-red-500", desc: "විෂ වෛද්‍ය හා ආරක්ෂාව" },
  { id: 19, name: "අධ්‍යාපන සෙත්", enName: "Education", icon: GraduationCap, color: "text-sky-300", desc: "සරස්වතී යෝග" },
  { id: 20, name: "විදේශ වාසනාව", enName: "Foreign Travel", icon: Plane, color: "text-blue-500", desc: "රට යාමේ සිහිනය" },
  { id: 21, name: "ජය අංක (ලොතරැයි)", enName: "Lottery Luck", icon: Ticket, color: "text-green-400", desc: "ධන වාසනාව උරගා බලන්න" },
  { id: 22, name: "රාහු කාලය", enName: "Rahu Kalaya", icon: Sun, color: "text-red-500", desc: "දවසේ අසුබ වේලාවන්" },
  { id: 23, name: "හූන පලාපල", enName: "Gowli Shasthra", icon: Bug, color: "text-emerald-500", desc: "හූනා වැටීමේ ප්‍රතිඵල" },
  { id: 24, name: "බෝධි පූජා", enName: "Bodhi Pooja", icon: Sprout, color: "text-lime-300", desc: "ග්‍රහ දෝෂ නිවාරණය" },
  { id: 25, name: "හෙළ වෙදකම", enName: "Hela Wedakam", icon: Leaf, color: "text-green-600", desc: "දේශීය ඖෂධ වට්ටෝරු" },
  { id: 26, name: "මල්වර නැකත්", enName: "Puberty Rituals", icon: Flower, color: "text-pink-500", desc: "කොටහළු ශාස්ත්‍රය" },
  { id: 27, name: "පංච පක්ෂි", enName: "Five Birds", icon: Bird, color: "text-sky-500", desc: "පක්ෂි ආණ්ඩු කාල" },
  { id: 28, name: "සෙත් පිරිත්", enName: "Pirith Guide", icon: BookOpen, color: "text-amber-200", desc: "ගාථා සහ ආශිර්වාද" },
  { id: 29, name: "නිවාස මූලික", enName: "House Building", icon: Hammer, color: "text-orange-500", desc: "මුල් ගල් තැබීම" },
  { id: 30, name: "ෆෙන්ෂුයි", enName: "Feng Shui", icon: Wind, color: "text-emerald-300", desc: "ශක්ති කළමනාකරණය" },
  { id: 31, name: "ඇස්වහ කටවහ", enName: "Evil Eye", icon: EyeOff, color: "text-red-500", desc: "කෙම් ක්‍රම සහ ආරක්ෂාව" },
  { id: 32, name: "දේහ ලක්ෂණ", enName: "Mole Reading", icon: UserCheck, color: "text-amber-400", desc: "උපන් ලප පලාපල" },
  { id: 33, name: "නැතිවූ දේවල්", enName: "Lost Items", icon: Search, color: "text-blue-400", desc: "නිමිති ශාස්ත්‍රය" },
  { id: 35, name: "ගොවිතැන්", enName: "Agriculture", icon: CloudSun, color: "text-green-500", desc: "වගා නැකත් සහ කෙම්" },
  { id: 36, name: "අකුරු කියවීම", enName: "First Letters", icon: Languages, color: "text-indigo-400", desc: "විද්‍යාරම්භය සහ අකුරු" },
  { id: 37, name: "දේව පූජා", enName: "Deity Offerings", icon: Gift, color: "text-red-400", desc: "පූජා වට්ටි සහ භාර" },
  { id: 38, name: "සත්ව නිමිති", enName: "Animal Omens", icon: PawPrint, color: "text-stone-400", desc: "සතුන්ගේ පලාපල" },
  { id: 39, name: "යන්ත්‍ර විද්‍යාව", enName: "Yantra Guide", icon: Hexagon, color: "text-amber-600", desc: "ආරක්ෂක යන්ත්‍ර" },
  { id: 40, name: "සුබ ගමන්", enName: "Auspicious Journeys", icon: Compass, color: "text-blue-500", desc: "දිශා සහ නැකත්" },
  { id: 41, name: "කෙම් ක්‍රම", enName: "Folk Remedies", icon: Wand2, color: "text-teal-400", desc: "ගුප්ත කෙම් සහ අත් බෙහෙත්" },
];

// Background Image Helper
const getBackgroundImage = (featureEnName: string | undefined) => {
  if (['Porondam', 'Puberty Rituals', 'Naming', 'Dreams'].includes(featureEnName || '')) {
    return "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2000&auto=format&fit=crop";
  }
  if (['Lottery Luck', 'Business Success', 'Foreign Travel', 'Education', 'Auspicious Journeys'].includes(featureEnName || '')) {
    return "https://images.unsplash.com/photo-1506318137071-a8bcbf6d943d?q=80&w=2000&auto=format&fit=crop";
  }
  if (['Hela Wedakam', 'Folk Remedies', 'Agriculture', 'Sarpa Vidya', 'Gowli Shasthra', 'Animal Omens'].includes(featureEnName || '')) {
    return "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop";
  }
  if (['Shanthikarma', 'Mantras', 'Pirith Guide', 'Seth Kavi', 'Bodhi Pooja', 'Deity Offerings', 'Bahirawa Puja', 'Yantra Guide', 'Evil Eye', 'Daham Maga'].includes(featureEnName || '')) {
    return "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?q=80&w=2000&auto=format&fit=crop";
  }
  if (['Vastu', 'House Building', 'Lost Items'].includes(featureEnName || '')) {
    return "https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=2000&auto=format&fit=crop";
  }
  if (['Palmistry', 'Mole Reading', 'Numerology', 'First Letters', 'Manuscripts', 'Horoscope', 'Litha', 'Nekath', 'Past Life', 'Rahu Kalaya', 'Five Birds'].includes(featureEnName || '')) {
    return "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2000&auto=format&fit=crop";
  }
  return "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2000&auto=format&fit=crop";
};

// --- AUTH MODAL WRAPPER ---
const AuthModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md">
        <button onClick={onClose} className="absolute -top-10 right-0 p-2 text-white hover:text-red-400 transition-colors">
          <X className="w-6 h-6" />
        </button>
        {authMode === 'login' ? (
          <LoginScreen onSwitch={() => setAuthMode('signup')} />
        ) : (
          <SignupScreen onSwitch={() => setAuthMode('login')} />
        )}
      </div>
    </div>
  );
};

// --- NOTIFICATION BELL ---
const NotificationBell: React.FC = () => {
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button 
                onClick={() => setOpen(!open)}
                className="p-2 relative text-slate-400 hover:text-amber-400 transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-black"></span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-12 w-80 glass-panel border border-amber-500/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-3 bg-slate-900/80 border-b border-white/5 flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Notifications</span>
                        <span className="text-[10px] text-amber-500">{notifications.length} Total</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-slate-500 text-sm italic">
                                No new messages from the stars.
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div 
                                    key={n.id} 
                                    onClick={() => markAsRead(n.id)}
                                    className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${n.read ? 'opacity-50' : 'opacity-100 bg-amber-500/5'}`}
                                >
                                    <h4 className="font-bold text-amber-100 text-sm mb-1">{n.title}</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
                                    <p className="text-[10px] text-slate-600 mt-2 text-right">{new Date(n.timestamp).toLocaleDateString()}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MAIN APP CONTENT ---

const AppContent: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [lang, setLang] = useState<Language>('si');
  const [activeView, setActiveView] = useState<'home' | 'dashboard' | 'contact' | 'help' | 'chat' | 'profile' | 'admin'>('home');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  
  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Guest User',
    dob: '',
    tob: '',
    pob: '',
    notifications: true
  });

  // Chat State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [userQuery, setUserQuery] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync user from auth to profile
  useEffect(() => {
    if (user) {
      setUserProfile(prev => ({ ...prev, name: user.name }));
      setShowAuthModal(false); // Close modal on successful login
    }
  }, [user]);

  // Load Data from Local Storage on Mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('hadahana_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    
    const savedSessions = localStorage.getItem('hadahana_sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Save Sessions to Local Storage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('hadahana_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Initialize Scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, isLoading, currentSessionId]);

  if (loading) {
     return <div className="min-h-screen bg-black flex items-center justify-center text-amber-500"><Loader2 className="w-10 h-10 animate-spin" /></div>;
  }

  // --- APP LOGIC ---

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('hadahana_profile', JSON.stringify(userProfile));
    alert(lang === 'si' ? 'ඔබගේ තොරතුරු සාර්ථකව සුරැකින!' : 'Your profile has been saved successfully!');
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(lang === 'si' ? 'ඔබට මෙම සංවාදය මැකීමට අවශ්‍යද?' : 'Are you sure you want to delete this session?')) {
      const updatedSessions = sessions.filter(s => s.id !== id);
      setSessions(updatedSessions);
      if (updatedSessions.length === 0) {
        localStorage.removeItem('hadahana_sessions');
      } else {
        localStorage.setItem('hadahana_sessions', JSON.stringify(updatedSessions));
      }
      if (currentSessionId === id) setCurrentSessionId(null);
    }
  };

  const handleResumeSession = (id: string) => {
    setCurrentSessionId(id);
    const session = sessions.find(s => s.id === id);
    if (session) {
      setSelectedFeature(session.title);
      setActiveView('chat');
    }
  };

  // Handle Feature Click
  const handleFeatureClick = (featureName: string) => {
    setSelectedFeature(featureName);
    setActiveView('chat');
    
    // Start a new session if none exists or switching topics
    const newId = Date.now().toString();
    const welcomeMsg: ChatMessage = {
      role: 'model',
      text: lang === 'si' 
        ? `<div class="response-card"><h3 class="gold-heading">ආයුබෝවන් ${userProfile.name ? userProfile.name : 'පින්වතුනි'}!</h3><p>මම HADAHANA AI. ඔබ තෝරාගත් <strong>"${featureName}"</strong> සම්බන්ධව මට ඔබට කෙසේද යහපතක් සැලසිය හැක්කේ?</p></div>`
        : `<div class="response-card"><h3 class="gold-heading">Blessings ${userProfile.name ? userProfile.name : ''}!</h3><p>I am HADAHANA AI. How may I offer you guidance regarding <strong>"${featureName}"</strong> today?</p></div>`
    };

    setSessions(prev => [...prev, {
      id: newId,
      title: featureName,
      messages: [welcomeMsg],
      timestamp: Date.now()
    }]);
    setCurrentSessionId(newId);
  };

  // Handle General AI Chat (Floating Button)
  const handleGeneralChat = () => {
    setSelectedFeature(lang === 'si' ? 'විශ්වීය මගපෙන්වීම' : 'Universal Guidance');
    setActiveView('chat');
    
    const newId = Date.now().toString();
    const welcomeMsg: ChatMessage = {
      role: 'model',
      text: lang === 'si' 
        ? `<div class="response-card"><h3 class="gold-heading">ආයුබෝවන් ${userProfile.name ? userProfile.name : ''}!</h3><p>මම ඔබේ විශ්වීය මාර්ගෝපදේශකයා වෙමි. ඔබට ඕනෑම ජ්‍යෝතිෂ ගැටළුවක්, සිහින පලාපලයක් හෝ ජීවිත උපදෙසක් මගෙන් විමසන්න. මම පුරාණ ඍෂිවරුන්ගේ දැනුම ඇසුරෙන් ඔබට පිළිතුරු ලබා දෙන්නෙමි.</p></div>`
        : `<div class="response-card"><h3 class="gold-heading">Namaste ${userProfile.name ? userProfile.name : ''}!</h3><p>I am your Universal Guide. You may ask me any astrological question, interpret a dream, or seek life guidance. I draw wisdom from ancient manuscripts to guide you.</p></div>`
    };

    setSessions(prev => [...prev, {
      id: newId,
      title: 'Universal Guidance',
      messages: [welcomeMsg],
      timestamp: Date.now()
    }]);
    setCurrentSessionId(newId);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!userQuery.trim() && images.length === 0) || !currentSessionId) return;

    // Use simple text for user message
    const currentMsg: ChatMessage = { role: 'user', text: userQuery, images: [...images] };
    setUserQuery('');
    setImages([]);
    
    // Update UI immediately
    setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: [...s.messages, currentMsg] } : s));
    setIsLoading(true);

    try {
      const session = sessions.find(s => s.id === currentSessionId);
      const history = session ? session.messages : [];
      
      const responseText = await analyzeHoroscopeAdvanced(currentMsg.images || [], currentMsg.text, history, lang);
      
      const botMsg: ChatMessage = { role: 'model', text: responseText };
      setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: [...s.messages, botMsg] } : s));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setImages(prev => [...prev, reader.result as string].slice(0, 5));
      reader.readAsDataURL(file as Blob);
    });
  };

  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-gold-primary selection:text-black font-sans bg-[#02020a] overflow-x-hidden">
      <StarBackground />
      <SolarSystem />

      {/* Auth Modal Overlay */}
      {showAuthModal && !user && <AuthModal onClose={() => setShowAuthModal(false)} />}
      
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 rounded-none h-20 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3 animate-float" onClick={() => setActiveView('home')} style={{cursor: 'pointer'}}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.5)] border border-amber-300/30">
            <Eye className="w-6 h-6 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-2xl font-heading font-black gold-text-gradient tracking-widest">HADAHANA AI</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Master Astrologer</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          
          {/* Notification Bell */}
          <NotificationBell />

          {/* Admin Button (Protected) */}
          {user && user.isAdmin && (
            <button 
              onClick={() => setActiveView('admin')}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors hover:text-red-400 ${activeView === 'admin' ? 'text-red-500' : 'text-slate-400'}`}
            >
              <Shield className="w-4 h-4" />
              <span className="hidden md:inline">Admin</span>
            </button>
          )}

          <button 
            onClick={() => setActiveView('home')}
            className={`hidden md:block text-xs font-bold uppercase tracking-widest transition-colors hover:text-amber-400 ${activeView === 'home' ? 'text-amber-400' : 'text-slate-400'}`}
          >
            {lang === 'si' ? 'මුල් පිටුව' : 'Home'}
          </button>
          
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors hover:text-amber-400 ${activeView === 'dashboard' ? 'text-amber-400' : 'text-slate-400'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden md:inline">{lang === 'si' ? 'දත්ත පුවරුව' : 'Dashboard'}</span>
          </button>

          {/* User Auth Control */}
          {user ? (
            <>
                <button 
                    onClick={() => setActiveView('profile')}
                    className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors hover:text-amber-400 ${activeView === 'profile' ? 'text-amber-400' : 'text-slate-400'}`}
                >
                    <UserCircle className="w-4 h-4" />
                    <span className="hidden md:inline">{lang === 'si' ? 'ගිණුම' : 'Profile'}</span>
                </button>
                <div className="h-6 w-px bg-slate-700 mx-2 hidden md:block"></div>
                <button 
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    title="Log Out"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </>
          ) : (
            <button 
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-700/80 hover:bg-amber-600 rounded-full text-xs font-bold uppercase tracking-widest text-white transition-all border border-amber-500/30"
            >
                <LogIn className="w-3 h-3" />
                <span>Login</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 pt-28 pb-12 px-4 min-h-screen flex flex-col items-center justify-center">
        
        {/* Landing Home View */}
        {activeView === 'home' && (
          <div className="w-full max-w-7xl animate-fade-in-up flex flex-col items-center justify-center text-center">
             <div className="mb-12 relative flex justify-center">
                 <Gurunnanse />
              </div>

            <h1 className="text-5xl md:text-8xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 drop-shadow-2xl mb-6">
              {lang === 'si' ? 'විශ්වීය අනාගතය දකින්න' : 'DISCOVER YOUR COSMIC DESTINY'}
            </h1>
            
            <p className="max-w-3xl mx-auto text-lg md:text-2xl text-slate-300 font-light leading-relaxed mb-12 glass-panel p-8 rounded-3xl border border-amber-500/10 shadow-2xl backdrop-blur-md">
              {lang === 'si' 
                ? 'පුරාණ පුස්කොළ පොත්, ජ්‍යෝතිෂ ශාස්ත්‍රය සහ නවීන AI තාක්ෂණය මුසු වූ ලොව බලගතුම ජ්‍යෝතිෂ සේවාව. ඔබේ ජීවිතයේ රහස් සොයා ගන්න.'
                : 'Unveil the secrets of your life with the world\'s most advanced AI Astrologer. A divine fusion of ancient palm leaf wisdom and modern artificial intelligence.'}
            </p>

            <button 
              onClick={() => setActiveView('dashboard')}
              className="group relative px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-full font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center gap-4"
            >
              {lang === 'si' ? 'දත්ත පුවරුවට පිවිසෙන්න' : 'Enter Dashboard'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="w-full max-w-7xl animate-fade-in-up">
            <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-heading font-bold text-amber-100 mb-2">
                 {lang === 'si' ? 'විශ්වීය දත්ත පුවරුව' : 'Cosmic Dashboard'}
               </h2>
               <p className="text-slate-400 text-sm md:text-base uppercase tracking-widest">
                 {lang === 'si' ? 'ඔබට අවශ්‍ය සේවාව තෝරන්න' : 'Select a Divine Service'}
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-0 pb-20">
              {FEATURES.map((feature, idx) => (
                <div 
                  key={feature.id}
                  onClick={() => handleFeatureClick(feature.name)}
                  className="group relative h-full min-h-[320px] rounded-3xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* Glow behind the card on hover */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-${feature.color.replace('text-', '')}/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none`} />
                  
                  {/* Glass Card Container */}
                  <div className="relative h-full w-full rounded-3xl bg-black/30 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-between p-6 transition-all duration-500 group-hover:border-white/20 group-hover:bg-black/50 group-hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    
                    {/* Top decorative line */}
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-${feature.color.replace('text-', '')} to-transparent opacity-50 group-hover:w-2/3 group-hover:opacity-100 transition-all duration-500`} />

                    {/* Content Wrapper */}
                    <div className="flex-1 flex flex-col items-center justify-center w-full gap-6">
                      
                      {/* Icon Container with glowing ring */}
                      <div className="relative">
                        <div className={`absolute inset-0 rounded-full bg-${feature.color.replace('text-', '')} blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                        <div className={`w-24 h-24 rounded-full bg-black/40 border border-white/10 flex items-center justify-center group-hover:border-${feature.color.replace('text-', '')}/50 transition-all duration-500 group-hover:scale-110 relative z-10`}>
                          <feature.icon className={`w-10 h-10 ${feature.color} transition-all duration-500 group-hover:drop-shadow-[0_0_8px_currentColor]`} />
                        </div>
                      </div>

                      <div className="text-center space-y-3">
                        <h3 className={`text-xl font-heading font-bold text-slate-200 uppercase tracking-widest transition-colors duration-500 group-hover:text-white group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]`}>
                          {lang === 'si' ? feature.name : feature.enName}
                        </h3>
                        <p className="text-sm text-zinc-500 font-light leading-relaxed px-4 line-clamp-3 group-hover:text-zinc-300 transition-colors duration-500">
                          {feature.desc}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="w-full mt-6">
                      <div className={`w-full py-3.5 rounded-xl border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center justify-center gap-3 transition-all duration-500 group-hover:border-transparent group-hover:text-white group-hover:bg-gradient-to-r group-hover:from-amber-600 group-hover:to-amber-800 group-hover:shadow-lg`}>
                        {lang === 'si' ? 'පිවිසෙන්න' : 'Consult'} 
                        <ChevronRight className="w-3 h-3 transition-transform duration-500 group-hover:translate-x-1" />
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Profile View (Login Required Check) */}
        {activeView === 'profile' && (
          <div className="w-full max-w-6xl animate-fade-in-up">
            {!user ? (
               <div className="text-center p-12 glass-panel rounded-3xl">
                   <h2 className="text-2xl font-bold text-amber-100 mb-4">Login Required</h2>
                   <p className="text-slate-400 mb-6">You must be logged in to view your profile.</p>
                   <button onClick={() => setShowAuthModal(true)} className="px-6 py-3 bg-amber-600 rounded-xl text-white font-bold">Login Now</button>
               </div>
            ) : (
                <div className="glass-panel rounded-3xl overflow-hidden border border-amber-500/10 min-h-[600px] flex flex-col md:flex-row backdrop-blur-lg">
                {/* Profile Sidebar */}
                <div className="w-full md:w-1/3 bg-slate-900/60 p-8 border-r border-white/5">
                    <div className="text-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-amber-800 mx-auto mb-4 flex items-center justify-center border-4 border-black/30 shadow-lg">
                        <UserCircle className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-xl font-heading text-amber-100 font-bold">{userProfile.name || (lang === 'si' ? 'නම ඇතුලත් කරන්න' : 'Enter Name')}</h2>
                    <p className="text-xs text-amber-500/70 uppercase tracking-widest mt-1">
                        {user.isAdmin ? <span className="text-red-400">Master Admin</span> : (lang === 'si' ? 'විශ්වීය සාමාජික' : 'Cosmic Member')}
                    </p>
                    </div>

                    <div className="space-y-2">
                    <div className="p-4 rounded-xl bg-white/5 border border-amber-500/20 text-center">
                        <p className="text-2xl font-bold text-white">{sessions.length}</p>
                        <p className="text-[10px] uppercase text-slate-400 tracking-widest">{lang === 'si' ? 'සංවාද' : 'Consultations'}</p>
                    </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                    
                    {/* Section 1: Cosmic Identity Form */}
                    <div className="mb-12">
                    <h3 className="gold-heading mb-6 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" /> {lang === 'si' ? 'විශ්වීය අනන්‍යතාවය' : 'Cosmic Identity'}
                    </h3>
                    <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'si' ? 'සම්පූර්ණ නම' : 'Full Name'}</label>
                        <input 
                            type="text" 
                            value={userProfile.name}
                            onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                            className="w-full bg-black/30 border border-slate-700 rounded-xl p-3 text-slate-200 focus:border-amber-500/50 outline-none transition-colors"
                            placeholder={lang === 'si' ? 'ඔබේ නම' : 'Your Name'}
                        />
                        </div>
                        <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'si' ? 'උපන් දිනය' : 'Date of Birth'}</label>
                        <input 
                            type="date" 
                            value={userProfile.dob}
                            onChange={(e) => setUserProfile({...userProfile, dob: e.target.value})}
                            className="w-full bg-black/30 border border-slate-700 rounded-xl p-3 text-slate-200 focus:border-amber-500/50 outline-none transition-colors"
                        />
                        </div>
                        <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'si' ? 'උපන් වේලාව' : 'Time of Birth'}</label>
                        <input 
                            type="time" 
                            value={userProfile.tob}
                            onChange={(e) => setUserProfile({...userProfile, tob: e.target.value})}
                            className="w-full bg-black/30 border border-slate-700 rounded-xl p-3 text-slate-200 focus:border-amber-500/50 outline-none transition-colors"
                        />
                        </div>
                        <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'si' ? 'උපන් ස්ථානය' : 'Place of Birth'}</label>
                        <input 
                            type="text" 
                            value={userProfile.pob}
                            onChange={(e) => setUserProfile({...userProfile, pob: e.target.value})}
                            className="w-full bg-black/30 border border-slate-700 rounded-xl p-3 text-slate-200 focus:border-amber-500/50 outline-none transition-colors"
                            placeholder="City, Country"
                        />
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                        <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-amber-500/20">
                            <Save className="w-4 h-4" /> {lang === 'si' ? 'තොරතුරු සුරකින්න' : 'Save Details'}
                        </button>
                        </div>
                    </form>
                    </div>

                    {/* Section 2: History */}
                    <div>
                    <h3 className="gold-heading mb-6 flex items-center gap-2">
                        <History className="w-5 h-5" /> {lang === 'si' ? 'පෙර සංවාද' : 'Consultation History'}
                    </h3>
                    
                    {sessions.length === 0 ? (
                        <div className="text-center p-8 border border-dashed border-slate-700 rounded-2xl bg-white/5 text-slate-500">
                        <p>{lang === 'si' ? 'කිසිදු සංවාදයක් හමු නොවීය.' : 'No consultation history found.'}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                        {sessions.slice().reverse().map((session) => (
                            <div key={session.id} onClick={() => handleResumeSession(session.id)} className="group p-4 bg-slate-900/40 border border-white/5 hover:border-amber-500/30 rounded-2xl cursor-pointer transition-all hover:bg-slate-800/60 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-amber-900/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-5 h-5" />
                                </div>
                                <div>
                                <h4 className="font-bold text-slate-200 group-hover:text-amber-100">{session.title}</h4>
                                <p className="text-xs text-slate-500">{new Date(session.timestamp).toLocaleDateString()} &bull; {new Date(session.timestamp).toLocaleTimeString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                onClick={(e) => handleDeleteSession(session.id, e)}
                                className="p-2 text-slate-600 hover:text-red-400 transition-colors"
                                title="Delete"
                                >
                                <Trash2 className="w-4 h-4" />
                                </button>
                                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400" />
                            </div>
                            </div>
                        ))}
                        </div>
                    )}
                    </div>

                </div>
                </div>
            )}
          </div>
        )}

        {/* Chat Interface View - Floating Glass Overlay */}
        {activeView === 'chat' && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4 md:p-8 pt-24 bg-black/70 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-5xl h-full flex flex-col glass-panel rounded-3xl overflow-hidden shadow-2xl relative border-amber-500/20">
              
              {/* Dynamic Background Image based on Feature */}
              <div 
                className="absolute inset-0 z-0 transition-all duration-1000 ease-in-out bg-cover bg-center opacity-15"
                style={{ 
                  backgroundImage: `url(${getBackgroundImage(FEATURES.find(f => f.name === selectedFeature || f.enName === selectedFeature)?.enName)})` 
                }}
              />
              {/* Dark Overlay for Readability */}
              <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 pointer-events-none"></div>

              {/* Mystical Background Effect */}
              {sessions.find(s => s.id === currentSessionId)?.messages.length! > 0 && <DummalaEffect />}
              
              {/* Chat Header - Guru Theme */}
              <div className="h-20 border-b border-amber-500/10 flex items-center justify-between px-6 bg-slate-900/40 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-amber-900/20 border border-amber-500/30 flex items-center justify-center">
                       <Eye className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-amber-100 font-heading tracking-wide">{selectedFeature || 'Master Astrologer'}</h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-amber-500/70">Guru Consultation In Progress</p>
                  </div>
                </div>
                <button onClick={() => setActiveView('dashboard')} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-red-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
                {/* Background Mystical Elements (Static Blur) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none"></div>

                {sessions.find(s => s.id === currentSessionId)?.messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start items-start'} gap-3 relative z-10 animate-fade-in-up`}>
                    
                    {/* AI Avatar */}
                    {msg.role === 'model' && (
                      <div className="flex-shrink-0 mt-1">
                        <img 
                          src="https://preview.redd.it/f3uini0vzyf71.jpg?width=640&crop=smart&auto=webp&s=8f63c8ddfd011d70551e7e2e02394c76618c0a82" 
                          alt="Gurunnanse" 
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-amber-500 object-cover shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                        />
                      </div>
                    )}

                    <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-5 md:p-6 ${
                      msg.role === 'user' 
                        ? 'bg-indigo-900/30 border border-indigo-500/20 text-indigo-50 rounded-tr-none' 
                        : 'bg-amber-900/20 border border-amber-500/20 text-amber-50 rounded-tl-none shadow-lg'
                    }`}>
                      {/* Avatar Label */}
                      <div className={`mb-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${msg.role === 'user' ? 'text-indigo-400 justify-end' : 'text-amber-400 justify-start'}`}>
                        {msg.role === 'user' ? (
                          <>YOU <User className="w-3 h-3" /></>
                        ) : (
                          <>MASTER GURU</>
                        )}
                      </div>

                      {/* Render HTML content safely for the Guru, simple text for user */}
                      {msg.role === 'user' ? (
                         <p className="whitespace-pre-line leading-relaxed text-sm md:text-base">{msg.text}</p>
                      ) : (
                         <div 
                           className="leading-relaxed text-sm md:text-base"
                           dangerouslySetInnerHTML={{ __html: msg.text }} 
                         />
                      )}
                      
                      {msg.images && msg.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                          {msg.images.map((img, i) => (
                            <img key={i} src={img} className="w-full h-24 object-cover rounded-lg border border-white/10" alt="upload" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start relative z-10 pl-2">
                    <div className="bg-amber-900/10 border border-amber-500/10 rounded-2xl rounded-tl-none p-4 flex items-center gap-3">
                      <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                      <span className="text-xs text-amber-300/70 animate-pulse tracking-widest font-heading">CONSULTING ANCIENT MANUSCRIPTS...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Area */}
              <div className="p-4 md:p-6 bg-slate-900/60 border-t border-amber-500/10 backdrop-blur-xl relative z-10">
                <form onSubmit={handleSendMessage} className="relative max-w-4xl mx-auto">
                  
                  {images.length > 0 && (
                    <div className="absolute -top-24 left-0 flex gap-2 p-2 glass-panel rounded-xl">
                      {images.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 group">
                          <img src={img} className="w-full h-full object-cover rounded-lg border border-amber-500/30" alt="preview" />
                          <button type="button" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white scale-0 group-hover:scale-100 transition-transform">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="relative group">
                    <div className="relative flex items-end gap-2 bg-black/40 border border-slate-700/50 rounded-2xl p-2 focus-within:border-amber-500/40 transition-colors">
                      
                      <button 
                        type="button" 
                        className="p-3 text-slate-400 hover:text-amber-400 transition-colors"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <ImageIcon className="w-6 h-6" />
                        <input id="file-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
                      </button>

                      <textarea
                        value={userQuery}
                        onChange={(e) => setUserQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                        placeholder={lang === 'si' ? "ඔබේ ගැටළුව ගුරුතුමාට පවසන්න..." : "Seek guidance from the Master..."}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder:text-slate-600 max-h-32 min-h-[50px] py-3 custom-scrollbar resize-none text-sm md:text-base"
                        rows={1}
                      />

                      <button 
                        type="button"
                        onClick={() => {
                          if (!('webkitSpeechRecognition' in window)) return alert("Browser not supported");
                          const recognition = new (window as any).webkitSpeechRecognition();
                          recognition.lang = lang === 'si' ? 'si-LK' : 'en-US';
                          recognition.onstart = () => setIsRecording(true);
                          recognition.onend = () => setIsRecording(false);
                          recognition.onresult = (e: any) => setUserQuery(prev => prev + ' ' + e.results[0][0].transcript);
                          recognition.start();
                        }}
                        className={`p-3 transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-amber-400'}`}
                      >
                        <Mic className="w-6 h-6" />
                      </button>

                      <button 
                        type="submit" 
                        disabled={!userQuery.trim() && images.length === 0}
                        className="p-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/20"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-[10px] text-center mt-3 text-slate-600 uppercase tracking-widest">
                    Based on Ancient Manuscripts &bull; 100% Authentic Predictions
                  </div>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* Contact View */}
        {activeView === 'contact' && (
          <div className="w-full max-w-2xl animate-fade-in-up glass-panel p-10 rounded-3xl border border-amber-500/10 backdrop-blur-md">
            <div className="text-center mb-10">
               <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                 <Phone className="w-8 h-8 text-amber-400" />
               </div>
               <h2 className="text-3xl font-heading text-amber-100 mb-2">{lang === 'si' ? 'සම්බන්ධ වන්න' : 'Contact Us'}</h2>
               <p className="text-slate-400">Our divine support team is available 24/7</p>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                   <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-1">WhatsApp</h3>
                   <p className="text-amber-400 font-mono text-xl">077 820 1119</p>
                </div>
                <button 
                  onClick={() => window.open('https://wa.me/94778201119', '_blank')}
                  className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all"
                >
                  Chat
                </button>
              </div>
              
              <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Send a Message</h3>
                <textarea 
                  className="w-full bg-black/40 border border-slate-700 rounded-xl p-4 text-slate-200 focus:border-amber-500/50 outline-none" 
                  rows={4}
                  placeholder="Type your spiritual query here..."
                ></textarea>
                <button className="mt-4 w-full py-4 bg-amber-700 hover:bg-amber-600 text-white rounded-xl font-bold uppercase tracking-widest transition-all">
                  Send Inquiry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Dashboard View (Protected) */}
        {activeView === 'admin' && user && user.isAdmin && (
           <AdminDashboard />
        )}

        {/* Help View */}
        {activeView === 'help' && (
          <div className="w-full max-w-4xl animate-fade-in-up glass-panel p-10 rounded-3xl border border-amber-500/10 backdrop-blur-md">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-heading text-amber-100 mb-4">{lang === 'si' ? 'උදවු සහ මගපෙන්වීම' : 'Help & Guidance'}</h2>
               <p className="text-slate-400 max-w-xl mx-auto">How to use HADAHANA AI to discover your true cosmic path.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-colors">
                     <h3 className="font-bold text-amber-200 mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4" /> 1. Select a Service</h3>
                     <p className="text-sm text-slate-400">Navigate to the Dashboard and choose from 20 specialized astrology services like Horoscope, Porondam, or Past Life analysis.</p>
                  </div>
                  <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-colors">
                     <h3 className="font-bold text-amber-200 mb-2 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> 2. Provide Details</h3>
                     <p className="text-sm text-slate-400">Upload clear photos of your horoscope, palms, or ancient manuscripts. You can also type your birth details directly.</p>
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-colors">
                     <h3 className="font-bold text-amber-200 mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> 3. Consult the Guru</h3>
                     <p className="text-sm text-slate-400">Chat with the AI Master Astrologer. Ask deep questions about your karma, dharma, and future. The Guru speaks in Sinhala and English.</p>
                  </div>
                  <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-colors">
                     <h3 className="font-bold text-amber-200 mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> 4. Authentic Wisdom</h3>
                     <p className="text-sm text-slate-400">All predictions are strictly based on ancient manuscripts. We do not provide false hope or fabricated information.</p>
                  </div>
               </div>
            </div>
          </div>
        )}

      </main>

      {/* Floating Chat Button (FAB) */}
      <button
        onClick={handleGeneralChat}
        className="fixed bottom-12 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 text-white flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.6)] hover:scale-110 transition-transform duration-300 group border border-amber-300/50 animate-bounce"
        aria-label="Chat with Guru"
      >
        <MessageCircle className="w-8 h-8 drop-shadow-md" />
        <span className="absolute right-full mr-4 bg-slate-900/90 text-amber-100 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-amber-500/20">
          Chat with Guru
        </span>
      </button>

      {/* Footer / Copyright */}
      <footer className="fixed bottom-4 w-full text-center z-20 pointer-events-none">
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} HADAHANA AI. Sacred Ancient Wisdom.
        </p>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;