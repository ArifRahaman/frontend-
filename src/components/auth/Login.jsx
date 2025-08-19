import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../AuthContext";

export default function Login() {
  const BASE = import.meta.env.VITE_API_BASE || "https://backend-project-h96z.onrender.com";
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE}/api/auth/login`, { email, password });

      if (res.data?.user && res.data?.token) {
        login(res.data.user, res.data.token);
        toast.success("✅ Logged in successfully!");
        setTimeout(() => (window.location.href = "/"), 500);
      } else {
        throw new Error("Invalid server response");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        "Something went wrong. Please try again.";
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 blur-xl"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full opacity-10 blur-xl"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
      />
      <motion.div
        className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-10 blur-xl"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 4 }}
      />

      <motion.div
        className="w-full max-w-md relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Glassmorphism Card */}
        <motion.div
          className="backdrop-blur-xl bg-white/80 border border-white/20 shadow-2xl rounded-3xl p-8 relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
          
          {/* Header */}
          <motion.div
            className="text-center mb-8 relative z-10"
            variants={itemVariants}
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-2">Sign in to continue your journey</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <motion.div
                className={`relative group ${
                  focusedField === 'email' ? 'scale-105' : ''
                }`}
                animate={{ scale: focusedField === 'email' ? 1.02 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`w-5 h-5 transition-colors duration-200 ${
                    focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 pointer-events-none"
                  animate={{ opacity: focusedField === 'email' ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <motion.div
                className={`relative group ${
                  focusedField === 'password' ? 'scale-105' : ''
                }`}
                animate={{ scale: focusedField === 'password' ? 1.02 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`w-5 h-5 transition-colors duration-200 ${
                    focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                <motion.button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence mode="wait">
                    {showPassword ? (
                      <motion.div
                        key="eye-off"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="eye"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 pointer-events-none"
                  animate={{ opacity: focusedField === 'password' ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                className="w-full relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                disabled={loading}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                />
                <div className="relative flex items-center justify-center space-x-2">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center space-x-2"
                      >
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Signing in...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="signin"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center space-x-2"
                      >
                        <span>Sign In</span>
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            </motion.div>

            {/* Footer */}
            <motion.div
              variants={itemVariants}
              className="text-center pt-4"
            >
              <p className="text-gray-500 text-sm">
                Don't have an account?{" "}
                <motion.a
                  href="/signup"
                  className="text-blue-500 hover:text-blue-600 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create one now
                </motion.a>
              </p>
            </motion.div>
          </form>
        </motion.div>

        {/* Floating Action Hint */}
        <motion.div
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.div
            className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-sm text-gray-600"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ✨ Secure & Fast Login
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
