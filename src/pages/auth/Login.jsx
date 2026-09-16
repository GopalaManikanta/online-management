import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, Lock, Mail, CheckCircle2, Award, Users, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const rememberedEmail = localStorage.getItem('edusync_remember_me') || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: rememberedEmail,
      password: '',
      rememberMe: !!rememberedEmail,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password, data.rememberMe);
      // No dashboard redirection - only toast message will appear
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = (email, pass) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Hero Section (EduSync Branding Card) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#312E81] p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Glow Accents */}
          <div className="absolute top-0 left-0 -translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 translate-x-12 translate-y-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Logo Header */}
          <div className="flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">EduSync</span>
          </div>

          {/* Main Hero Content */}
          <div className="my-8 z-10 space-y-6">
            <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight">
              Learn Today <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-white">
                Build Your Tomorrow
              </span>
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Access quality courses, learn at your own pace, and achieve your goals with EduSync LMS.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                  <Users className="w-4 h-4" />
                </div>
                <span>Expert Instructors</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span>Lifetime Access to Content</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                  <Award className="w-4 h-4" />
                </div>
                <span>Certificate on Completion</span>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="z-10 text-xs text-slate-400">
            © {new Date().getFullYear()} EduSync LMS. All rights reserved.
          </div>
        </div>

        {/* Right Form Section */}
        <div className="lg:col-span-7 p-8 sm:p-12 bg-white flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full space-y-6">
            {/* Form Header */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Welcome Back!
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Login to your account to continue learning
              </p>
            </div>

            {/* Pre-seeded Quick Demo Fill */}
            <div className="bg-indigo-50/80 border border-indigo-100 rounded-2xl p-3 text-xs text-indigo-900 space-y-1.5">
              <div className="font-semibold text-indigo-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                Quick Demo Fill:
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('admin@edusync.com', 'admin123')}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium transition"
                >
                  Admin Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('rahul@gmail.com', 'student123')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-800 hover:bg-indigo-100 font-medium transition"
                >
                  Student (Rahul) Demo
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...register('email', {
                      required: 'Email address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Enter a valid email address',
                      },
                    })}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      errors.email
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-600'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input with Show/Hide Toggle */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    className={`w-full pl-11 pr-11 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      errors.password
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register('rememberMe')}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-600 text-xs font-medium">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              {/* Google Social Login */}
              <button
                type="button"
                onClick={() => handleQuickDemoFill('rahul@gmail.com', 'student123')}
                className="w-full py-3 px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl text-sm flex items-center justify-center gap-2 transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                  />
                </svg>
                Continue with Google
              </button>
            </form>

            {/* Register Footer Link */}
            <div className="text-center text-xs text-slate-500 pt-2">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-indigo-600 hover:text-indigo-800 transition"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
