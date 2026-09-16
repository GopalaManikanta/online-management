import React, { useState } from 'react';
import { Search, Bell, Menu, ChevronDown, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 h-16 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 text-slate-600 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dashboard, courses, students..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <button className="relative p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-sky-50 transition-colors border border-transparent hover:border-sky-100"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name || 'User'}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-sky-500/40"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-sm font-semibold text-slate-800 leading-tight">
                {user?.name || 'User'}
              </span>
              <span className="text-xs text-sky-600 font-bold">
                {user?.role || 'Admin'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <div className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span>Role: <span className="font-semibold text-sky-600">{user?.role}</span></span>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
