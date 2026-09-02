import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle
} from "lucide-react";
import { ensureGoogleUserProfile, getDashboardPath, hasPendingGoogleAuthCallback, startGoogleOAuth } from "../../utils/googleAuth";
import { resolveUserRole } from "../../lib/supabaseMarketplace";

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
    setError("");
    try {
      await startGoogleOAuth({ redirectPath: "/login" });
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed. Please try with your email.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const completeGoogleLogin = async () => {
      if (!hasPendingGoogleAuthCallback()) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const result = await ensureGoogleUserProfile({ defaultRole: "buyer" });

        if (!cancelled && result?.role) {
          navigate(getDashboardPath(result.role), { replace: true });
        }
      } catch (err) {
        console.error("Google session completion error:", err);
        if (!cancelled) {
          setError(err.message || "Google login failed. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    completeGoogleLogin();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const redirectByRole = async (user) => {
    const userRole = await resolveUserRole(user);

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
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }} className="w-full space-y-7">
      <motion.button
        variants={itemVariants}
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex h-12 items-center justify-center space-x-3 border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-slate-100 transition-all active:scale-[0.98] rounded-lg shadow-sm"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
        </svg>
        <span>Continue with Google</span>
      </motion.button>

      <motion.div variants={itemVariants} className="flex items-center gap-4 py-1">
        <div className="flex-1 h-[1px] bg-gray-200 dark:bg-slate-700"></div>
        <span className="text-gray-500 dark:text-slate-400 text-sm font-medium">OR</span>
        <div className="flex-1 h-[1px] bg-gray-200 dark:bg-slate-700"></div>
      </motion.div>

      <form onSubmit={handleEmailLogin} className="space-y-6">
        <motion.div variants={itemVariants} className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-slate-400" htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="name@company.com"
            className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-slate-400" htmlFor="password">Password</label>
            <button type="button" className="text-xs font-semibold text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors">Forgot?</button>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-600 rounded-lg flex items-start gap-3 text-red-600 dark:text-red-300 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.button variants={itemVariants} type="submit" disabled={loading} className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Sign In</span>}
        </motion.button>
      </form>

      <motion.div variants={itemVariants} className="pt-4 border-t border-gray-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-gray-600 dark:text-slate-400 text-sm">New here? <a href="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">Create account</a></p>
          <p className="text-[11px] text-gray-500 dark:text-slate-400">Admin accounts sign in here and redirect to admin dashboard automatically.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-2 rounded text-[11px]">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Test Mode</span>
          <button onClick={demoLogin} className="font-semibold text-gray-700 dark:text-slate-200 hover:underline">demo@devsoko.com</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;
