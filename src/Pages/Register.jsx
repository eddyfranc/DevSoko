import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  Check,
  Code2,
  Zap,
  Users,
  Star
} from "lucide-react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Save user role & email to Supabase users table
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email,
          role,
        });

      if (insertError) throw insertError;

      console.log(" User registered and saved to Supabase.");
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration failed:", err.message);
      setError(err.message);
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Left Side - Dark Terminal Theme */}
      <div className="w-1/2 relative overflow-hidden bg-slate-950 dark:bg-[#0d1117]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Floating Terminal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[320px] bg-slate-950/95 dark:bg-black/80 backdrop-blur-sm rounded-xl border border-slate-700/50 dark:border-slate-600/50 shadow-2xl"
        >
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 rounded-t-xl border-b border-gray-700/50">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-gray-400 text-sm font-mono">devsoko-terminal</div>
            <div className="w-16"></div>
          </div>

          {/* Terminal Content */}
          <div className="p-6 font-mono text-sm">
            <div className="text-green-400 mb-2">$ DevSoko --init</div>
            <div className="text-gray-300 mb-4">
              <span className="text-blue-400">import</span> React <span className="text-blue-400">from</span> <span className="text-yellow-400">'react'</span>;
            </div>
            <div className="text-gray-300 mb-4">
              <span className="text-blue-400">import</span> &#123; useState, useEffect &#125; <span className="text-blue-400">from</span> <span className="text-yellow-400">'react'</span>;
            </div>
            <div className="text-gray-300 mb-4">
              <span className="text-purple-400">const</span> <span className="text-cyan-400">DevSoko</span> = () =&gt; &#123;
            </div>
            <div className="text-gray-300 mb-4 ml-4">
              <span className="text-blue-400">const</span> [projects, setProjects] = <span className="text-cyan-400">useState</span>([]);
            </div>
            <div className="text-gray-300 mb-4 ml-4">
              <span className="text-blue-400">const</span> [loading, setLoading] = <span className="text-cyan-400">useState</span>(<span className="text-orange-400">true</span>);
            </div>
            <div className="text-gray-300 mb-4">
              &#125;;
            </div>
            <div className="text-green-400">$ npm run build</div>
            <div className="text-green-400">✓ Compiled successfully</div>
            <div className="text-green-400 animate-pulse">$ _</div>
          </div>
        </motion.div>

        {/* Tech Icons */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute top-16 left-16 flex space-x-6"
        >
          <div className="w-12 h-12 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-blue-500/30 dark:border-blue-500/40">
            <Code2 className="w-6 h-6 text-blue-400" />
          </div>
          <div className="w-12 h-12 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-yellow-500/30 dark:border-yellow-500/40">
            <Zap className="w-6 h-6 text-yellow-400" />
          </div>
        </motion.div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute bottom-16 left-16 space-y-4"
        >
          <div className="flex items-center space-x-3 text-gray-300">
            <Users className="w-5 h-5 text-green-400" />
            <span className="text-sm">1000+ Developers</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-300">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-sm">5000+ Projects</span>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Clean White Form */}
      <div className="w-1/2 bg-white dark:bg-slate-950 flex items-center justify-center p-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="w-full max-w-md space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-['Inter']">Join DevSoko</h1>
            <p className="text-gray-600 dark:text-slate-400 text-sm">Connect with developers worldwide</p>
          </motion.div>

          {/* Google Sign Up */}
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

          {/* OR Divider */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 py-4">
            <div className="flex-1 h-[1px] bg-gray-200 dark:bg-slate-700"></div>
            <span className="text-gray-500 dark:text-slate-400 text-sm font-medium">OR</span>
            <div className="flex-1 h-[1px] bg-gray-200 dark:bg-slate-700"></div>
          </motion.div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Email Field */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-slate-400" htmlFor="email">
                Email Address
              </label>
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

            {/* Password Field */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-slate-400" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="8"
                required
              />
              <p className="text-xs text-gray-500">Minimum 8 characters</p>
            </motion.div>

            {/* Role Selection */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-slate-400" htmlFor="role">
                Account Type
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-slate-100"
                required
              >
                <option value="buyer">Buyer - Hire developers</option>
                <option value="seller">Seller - Offer services</option>
              </select>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-600 rounded-lg flex items-start gap-3 text-red-600 dark:text-red-300 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-green-50 dark:bg-emerald-950/40 border border-green-200 dark:border-emerald-600 rounded-lg flex items-start gap-3 text-green-600 dark:text-emerald-300 text-sm"
              >
                <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Registration successful! Check your email to verify. Redirecting...</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading || success}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : success ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Account Created!</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </motion.button>
          </form>

          {/* Sign In Link */}
          <motion.div variants={itemVariants} className="text-center pt-4">
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Already have an account?{" "}
              <a href="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                Sign in
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
