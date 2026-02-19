import { Loader } from "lucide-react";

interface LoadingScreenProps {
  theme: 'dark' | 'light';
  label: string;
}

export function LoadingScreen({ theme, label }: LoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-transparent text-white animate-in fade-in duration-1000">
      <div className="relative flex items-center justify-center">
        <Loader className={`w-4 h-4 animate-spin ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-300'}`} />
        <div className={`absolute inset-0 w-12 h-12 rounded-full border-t-2 animate-spin duration-700 ${theme === 'dark' ? 'border-white' : 'border-zinc-900'}`}></div>
      </div>
      <p className={`mt-6 font-black uppercase tracking-[0.3em] text-[10px] ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>{label}</p>
    </div>
  );
}
