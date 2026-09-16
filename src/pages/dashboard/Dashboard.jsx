import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LogOut,
  User,
  Mail,
  Key,
  Database,
  Clock,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Users
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout, users } = useAuth();
  const navigate = useNavigate();
  const [showToken, setShowToken] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-12 font-sans flex flex-col justify-between">
      <div className="max-w-5xl mx-auto w-full space-y-8 animate-in fade-in duration-300">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/90 border border-slate-700/80 p-6 rounded-3xl shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{user?.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                  {user?.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{user?.email}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-xs rounded-2xl border border-red-500/30 flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Status Alert Banner */}
        <div className="bg-gradient-to-r from-emerald-950/60 to-slate-800/80 border border-emerald-500/30 p-5 rounded-3xl flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-emerald-300">
              Module 1: Authentication Protected Route Active
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              You are currently viewing a protected dashboard route guaranteed by <code className="text-indigo-300 font-mono bg-slate-900/60 px-1.5 py-0.5 rounded">ProtectedRoute.jsx</code>. The user session is persisted in your browser's <code className="text-indigo-300 font-mono bg-slate-900/60 px-1.5 py-0.5 rounded">LocalStorage</code> under key <code className="text-indigo-300 font-mono bg-slate-900/60 px-1.5 py-0.5 rounded">edusync_session</code>.
            </p>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Session Card */}
          <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-3xl space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm border-b border-slate-700/80 pb-3">
              <Key className="w-4 h-4" />
              <span>Active Session Details (Local Storage)</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-700/40">
                <span className="text-slate-400">User ID:</span>
                <span className="font-mono text-slate-200">{user?.id}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-700/40">
                <span className="text-slate-400">Account Role:</span>
                <span className="font-bold text-indigo-400">{user?.role}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-700/40">
                <span className="text-slate-400">Login Timestamp:</span>
                <span className="text-slate-300">{user?.loginTime || 'Just now'}</span>
              </div>
              <div className="py-1.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Auth Token:</span>
                  <button
                    onClick={() => setShowToken(!showToken)}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showToken ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 font-mono text-[11px] text-slate-300 break-all">
                  {showToken ? user?.token : '••••••••••••••••••••••••••••••••'}
                </div>
              </div>
            </div>
          </div>

          {/* Module 1 Requirements Checklist */}
          <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-3xl space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm border-b border-slate-700/80 pb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Module 1 Features Verification</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span><strong>Login UI</strong>: Split-screen branding & form design</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span><strong>Register UI</strong>: Full signup with role selection</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span><strong>Forgot Password UI</strong>: Password reset workflow</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span><strong>Form Validation</strong>: React Hook Form email & password rules</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span><strong>Password Show/Hide</strong>: Eye icon visibility toggle</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span><strong>Protected Routes & Logout</strong>: Guarded route & session clearing</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span><strong>Local Storage</strong>: Persisted user registry and session data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Local Storage Registered Users Registry */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-3xl space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Database className="w-4 h-4" />
              <span>Registered Accounts Registry (Local Storage: edusync_users)</span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300">
              {users.length} Users
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 flex items-center gap-3"
              >
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700"
                />
                <div className="min-w-0 flex-1 text-xs">
                  <p className="font-bold text-slate-100 truncate">{u.name}</p>
                  <p className="text-slate-400 truncate">{u.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold text-[10px]">
                    Role: {u.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="text-center text-xs text-slate-500 pt-8">
        EduSync LMS Module 1: Authentication Engine
      </footer>
    </div>
  );
};

export default Dashboard;
