import { useLanguage } from '@/contexts/LanguageContext';
import { Languages } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative inline-flex items-center bg-white/60 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/20">
      <div 
        className={`absolute top-1 bottom-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg transition-all duration-500 ease-out shadow-md ${
          language === 'en' ? 'left-1 w-[50px]' : 'left-[55px] w-[50px]'
        }`}
      />
      <button
        onClick={() => setLanguage('en')}
        className={`relative z-10 flex items-center justify-center w-[50px] h-8 rounded-lg text-xs font-semibold transition-all duration-300 ${
          language === 'en' ? 'text-white' : 'text-slate-600 hover:text-slate-800'
        }`}
      >
        <Languages className="h-3 w-3 mr-1" />
        EN
      </button>
      <button
        onClick={() => setLanguage('mr')}
        className={`relative z-10 flex items-center justify-center w-[50px] h-8 rounded-lg text-xs font-semibold transition-all duration-300 ${
          language === 'mr' ? 'text-white' : 'text-slate-600 hover:text-slate-800'
        }`}
      >
        <Languages className="h-3 w-3 mr-1" />
        मर
      </button>
    </div>
  );
};

export default LanguageSwitcher;