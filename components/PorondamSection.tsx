
import React, { useState } from 'react';
import { PorondamData, Translation, Language } from '../types';
import { getPorondamReading } from '../services/gemini';
import { Heart, Loader2, Sparkles, User, Users } from 'lucide-react';

interface Props {
  t: Translation;
  lang: Language;
}

const PorondamSection: React.FC<Props> = ({ t, lang }) => {
  const [data, setData] = useState<PorondamData>({
    groomName: '',
    groomNakshatra: '',
    brideName: '',
    brideNakshatra: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const nakshatras = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
    "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const reading = await getPorondamReading(data, lang);
      setResult(reading);
    } catch (error) {
      setResult("Alignment could not be calculated. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-mystical font-bold text-purple-300 mb-4">{t.porondamTitle}</h2>
        <p className="text-slate-400">{t.porondamDesc}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl border-white/5 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-300 font-mystical uppercase tracking-wider text-sm border-b border-indigo-500/20 pb-2">
                <User className="w-4 h-4" /> {t.groomName}
              </div>
              <input
                type="text"
                placeholder="Groom Name"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                value={data.groomName}
                onChange={(e) => setData({ ...data, groomName: e.target.value })}
                required
              />
              <select
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                value={data.groomNakshatra}
                onChange={(e) => setData({ ...data, groomNakshatra: e.target.value })}
                required
              >
                <option value="">Select Nakshatra</option>
                {nakshatras.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-purple-300 font-mystical uppercase tracking-wider text-sm border-b border-purple-500/20 pb-2">
                <User className="w-4 h-4" /> {t.brideName}
              </div>
              <input
                type="text"
                placeholder="Bride Name"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                value={data.brideName}
                onChange={(e) => setData({ ...data, brideName: e.target.value })}
                required
              />
              <select
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                value={data.brideNakshatra}
                onChange={(e) => setData({ ...data, brideNakshatra: e.target.value })}
                required
              >
                <option value="">Select Nakshatra</option>
                {nakshatras.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:bg-slate-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-purple-900/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t.loading}
              </>
            ) : (
              <>
                <Heart className="w-5 h-5" />
                {t.matchCompatibility}
              </>
            )}
          </button>
        </form>

        <div className="min-h-[400px]">
          {result ? (
            <div className="glass p-8 rounded-3xl border-purple-500/20 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-500/20 rounded-2xl">
                  <Heart className="w-6 h-6 text-purple-300" />
                </div>
                <h3 className="text-2xl font-mystical text-white">Matching Insight</h3>
              </div>
              <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-line leading-relaxed">
                {result}
              </div>
            </div>
          ) : (
            <div className="flex-1 h-full min-h-[400px] glass rounded-3xl border-dashed border-2 border-slate-800 flex flex-col items-center justify-center p-12 text-center text-slate-600">
              <Users className="w-16 h-16 mb-4 opacity-20" />
              <p>Match the groom and bride's energies for a harmonic union.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PorondamSection;
