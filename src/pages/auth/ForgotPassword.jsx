import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetEmail, setTargetEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await forgotPassword(data.email);
      if (res.success) {
        setTargetEmail(data.email);
        setSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl shadow-xl p-8 sm:p-10 space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Forgot Password?</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            {submitted
              ? `Instructions to reset your password have been sent to ${targetEmail}.`
              : "Enter your account email address and we'll send you a password reset link."}
          </p>
        </div>

        {submitted ? (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-sky-900 space-y-1">
                <p className="font-semibold">Reset Link Sent!</p>
                <p>Check your inbox (and spam folder) for password reset confirmation.</p>
              </div>
            </div>

            <Link
              to="/login"
              className="w-full py-3.5 px-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-sky-500/25 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="Enter registered email"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl shadow-md shadow-sky-500/25 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Sending Request...' : 'Send Reset Link'}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-sky-600 hover:text-sky-800 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
