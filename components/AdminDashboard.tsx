
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Key, Save, User, Users, RefreshCw, Bell, Trash2, Send, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { doc, getDoc, setDoc, updateDoc, deleteField, collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'api' | 'users' | 'notifications'>('api');
  
  // API Key State
  const [geminiKeyStatus, setGeminiKeyStatus] = useState<string | null>(null);
  const [newGeminiKey, setNewGeminiKey] = useState('');
  const [keyLoading, setKeyLoading] = useState(false);

  // Users State
  const [users, setUsers] = useState<any[]>([]);

  // Notifications State
  const { addNotification, notifications, deleteNotification } = useNotifications();
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');

  // Load Global Config (API Key)
  const loadGlobalConfig = async () => {
      try {
          const docRef = doc(db, "settings", "global_config");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().geminiApiKey) {
              const key = docSnap.data().geminiApiKey;
              // Show last 4 chars only
              setGeminiKeyStatus(`Active Key: •••••••••${key.slice(-4)}`);
          } else {
              setGeminiKeyStatus(null);
          }
      } catch (e) {
          console.error("Error loading config", e);
      }
  };

  useEffect(() => {
    loadGlobalConfig();
    refreshUsers();
  }, []);

  const handleSaveGeminiKey = async () => {
    if(!newGeminiKey.trim()) return;
    setKeyLoading(true);
    try {
        await setDoc(doc(db, "settings", "global_config"), { geminiApiKey: newGeminiKey.trim() }, { merge: true });
        alert("✅ Gemini API Key Saved Successfully!");
        setNewGeminiKey('');
        await loadGlobalConfig();
    } catch (e) {
        console.error(e);
        alert("❌ Error saving key");
    } finally {
        setKeyLoading(false);
    }
  };

  const handleDeleteGeminiKey = async () => {
      if(!window.confirm("Are you sure? This will break AI features until a new key is added.")) return;
      setKeyLoading(true);
      try {
          await updateDoc(doc(db, "settings", "global_config"), { geminiApiKey: deleteField() });
          alert("⚠️ API Key Removed");
          await loadGlobalConfig();
      } catch (e) {
          console.error(e);
          alert("❌ Error removing key");
      } finally {
          setKeyLoading(false);
      }
  };

  const refreshUsers = async () => {
     try {
       const usersCol = collection(db, 'users');
       const userSnapshot = await getDocs(usersCol);
       const userList = userSnapshot.docs.map(doc => doc.data());
       setUsers(userList);
     } catch (e) {
       console.error("Error fetching users:", e);
     }
  };

  const handleDeleteUser = (email: string) => {
    if(window.confirm(`This will only remove user ${email} from the database listing, not the Auth system. Proceed?`)) {
       alert("User deletion from Auth requires Admin SDK. Please disable account in Firebase Console.");
    }
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if(notifTitle && notifMsg) {
        addNotification(notifTitle, notifMsg);
        setNotifTitle('');
        setNotifMsg('');
        alert("Notification sent to all users.");
    }
  };

  return (
    <div className="w-full max-w-5xl animate-fade-in-up space-y-6 pb-20">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-heading font-bold text-red-100 flex items-center justify-center gap-3">
           <ShieldCheck className="w-10 h-10 text-red-500" /> Admin Command Center
        </h2>
        <p className="text-red-400/60 uppercase tracking-widest mt-2">Restricted Access &bull; Master Control</p>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <button 
            onClick={() => setActiveTab('api')}
            className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'api' ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
            <Key className="w-4 h-4" /> API Configuration
        </button>
        <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
            <Users className="w-4 h-4" /> Users
        </button>
        <button 
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'notifications' ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
            <Bell className="w-4 h-4" /> Notifications
        </button>
      </div>

      {/* TAB 1: API Key Manager */}
      {activeTab === 'api' && (
        <div className="glass-panel p-8 rounded-3xl border border-red-500/20 animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                    <Key className="w-6 h-6 text-red-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-200">Gemini API Management</h3>
                    <p className="text-slate-500 text-sm">Control the AI brain connectivity.</p>
                </div>
            </div>

            {/* Status Display */}
            <div className={`p-4 rounded-xl border mb-6 flex items-center justify-between ${geminiKeyStatus ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                <div className="flex items-center gap-3">
                    {geminiKeyStatus ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                    <span className={`font-mono font-bold ${geminiKeyStatus ? 'text-green-400' : 'text-red-400'}`}>
                        {geminiKeyStatus || "❌ No Active API Key Found"}
                    </span>
                </div>
                {geminiKeyStatus && (
                    <button 
                        onClick={handleDeleteGeminiKey}
                        disabled={keyLoading}
                        className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-xs font-bold uppercase tracking-wider border border-red-500/20"
                    >
                        Delete Key
                    </button>
                )}
            </div>

            {/* Input Form */}
            <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Update / Set New Key</label>
                <div className="flex gap-4">
                    <input 
                        type="text" 
                        value={newGeminiKey}
                        onChange={(e) => setNewGeminiKey(e.target.value)}
                        placeholder="Paste new 'AIza...' key here"
                        className="flex-1 bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:border-red-500/50 outline-none transition-colors font-mono text-sm"
                    />
                    <button 
                        onClick={handleSaveGeminiKey}
                        disabled={!newGeminiKey.trim() || keyLoading}
                        className="px-6 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-red-900/20"
                    >
                        <Save className="w-4 h-4" /> Save Key
                    </button>
                </div>
                <p className="text-xs text-slate-500">* Stored securely in Firestore (settings/global_config). Changes apply immediately.</p>
            </div>
        </div>
      )}

      {/* TAB 2: User Management */}
      {activeTab === 'users' && (
        <div className="glass-panel p-8 rounded-3xl border border-indigo-500/20 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                    <Users className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-200">Registered Souls</h3>
                    <p className="text-slate-500 text-sm">View users registered in the system.</p>
                </div>
            </div>
            <button onClick={refreshUsers} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
                <RefreshCw className="w-5 h-5 text-slate-400" />
            </button>
            </div>

            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Joined At</th>
                    <th className="p-4 text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="text-slate-300 text-sm">
                {users.length === 0 ? (
                    <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">No users found in the database.</td>
                    </tr>
                ) : (
                    users.map((u, idx) => (
                    <tr key={idx} className="border-b border-slate-800 hover:bg-white/5 transition-colors">
                        <td className="p-4 flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-500" /> {u.name}
                        </td>
                        <td className="p-4 font-mono text-xs text-slate-400">{u.email}</td>
                        <td className="p-4 text-slate-500">{u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : 'N/A'}</td>
                        <td className="p-4 text-right">
                        <button 
                            onClick={() => handleDeleteUser(u.email)}
                            className="p-2 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                            title="Delete User"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>
        </div>
      )}

      {/* TAB 3: Notifications */}
      {activeTab === 'notifications' && (
          <div className="glass-panel p-8 rounded-3xl border border-amber-500/20 animate-fade-in space-y-8">
              {/* Create Notification */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                        <Bell className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-200">Global Broadcast</h3>
                        <p className="text-slate-500 text-sm">Send alerts to all users instantly.</p>
                    </div>
                </div>

                <form onSubmit={handleSendNotification} className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Notification Title (e.g. System Maintenance)"
                        value={notifTitle}
                        onChange={(e) => setNotifTitle(e.target.value)}
                        className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:border-amber-500/50 outline-none transition-colors"
                        required
                    />
                    <textarea 
                        placeholder="Message content..."
                        value={notifMsg}
                        onChange={(e) => setNotifMsg(e.target.value)}
                        className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:border-amber-500/50 outline-none transition-colors"
                        rows={3}
                        required
                    />
                    <button 
                        type="submit"
                        className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" /> Send Broadcast
                    </button>
                </form>
              </div>

              {/* Active Notifications List */}
              <div className="border-t border-slate-700 pt-8">
                  <h4 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500"/> Active Alerts</h4>
                  <div className="space-y-3">
                      {notifications.length === 0 ? (
                          <p className="text-slate-500 italic">No active notifications.</p>
                      ) : (
                          notifications.map(n => (
                              <div key={n.id} className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl flex justify-between items-start">
                                  <div>
                                      <h5 className="font-bold text-amber-100">{n.title}</h5>
                                      <p className="text-sm text-slate-400">{n.message}</p>
                                      <p className="text-xs text-slate-600 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                                  </div>
                                  <button onClick={() => deleteNotification(n.id)} className="text-slate-500 hover:text-red-400">
                                      <Trash2 className="w-4 h-4" />
                                  </button>
                              </div>
                          ))
                      )}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};
