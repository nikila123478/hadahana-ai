
import React, { useState } from 'react';
import { HoroscopeData, Translation, Language } from '../types';
import { getHoroscopeReading } from '../services/gemini';
import { Calendar, Clock, MapPin, Sparkles, Loader2 } from 'lucide-react';

interface Props {
  t: Translation;
  lang: Language;
}

const HoroscopeSection: React.FC<Props> = ({ t, lang }) => {
  const [data, setData] = useState<HoroscopeData>({ dob: '', tob: '', pob: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.dob || !data.tob || !data.pob) return;
    setLoading(true);
    setResult(null);
    try {
      const reading = await getHoroscopeReading(data, lang);
      setResult(reading);
    } catch (error) {
      setResult("The stars are clouded right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-mystical font-bold text-indigo-300 mb-4">{t.horoscopeTitle}</h2>
        <p className="text-slate-400">{t.horoscopeDesc}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl border-white/5 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {t.birthDate}
            </label>
            <input
              type="date"
              value={data.dob}
              onChange={(e) => setData({ ...data, dob: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Clock className="w-4 h-4" /> {t.birthTime}
            </label>
            <input
              type="time"
              value={data.tob}
              onChange={(e) => setData({ ...data, tob: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {t.birthPlace}
            </label>
            <input
              type="text"
              placeholder="City, Country"
              value={data.pob}
              onChange={(e) => setData({ ...data, pob: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t.loading}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                {t.generateReading}
              </>
            )}
          </button>
        </form>

        <div className="min-h-[400px] flex flex-col">
          {result ? (
            <div className="glass p-8 rounded-3xl border-indigo-500/20 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-500/20 rounded-2xl">
                  <Sparkles className="w-6 h-6 text-indigo-300" />
                </div>
                <h3 className="text-2xl font-mystical text-white">{t.results}</h3>
              </div>
              <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-line leading-relaxed">
                {result}
              </div>
            </div>
          ) : (
            <div className="flex-1 glass rounded-3xl border-dashed border-2 border-slate-800 flex flex-col items-center justify-center p-12 text-center text-slate-600">
              <Calendar className="w-16 h-16 mb-4 opacity-20" />
              <p>Enter your birth details to reveal your cosmic signature.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HoroscopeSection;
