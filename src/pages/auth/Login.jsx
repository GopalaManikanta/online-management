import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, Lock, Mail, CheckCircle2, Award, Users, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
      const res = await login(data.email, data.password, data.rememberMe);
      if (res.success) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = (email, pass) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Hero Section with Background Image & Sky Blue Gradient Overlay */}
        <div className="lg:col-span-5 relative p-8 lg:p-12 text-white flex flex-col justify-between overflow-hidden">
          {/* Background Image Layer */}
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80"
            alt="EduSync Education Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Sky Blue Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-600/90 via-sky-500/90 to-blue-700/95 mix-blend-multiply" />
          <div className="absolute inset-0 bg-sky-500/40 backdrop-blur-[1px]" />

          {/* Logo Header */}
          <div className="flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-xl bg-white text-sky-600 flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">EduSync</span>
          </div>

          {/* Main Hero Content */}
          <div className="my-8 z-10 space-y-6">
            <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-xs">
              Learn Today <br />
              <span className="text-sky-100">Build Your Tomorrow</span>
            </h1>
            <p className="text-sky-100 text-sm leading-relaxed">
              Access quality courses, learn at your own pace, and achieve your goals with EduSync LMS.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-white">
                <div className="p-1.5 rounded-lg bg-white/20 text-white backdrop-blur-xs">
                  <Users className="w-4 h-4" />
                </div>
                <span>Expert Instructors</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white">
                <div className="p-1.5 rounded-lg bg-white/20 text-white backdrop-blur-xs">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span>Lifetime Access to Content</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white">
                <div className="p-1.5 rounded-lg bg-white/20 text-white backdrop-blur-xs">
                  <Award className="w-4 h-4" />
                </div>
                <span>Certificate on Completion</span>
              </div>
            </div>
          </div>

          <div className="z-10 text-xs text-sky-100">
            © {new Date().getFullYear()} EduSync LMS. All rights reserved.
          </div>
        </div>

        {/* Right Form Section */}
        <div className="lg:col-span-7 p-8 sm:p-12 bg-white flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Welcome Back!
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Login to your account to continue learning
              </p>
            </div>

            {/* Quick Demo Fill */}
            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-3 text-xs text-sky-950 space-y-1.5">
              <div className="font-semibold text-sky-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                Quick Demo Fill:
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('admin@edusync.com', 'admin123')}
                  className="px-2.5 py-1 rounded-lg bg-sky-500 text-white hover:bg-sky-600 font-medium transition"
                >
                  Admin Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('rahul@gmail.com', 'student123')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-sky-200 text-sky-800 hover:bg-sky-100 font-medium transition"
                >
                  Student (Rahul) Demo
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                        : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
                )}
              </div>

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
                        : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'
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

              <div className="flex items-center justify-between text-sm pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register('rememberMe')}
                    className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                  />
                  <span className="text-slate-600 text-xs font-medium">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-sky-600 hover:text-sky-800 transition"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl shadow-md shadow-sky-500/25 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-2">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-sky-600 hover:text-sky-800 transition"
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
