import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PartyPopper, Home as HomeIcon } from 'lucide-react';

export function PaymentSuccess() {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const confettiPieces = Array.from({ length: 40 });

  return (
    <div className="min-h-full bg-navy-800 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {confettiPieces.map((_, i) => {
            const colors = ['#F5A623', '#0B1F4B', '#22c55e', '#ffffff', '#FFD24D'];
            const color = colors[i % colors.length];
            const left = Math.random() * 100;
            const delay = Math.random() * 0.5;
            const duration = 2 + Math.random() * 2;
            return (
              <div
                key={i}
                className="absolute w-2 h-3 rounded-sm"
                style={{
                  left: `${left}%`,
                  top: '-10px',
                  backgroundColor: color,
                  animation: `confetti ${duration}s ease-out ${delay}s forwards`,
                }}
              />
            );
          })}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-accent-500 flex items-center justify-center mb-6 animate-scale-in">
          <PartyPopper size={36} className="text-navy-900" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Welcome to LejersNet!</h1>
        <p className="text-sm text-white/70 max-w-xs mb-8">
          Your membership is now active. You can start documenting your home and storing your rental documents right away.
        </p>

        <div className="bg-white/5 backdrop-blur rounded-2xl p-4 mb-8 w-full max-w-xs">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/60">Plan</span>
            <span className="text-white font-medium">LejersNet Membership</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/60">Price</span>
            <span className="text-white font-medium">DKK 49/month</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Renews</span>
            <span className="text-white font-medium">In 30 days</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/home', { replace: true })}
          className="w-full max-w-xs py-3.5 rounded-xl bg-accent-500 text-navy-900 font-semibold text-sm hover:bg-accent-400 transition-colors flex items-center justify-center gap-2"
        >
          <HomeIcon size={18} />
          Go to Home
        </button>
      </div>
    </div>
  );
}
