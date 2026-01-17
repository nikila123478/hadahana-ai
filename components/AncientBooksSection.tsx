
import React, { useState, useRef } from 'react';
import { Translation, Language } from '../types';
import { analyzeAncientManuscript } from '../services/gemini';
import { Book, Image as ImageIcon, Loader2, Search, FileText } from 'lucide-react';

interface Props {
  t: Translation;
  lang: Language;
}

const AncientBooksSection: React.FC<Props> = ({ t, lang }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    try {
      const analysis = await analyzeAncientManuscript(image, lang);
      setResult(analysis);
    } catch (error) {
      setResult("Ancient wisdom remains hidden. Try a clearer image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-mystical font-bold text-amber-200 mb-4">{t.ancientBooksTitle}</h2>
        <p className="text-slate-400">{t.ancientBooksDesc}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative h-80 glass rounded-3xl border-2 border-dashed border-slate-700 hover:border-amber-500/50 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden"
          >
            {image ? (
              <img src={image} alt="Manuscript" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-slate-500 group-hover:text-amber-300 mb-4 transition-colors" />
                <p className="text-slate-500 font-medium group-hover:text-amber-200">{t.uploadAncientBook}</p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!image || loading}
            className="w-full bg-amber-700 hover:bg-amber-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t.loading}
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                {t.analyzeBook}
              </>
            )}
          </button>
        </div>

        <div className="min-h-[400px]">
          {result ? (
            <div className="glass p-8 rounded-3xl border-amber-500/20 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-500/20 rounded-2xl">
                  <FileText className="w-6 h-6 text-amber-300" />
                </div>
                <h3 className="text-2xl font-mystical text-white">Manuscript Insight</h3>
              </div>
              <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-line leading-relaxed italic">
                "{result}"
              </div>
            </div>
          ) : (
            <div className="flex-1 h-full min-h-[400px] glass rounded-3xl border-dashed border-2 border-slate-800 flex flex-col items-center justify-center p-12 text-center text-slate-600">
              <Book className="w-16 h-16 mb-4 opacity-20" />
              <p>Upload a photograph of an Ola leaf or ancient text to decipher its contents.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AncientBooksSection;
