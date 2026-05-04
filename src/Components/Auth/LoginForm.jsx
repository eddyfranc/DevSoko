import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle
} from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data?.user && !data.user.email_confirmed_at) {
        await supabase.auth.signOut();
        setError("Please verify your email before logging in.");
        return;
      }
      
      if (data?.user) {
        await redirectByRole(data.user);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid credentials. Try our demo login below.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed. Please try with your email.");
    } finally {
      setLoading(false);
    }
  };

  const redirectByRole = async (user) => {
    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const userRole = data?.role || "buyer";

    if (userRole === "admin") navigate("/admin-dashboard");
    else if (userRole === "seller") navigate("/seller-dashboard");
    else if (userRole === "buyer") navigate("/buyer-dashboard");
    else navigate("/dashboard");
  };

  const demoLogin = () => {
    setEmail("demo@devsoko.com");
    setPassword("demo123");
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.05 } }
      }}
      className="w-full space-y-8"
    >
      <form onSubmit={handleEmailLogin} className="space-y-12">
        {/* Email Field */}
        <motion.div variants={itemVariants} className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#888]" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              className="flex h-12 w-full border-b-2 border-slate-500/50 bg-transparent px-0 py-2 text-slate-200 dark:text-slate-300 text-base font-medium placeholder:text-slate-400 focus:outline-none focus:border-primary-500 transition-colors duration-300 disabled:opacity-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </motion.div>

        {/* Password Field */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#888]" htmlFor="password">
              Password
            </label>
            <button type="button" className="text-[10px] uppercase font-bold text-[#888] hover:text-[#0A0A0A] transition-colors tracking-widest">
              Forgot?
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="flex h-12 w-full border-b-2 border-slate-500/50 bg-transparent px-0 py-2 text-slate-200 dark:text-slate-300 text-base font-medium placeholder:text-slate-400 focus:outline-none focus:border-primary-500 transition-colors duration-300 disabled:opacity-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#0A0A0A] transition-colors p-2"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 bg-red-50 border-l-4 border-red-500 flex items-start gap-3 text-red-600 text-xs font-bold uppercase tracking-wider"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

          <motion.button
          variants={itemVariants}
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white font-black uppercase tracking-[0.1em] text-sm active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl rounded-xl"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span>Enter Workspace</span>
          )}
        </motion.button>
      </form>

      <motion.div variants={itemVariants} className="flex items-center gap-4 py-4">
        <div className="flex-1 h-[1px] bg-[#D1D1D1]"></div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OR</span>
        <div className="flex-1 h-[1px] bg-[#D1D1D1]"></div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex h-12 items-center justify-center space-x-3 border border-slate-500/50 hover:border-primary-400 bg-slate-800/50 backdrop-blur-sm px-4 py-2 text-sm font-bold text-slate-200 uppercase tracking-wider hover:bg-slate-700/50 transition-all active:scale-[0.99] rounded-lg"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
          </svg>
          <span>Continue with Google</span>
        </button>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="pt-12 mt-12 border-t border-[#D1D1D1] flex flex-wrap items-center justify-between gap-4"
      >
        <p className="text-[13px] text-slate-500">
          New here?{" "}
          <a href="/register" className="font-bold text-[#0A0A0A] underline underline-offset-4">
            Register
          </a>
        </p>
        <div className="flex items-center gap-3 bg-white border border-[#D1D1D1] p-2 rounded text-[11px]">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Test Mode</span>
          <button 
            onClick={demoLogin}
            className="font-bold text-[#0A0A0A] hover:underline"
          >
            demo@devsoko.com
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;
