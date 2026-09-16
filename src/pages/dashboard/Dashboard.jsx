import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Users,
  GraduationCap,
  BookmarkCheck,
  CheckCircle2,
  PlusCircle,
  UserPlus,
  FileText,
  Sparkles,
  Inbox
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  // Metric Cards - STRICTLY 0 in White & Sky Blue Theme
  const kpiCards = [
    {
      id: 'courses',
      title: 'Total Courses',
      value: 0,
      icon: BookOpen,
      bgColor: 'bg-sky-50 text-sky-600',
    },
    {
      id: 'students',
      title: 'Total Students',
      value: 0,
      icon: Users,
      bgColor: 'bg-sky-50 text-sky-600',
    },
    {
      id: 'instructors',
      title: 'Total Instructors',
      value: 0,
      icon: GraduationCap,
      bgColor: 'bg-sky-50 text-sky-600',
    },
    {
      id: 'enrolled',
      title: 'Enrolled Courses',
      value: 0,
      icon: BookmarkCheck,
      bgColor: 'bg-sky-50 text-sky-600',
    },
    {
      id: 'completed',
      title: 'Completed Courses',
      value: 0,
      icon: CheckCircle2,
      bgColor: 'bg-sky-50 text-sky-600',
    },
  ];

  // Quick Action Cards Data
  const quickActionCards = [
    {
      id: 'add-course',
      title: 'Add New Course',
      desc: 'Create a new course module',
      icon: PlusCircle,
      bgColor: 'bg-sky-500/10 text-sky-600',
    },
    {
      id: 'enroll-student',
      title: 'Enroll Student',
      desc: 'Enroll a student into a course',
      icon: UserPlus,
      bgColor: 'bg-sky-500/10 text-sky-600',
    },
    {
      id: 'add-instructor',
      title: 'Add Instructor',
      desc: 'Onboard a new faculty member',
      icon: GraduationCap,
      bgColor: 'bg-sky-500/10 text-sky-600',
    },
    {
      id: 'analytics-report',
      title: 'View Reports',
      desc: 'Generate system summary report',
      icon: FileText,
      bgColor: 'bg-sky-500/10 text-sky-600',
    },
  ];

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      {/* Sky Blue Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-sky-500/20 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>EduSync LMS Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Good Morning, {user?.name || 'Admin'} 👋
          </h1>
          <p className="text-sky-100 text-sm max-w-xl">
            Welcome to your Online Learning Management System dashboard.
          </p>
        </div>
      </div>

      {/* 5 Metric Cards Grid in Sky Blue Theme */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Dashboard Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-sky-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">{card.title}</span>
                  <div className={`p-2.5 rounded-xl ${card.bgColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {card.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Cards in Sky Blue Theme */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActionCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4 text-left cursor-default select-none opacity-90"
              >
                <div className={`p-3 rounded-2xl ${card.bgColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-snug">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Enrolled Courses & Recent Students Headings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enrolled Courses Section with Heading */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Enrolled Courses</h2>
            <span className="text-xs font-semibold text-sky-600 font-mono bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
              0 Courses
            </span>
          </div>

          <div className="p-8 text-center text-slate-400 space-y-2">
            <Inbox className="w-8 h-8 mx-auto text-sky-300" />
            <p className="text-xs font-semibold text-slate-500">No courses available (Count: 0)</p>
          </div>
        </div>

        {/* Recent Students Section with Heading */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Recent Students</h2>
            <span className="text-xs font-semibold text-sky-600 font-mono bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
              0 Students
            </span>
          </div>

          <div className="p-8 text-center text-slate-400 space-y-2">
            <Users className="w-8 h-8 mx-auto text-sky-300" />
            <p className="text-xs font-semibold text-slate-500">No recent students (Count: 0)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
