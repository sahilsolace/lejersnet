import { useNavigate } from 'react-router-dom';
import { Shield, Home, FileText, Camera, HeartHandshake, Lock } from 'lucide-react';

export function Welcome() {
  const navigate = useNavigate();

  const benefits = [
    { icon: FileText, text: 'Store your rental contract securely' },
    { icon: Camera, text: 'Upload photos at move-in' },
    { icon: Home, text: 'Keep all documents in one place' },
    { icon: HeartHandshake, text: 'Get help when in doubt' },
    { icon: Lock, text: 'Private member area' },
  ];

  return (
    <div className="min-h-screen bg-navy-800 flex flex-col">
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
            <Shield size={28} className="text-navy-800" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">LejersNet</h1>
            <p className="text-xs text-white/60">Denmark's tenant membership</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur rounded-2xl p-5 mb-6 border border-white/10">
          <h2 className="text-xl font-bold text-white leading-snug mb-2">
            Get control of your tenancy – from the day you move in to the day you move out.
          </h2>
          <p className="text-sm text-white/70 leading-relaxed">
            Store your rental contract, photos and important documents securely in one place. Get overview, peace of mind and help throughout your tenancy – for only DKK 49 per month.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-accent-400" />
                </div>
                <p className="text-sm text-white/90">{b.text}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-accent-500/10 border border-accent-500/20 rounded-xl p-3 mb-8 flex items-center gap-2">
          <Lock size={16} className="text-accent-400 flex-shrink-0" />
          <p className="text-xs text-white/80">
            Only you and LejersNet have access to your documents. Modern encryption protects your data.
          </p>
        </div>
      </div>

      <div className="px-6 pb-8 space-y-3 flex-shrink-0">
        <button
          onClick={() => navigate('/signup')}
          className="w-full py-3.5 rounded-xl bg-accent-500 text-navy-900 font-semibold text-sm hover:bg-accent-400 transition-colors"
        >
          Become a Member Now
        </button>
        <button
          onClick={() => navigate('/signin')}
          className="w-full py-3.5 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/5 transition-colors"
        >
          Sign In
        </button>
        <p className="text-center text-xs text-white/50 pt-1">
          DKK 49/month · No commitment · 14-day satisfaction guarantee
        </p>
      </div>
    </div>
  );
}
