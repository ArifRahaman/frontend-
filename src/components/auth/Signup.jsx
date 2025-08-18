// import React, { useState } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { toast } from "react-toastify";
// import clsx from "clsx";

// /* ---------- validation schemas ---------- */
// const step1Schema = yup
//   .object({
//     username: yup.string().required("Username is required").min(3, "Minimum 3 chars"),
//     email: yup.string().required("Email is required").email("Enter a valid email"),
//     password: yup
//       .string()
//       .required("Password is required")
//       .min(8, "Password must be at least 8 characters")
//       .matches(/[A-Z]/, "Include at least one uppercase letter")
//       .matches(/[0-9]/, "Include at least one number")
//       .matches(/[@$!%*?&#^\-_=+]/, "Include at least one special character"),
//   })
//   .required();

// const step2Schema = yup
//   .object({
//     bio: yup.string().max(200, "Bio can't exceed 200 characters").nullable(),
//     // avatar is a file input — keep validation minimal here
//     avatar: yup.mixed().nullable(),
//   })
//   .required();

// /* ---------- utils ---------- */
// const strengthLabel = (pwd) => {
//   if (!pwd) return { score: 0, label: "Empty", color: "bg-gray-200" };
//   let score = 0;
//   if (pwd.length >= 8) score++;
//   if (/[A-Z]/.test(pwd)) score++;
//   if (/[0-9]/.test(pwd)) score++;
//   if (/[@$!%*?&#^\-_=+]/.test(pwd)) score++;
//   const label = ["Very weak", "Weak", "Fair", "Good", "Strong"][score];
//   const color = ["bg-red-400", "bg-orange-400", "bg-yellow-300", "bg-emerald-300", "bg-emerald-500"][score];
//   return { score, label, color };
// };

// /* ---------- component ---------- */
// const Signup = () => {
//   const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [showPwd, setShowPwd] = useState(false);
//   const [formData, setFormData] = useState({});

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(step === 1 ? step1Schema : step2Schema),
//     mode: "onTouched",
//   });

//   const pwdValue = watch("password", "");
//   const strength = strengthLabel(pwdValue);

//   const handleStep1 = (values) => {
//     setFormData((prev) => ({ ...prev, ...values }));
//     setStep(2);
//   };

//   const handleStep2 = async (values) => {
//     // values.avatar is a FileList (if a file was chosen)
//     const final = { ...formData, ...values };
//     setLoading(true);

//     try {
//       // Build FormData for multipart upload
//       const fd = new FormData();
//       fd.append("username", final.username);
//       fd.append("email", final.email);
//       fd.append("password", final.password);

//       if (final.bio) fd.append("bio", final.bio);

//       // avatar field: use first file if provided
//       if (values.avatar && values.avatar.length > 0) {
//         fd.append("avatar", values.avatar[0]); // backend must accept field name 'avatar'
//       }

//       // axios will set correct multipart headers automatically
//       const res = await axios.post(`${BASE}/api/auth/signup`, fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//         onUploadProgress: (progressEvent) => {
//           // optional: show progress
//           // const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           // console.log("upload:", pct);
//         },
//       });

//       if (res.status >= 200 && res.status < 300) {
//         const data = res.data;
//         if (data.token) localStorage.setItem("token", data.token);
//         if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
//         toast.success("Signup successful — you are logged in.");
//         setFormData({});
//         setStep(1);
//       } else {
//         toast.error(res.data?.error || res.data?.message || "Signup failed");
//       }
//     } catch (err) {
//       const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Something went wrong";
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
//       <motion.div
//         initial={{ opacity: 0, y: 10, scale: 0.98 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         transition={{ duration: 0.35 }}
//         className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8"
//       >
//         <h2 className="text-2xl font-semibold text-slate-800 mb-1">Create account</h2>
//         <p className="text-sm text-slate-500 mb-6">Join us — it's quick and easy.</p>

//         <AnimatePresence mode="wait">
//           {step === 1 && (
//             <motion.form
//               key="step1"
//               onSubmit={handleSubmit(handleStep1)}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: 20 }}
//               transition={{ duration: 0.3 }}
//               className="space-y-4"
//             >
//               {/* Username */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="username">
//                   Username
//                 </label>
//                 <input
//                   id="username"
//                   type="text"
//                   {...register("username")}
//                   className={clsx(
//                     "w-full rounded-lg border px-3 py-2 text-sm transition",
//                     errors.username ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-400",
//                     "focus:outline-none focus:ring-1 focus:ring-indigo-200"
//                   )}
//                 />
//                 {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
//                   Email
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   {...register("email")}
//                   className={clsx(
//                     "w-full rounded-lg border px-3 py-2 text-sm transition",
//                     errors.email ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-400",
//                     "focus:outline-none focus:ring-1 focus:ring-indigo-200"
//                   )}
//                 />
//                 {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="password"
//                     type={showPwd ? "text" : "password"}
//                     {...register("password")}
//                     className={clsx(
//                       "w-full rounded-lg border px-3 py-2 text-sm transition pr-10",
//                       errors.password ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-400",
//                       "focus:outline-none focus:ring-1 focus:ring-indigo-200"
//                     )}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPwd((p) => !p)}
//                     className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700"
//                   >
//                     {showPwd ? "Hide" : "Show"}
//                   </button>
//                 </div>
//                 {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}

//                 {/* Strength bar */}
//                 <div className="mt-2">
//                   <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
//                     <span>Password strength</span>
//                     <span className="font-medium text-slate-700">{strength.label}</span>
//                   </div>
//                   <div className="w-full h-2 rounded bg-gray-100 overflow-hidden">
//                     <motion.div
//                       initial={{ width: 0 }}
//                       animate={{ width: `${(strength.score / 4) * 100}%` }}
//                       transition={{ duration: 0.3 }}
//                       className={clsx("h-full", strength.color)}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Next Button */}
//               <div>
//                 <motion.button
//                   whileTap={{ scale: 0.98 }}
//                   whileHover={{ scale: 1.02 }}
//                   type="submit"
//                   className="w-full rounded-lg px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
//                 >
//                   Next
//                 </motion.button>
//               </div>
//             </motion.form>
//           )}

//           {step === 2 && (
//             <motion.form
//               key="step2"
//               onSubmit={handleSubmit(handleStep2)}
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               transition={{ duration: 0.3 }}
//               className="space-y-4"
//             >
//               {/* Avatar file input */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="avatar">
//                   Avatar (image file)
//                 </label>
//                 <input
//                   id="avatar"
//                   type="file"
//                   accept="image/*"
//                   {...register("avatar")}
//                   className={clsx(
//                     "w-full rounded-lg border px-3 py-2 text-sm transition",
//                     errors.avatar ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-400",
//                     "focus:outline-none focus:ring-1 focus:ring-indigo-200"
//                   )}
//                 />
//                 {errors.avatar && <p className="mt-1 text-xs text-red-500">{errors.avatar.message}</p>}
//               </div>

//               {/* Bio */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="bio">
//                   Bio
//                 </label>
//                 <textarea
//                   id="bio"
//                   rows="3"
//                   {...register("bio")}
//                   className={clsx(
//                     "w-full rounded-lg border px-3 py-2 text-sm transition",
//                     errors.bio ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-400",
//                     "focus:outline-none focus:ring-1 focus:ring-indigo-200"
//                   )}
//                 ></textarea>
//                 {errors.bio && <p className="mt-1 text-xs text-red-500">{errors.bio.message}</p>}
//               </div>

//               {/* Buttons */}
//               <div className="flex gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setStep(1)}
//                   className="flex-1 rounded-lg border px-4 py-2 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50"
//                 >
//                   Back
//                 </button>
//                 <motion.button
//                   whileTap={{ scale: 0.98 }}
//                   whileHover={{ scale: 1.02 }}
//                   type="submit"
//                   disabled={loading}
//                   className={clsx(
//                     "flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow",
//                     loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
//                   )}
//                 >
//                   {loading ? "Signing up..." : "Finish"}
//                 </motion.button>
//               </div>
//             </motion.form>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     </div>
//   );
// };

// export default Signup;


import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import clsx from "clsx";

/* ---------- validation schemas ---------- */
const step1Schema = yup
  .object({
    username: yup.string().required("Username is required").min(3, "Minimum 3 chars"),
    email: yup.string().required("Email is required").email("Enter a valid email"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Include at least one uppercase letter")
      .matches(/[0-9]/, "Include at least one number")
      .matches(/[@$!%*?&#^\-_=+]/, "Include at least one special character"),
  })
  .required();

const step2Schema = yup
  .object({
    bio: yup.string().max(200, "Bio can't exceed 200 characters").nullable(),
    avatarUrl: yup.string().url("Enter a valid URL").nullable(),
  })
  .required();

/* ---------- utils ---------- */
const strengthLabel = (pwd) => {
  if (!pwd) return { score: 0, label: "Empty", color: "bg-gray-200" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[@$!%*?&#^\-_=+]/.test(pwd)) score++;
  const label = ["Very weak", "Weak", "Fair", "Good", "Strong"][score];
  const color = ["bg-red-400", "bg-orange-400", "bg-yellow-300", "bg-emerald-300", "bg-emerald-500"][score];
  return { score, label, color };
};

/* ---------- component ---------- */
const Signup = () => {
  const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState({});

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(step === 1 ? step1Schema : step2Schema),
    mode: "onTouched",
  });

  const pwdValue = watch("password", "");
  const strength = strengthLabel(pwdValue);

  const handleStep1 = (values) => {
    setFormData((prev) => ({ ...prev, ...values }));
    setStep(2);
  };

  const handleStep2 = async (values) => {
    // values.avatarUrl is a simple string (or undefined)
    const final = { ...formData, ...values };
    setLoading(true);

    try {
      // Send JSON (simple) — backend should accept JSON signup
      const payload = {
        username: final.username,
        email: final.email,
        password: final.password,
        bio: final.bio || undefined,
        avatarUrl: final.avatarUrl || undefined, // plain URL
      };

      const res = await axios.post(`${BASE}/api/auth/signup`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status >= 200 && res.status < 300) {
        const data = res.data;
        if (data.token) localStorage.setItem("token", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Signup successful — you are logged in.");
        setFormData({});
        reset(); // reset form
        setStep(1);
      } else {
        toast.error(res.data?.error || res.data?.message || "Signup failed");
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8"
      >
        <h2 className="text-2xl font-semibold text-slate-800 mb-1">Create account</h2>
        <p className="text-sm text-slate-500 mb-6">Join us — it's quick and easy.</p>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="step1"
              onSubmit={handleSubmit(handleStep1)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  {...register("username")}
                  className={clsx(
                    "w-full rounded-lg border px-3 py-2 text-sm transition",
                    errors.username ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-400",
                    "focus:outline-none focus:ring-1 focus:ring-indigo-200"
                  )}
                />
                {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={clsx(
                    "w-full rounded-lg border px-3 py-2 text-sm transition",
                    errors.email ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-400",
                    "focus:outline-none focus:ring-1 focus:ring-indigo-200"
                  )}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    {...register("password")}
                    className={clsx(
                      "w-full rounded-lg border px-3 py-2 text-sm transition pr-10",
                      errors.password ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-400",
                      "focus:outline-none focus:ring-1 focus:ring-indigo-200"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((p) => !p)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700"
                  >
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}

                {/* Strength bar */}
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Password strength</span>
                    <span className="font-medium text-slate-700">{strength.label}</span>
                  </div>
                  <div className="w-full h-2 rounded bg-gray-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(strength.score / 4) * 100}%` }}
                      transition={{ duration: 0.3 }}
                      className={clsx("h-full", strength.color)}
                    />
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.02 }}
                  type="submit"
                  className="w-full rounded-lg px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Next
                </motion.button>
              </div>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form
              key="step2"
              onSubmit={handleSubmit(handleStep2)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Avatar URL input (simple) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="avatarUrl">
                  Avatar URL (optional)
                </label>
                <input
                  id="avatarUrl"
                  type="url"
                  placeholder="https://example.com/my-avatar.jpg"
                  {...register("avatarUrl")}
                  className={clsx(
                    "w-full rounded-lg border px-3 py-2 text-sm transition",
                    errors.avatarUrl ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-400",
                    "focus:outline-none focus:ring-1 focus:ring-indigo-200"
                  )}
                />
                {errors.avatarUrl && <p className="mt-1 text-xs text-red-500">{errors.avatarUrl.message}</p>}
                <p className="mt-1 text-xs text-slate-500">Or leave blank to add avatar later from your profile.</p>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="bio">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows="3"
                  {...register("bio")}
                  className={clsx(
                    "w-full rounded-lg border px-3 py-2 text-sm transition",
                    errors.bio ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-400",
                    "focus:outline-none focus:ring-1 focus:ring-indigo-200"
                  )}
                ></textarea>
                {errors.bio && <p className="mt-1 text-xs text-red-500">{errors.bio.message}</p>}
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-lg border px-4 py-2 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50"
                >
                  Back
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.02 }}
                  type="submit"
                  disabled={loading}
                  className={clsx(
                    "flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow",
                    loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                  )}
                >
                  {loading ? "Signing up..." : "Finish"}
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Signup;

