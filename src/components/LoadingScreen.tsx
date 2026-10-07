import { Loader2 } from 'lucide-react';

export function LoadingScreen({ message = 'Loading…' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-brand-light px-8">
      <div className="w-16 h-16 rounded-2xl bg-navy-800 flex items-center justify-center mb-6 shadow-card">
        <Loader2 size={32} className="text-white animate-spin" />
      </div>
      <p className="text-sm text-gray-500 font-medium">{message}</p>
    </div>
  );
}

export function FullPageLoader({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-navy-800 px-8">
      <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-6" />
      <p className="text-sm text-white/80 font-medium">{message}</p>
    </div>
  );
}
