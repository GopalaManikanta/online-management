import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'Student',
      agreeTerms: false,
    },
  });

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await registerUser(data);
      if (res.success) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Branding Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#312E81] p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 -translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 translate-x-12 translate-y-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Logo Header */}
          <div className="flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">EduSync</span>
          </div>

          <div className="my-8 z-10 space-y-4">
            <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight">
              Start Your Learning Journey Today
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Create an account to gain access to interactive courses, track your learning progress, and earn industry-recognized certificates.
            </p>

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10 space-y-2 mt-6">
              <div className="flex items-center gap-2 text-indigo-300 text-sm font-semibold">
                <ShieldCheck className="w-5 h-5" />
                <span>Why Join EduSync?</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pl-7 list-disc">
                <li>Over 24+ professional interactive courses</li>
                <li>Live progress analytics & assignment submissions</li>
                <li>Connect directly with expert instructors</li>
              </ul>
            </div>
          </div>

          <div className="z-10 text-xs text-slate-400">
            © {new Date().getFullYear()} EduSync LMS. All rights reserved.
          </div>
        </div>

        {/* Right Register Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 bg-white flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Create Account
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Fill in your details to get started
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    {...register('name', { required: 'Full name is required' })}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="e.g. rahul@gmail.com"
                    {...register('email', {
                      required: 'Email address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Enter a valid email address',
                      },
                    })}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      errors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Account Role
                </label>
                <select
                  {...register('role')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                >
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters required' },
                    })}
                    className={`w-full pl-11 pr-11 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      errors.password ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-indigo-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === passwordValue || 'Passwords do not match',
                    })}
                    className={`w-full pl-11 pr-11 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      errors.confirmPassword ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-indigo-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register('agreeTerms', {
                      required: 'You must accept the terms to continue',
                    })}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs text-slate-600 leading-tight">
                    I agree to the <a href="#terms" className="text-indigo-600 font-semibold underline">Terms of Service</a> and <a href="#privacy" className="text-indigo-600 font-semibold underline">Privacy Policy</a>.
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-xs text-red-500 font-medium mt-1">{errors.agreeTerms.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="text-center text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800 transition">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
