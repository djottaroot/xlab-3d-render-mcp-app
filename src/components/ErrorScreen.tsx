import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ErrorScreenProps {
  message: string;
  theme: 'dark' | 'light';
  onRetry: () => void;
}

export function ErrorScreen({ message, theme, onRetry }: ErrorScreenProps) {
  const { t } = useTranslation('common');
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-transparent text-white p-8 animate-in fade-in duration-700">
      <div className={`p-8 rounded-5xl flex flex-col items-center gap-6 max-w-sm text-center shadow-2xl border ${theme === 'dark' ? 'glass-effect border-red-500/20' : 'glass-effect-light border-red-500/10'}`}>
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
          <AlertCircle size={32} />
        </div>
        <div className="space-y-2">
          <h1 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{t('mcp_error')}</h1>
          <p className="text-zinc-400 font-medium text-sm leading-relaxed lowercase">{message}</p>
        </div>
        <button
          onClick={onRetry}
          className={`px-8 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-105 ${theme === 'dark' ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300'}`}
        >
          {t('retry')}
        </button>
      </div>
    </div>
  );
}
