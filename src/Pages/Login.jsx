import { useState, useEffect } from 'react';
import LoginForm from "../Components/Auth/LoginForm";
import DevSokoLogo from "../assets/DevSoko Logo.png";

const Login = ({ theme }) => {
  const darkMode = theme === 'dark';
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate animated code particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.5 + 0.2,
      code: ['function', 'const', 'let', '=>', '{', '}', 'class', 'export'][Math.floor(Math.random() * 9)]
    }));
    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles(particles => particles.map(p => ({
        ...p,
        y: p.y + p.speed,
        opacity: Math.max(0, p.opacity - 0.01),
      })).filter(p => p.y < 110 && p.opacity > 0));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
      darkMode ? 'dark bg-gradient-to-br from-slate-900 via-slate-950 to-[#020617]' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'
    }`}>
      {/* Animated code particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute font-mono text-xs font-bold transition-all duration-100 animate-float"
            style={{
              left: `${particle.x}vw`,
              top: `${particle.y}vh`,
              fontSize: `${particle.size}px`,
              opacity: particle.opacity,
              color: darkMode ? '#60A5FA' : '#3B82F6',
            }}
          >
            {particle.code}
          </div>
        ))}
      </div>

      {/* Floating orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-primary-400/20 to-orange-400/20 rounded-full blur-3xl animate-float delay-1000"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-primary-400/20 rounded-full blur-3xl animate-float delay-2000"></div>
      <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-gradient-to-r from-slate-700/20 to-slate-600/20 rounded-full blur-2xl animate-pulse"></div>


      {/* Main content */}
      <div className="min-h-screen flex items-center justify-center p-4 lg:p-8 relative z-10">
        <div className={`max-w-md w-full space-y-8 transition-all duration-700 ${
          darkMode ? 'bg-slate-800/90 backdrop-blur-3xl border border-slate-700/50 shadow-2xl' : 'bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl'
        } rounded-3xl p-10`}>
          <div className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 flex items-center justify-center shadow-2xl animate-glow">
              <img src={DevSokoLogo} alt="DevSoko Logo" className="h-20 w-20 rounded-full object-contain drop-shadow-lg" />
            </div>
            <div className="space-y-2">
              <h1 className={`text-4xl font-black bg-gradient-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent ${
                darkMode ? 'drop-shadow-lg' : ''
              }`}>
                DevSoko
              </h1>
              <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-400'}`}>
                Convert Code into Coins.
              </p>
            </div>
          </div>
          <LoginForm darkMode={darkMode} />
          <div className="pt-8 border-t border-slate-200/50 dark:border-slate-700/50">
            <p className={`text-xs text-center ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              © 2026 DevSoko. Built for creators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
