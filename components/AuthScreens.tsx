
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Lock, Mail, User, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';

export const LoginScreen: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      // Login successful - The AuthContext user state will update and close the modal automatically via App.tsx
    } catch (err: any) {
      console.error("Login Failed:", err);
      // specific error handling
      if (err.code === 'auth/invalid-credential') {
        setError('Incorrect password or email.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Try again later.');
      } else {
        setError(err.message || 'Login failed. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in-up">
      <div className="glass-panel p-8 rounded-3xl border border-amber-500/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-amber-100">Welcome Back</h2>
          <p className="text-amber-500/60 text-sm uppercase tracking-widest mt-2">Enter the Cosmic Realm</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:border-amber-500/50 outline-none transition-colors"
                placeholder="seeker@universe.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-slate-700 rounded-xl py-3 pl-10 pr-10 text-slate-200 focus:border-amber-500/50 outline-none transition-colors"
                placeholder="••••••••"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-500 hover:text-amber-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3.5 rounded-xl uppercase tracking-widest shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Login <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            New to Hadahana AI?{' '}
            <button onClick={onSwitch} className="text-amber-400 hover:text-amber-300 font-bold hover:underline transition-all">
              Create an Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export const SignupScreen: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signup(name, email, password);
      // Signup successful
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already registered.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Signup failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in-up">
      <div className="glass-panel p-8 rounded-3xl border border-indigo-500/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-indigo-100">Join the Circle</h2>
          <p className="text-indigo-400/70 text-sm uppercase tracking-widest mt-2">Begin Your Spiritual Journey</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:border-indigo-500/50 outline-none transition-colors"
                placeholder="Your Name"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:border-indigo-500/50 outline-none transition-colors"
                placeholder="seeker@universe.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:border-indigo-500/50 outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl uppercase tracking-widest shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign Up <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <button onClick={onSwitch} className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline transition-all">
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
