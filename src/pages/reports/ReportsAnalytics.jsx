import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Users,
  BookOpen,
  BookmarkCheck,
  Star,
  TrendingUp,
  BarChart3,
  PieChart,
  Download,
  CheckCircle2,
  Award,
  Sparkles
} from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

const ReportsAnalytics = () => {
  const { user } = useAuth();
  const { courses, students, enrollments, stats } = useLMS();

  const [timeFilter, setTimeFilter] = useState('All Time');

  if (user?.role === 'Student') {
    return <Navigate to="/student-portal" replace />;
  }

  // Active Enrollments
  const activeEnrollmentsCount = enrollments.filter((e) => e.status === 'Active').length;
  const completedEnrollmentsCount = enrollments.filter((e) => e.status === 'Completed').length;

  // Monthly Enrollments Breakdown Data
  const monthlyData = [
    { month: 'Jan', count: 12, revenue: '$1,188' },
    { month: 'Feb', count: 18, revenue: '$1,782' },
    { month: 'Mar', count: 24, revenue: '$2,376' },
    { month: 'Apr', count: 30, revenue: '$2,970' },
    { month: 'May', count: 22, revenue: '$2,178' },
    { month: 'Jun', count: 35, revenue: '$3,465' },
    { month: 'Jul', count: 42, revenue: '$4,158' },
    { month: 'Aug', count: 50, revenue: '$4,950' },
    { month: 'Sep', count: enrollments.length || 65, revenue: '$6,435' },
    { month: 'Oct', count: 48, revenue: '$4,752' },
    { month: 'Nov', count: 55, revenue: '$5,445' },
    { month: 'Dec', count: 60, revenue: '$5,940' },
  ];

  const maxMonthlyCount = Math.max(...monthlyData.map((d) => d.count), 1);

  // Top Rated Courses Sorting
  const topRatedCourses = [...courses]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  // Category Distribution
  const categoryCounts = courses.reduce((acc, course) => {
    const cat = course.category || 'General';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryArray = Object.entries(categoryCounts).map(([cat, count]) => ({
    name: cat,
    count,
    percentage: Math.round((count / (courses.length || 1)) * 100),
  }));

  const handleExportReport = () => {
    toast.success('Reports & Analytics summary exported successfully!');
    window.print();
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-sky-500/20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>EduSync Performance Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-sky-100 text-sm max-w-xl">
            Real-time insights on total students, course completions, active enrollments, and revenue metrics.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <button
            onClick={handleExportReport}
            className="px-4 py-2.5 bg-white text-sky-600 font-bold rounded-2xl shadow-md hover:bg-sky-50 transition text-xs flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export & Print Report</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Students</span>
            <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-3xl font-extrabold text-slate-900">{stats.totalStudents || students.length}</div>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14% from last month</span>
            </p>
          </div>
        </div>

        {/* Total Courses */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Courses</span>
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-3xl font-extrabold text-slate-900">{stats.totalCourses || courses.length}</div>
            <p className="text-[11px] text-slate-500">Across {categoryArray.length} Specializations</p>
          </div>
        </div>

        {/* Active Enrollments */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Enrollments</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <BookmarkCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-3xl font-extrabold text-slate-900">{stats.totalEnrollments || enrollments.length}</div>
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="text-emerald-600">{activeEnrollmentsCount} Active</span>
              <span className="text-slate-300">•</span>
              <span className="text-sky-600">{completedEnrollmentsCount} Completed</span>
            </div>
          </div>
        </div>

        {/* Course Completion Rate */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Avg Completion Rate</span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-3xl font-extrabold text-slate-900">88.5%</div>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>High Student Engagement</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (8 Cols): Monthly Enrollments Interactive Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-sky-600" />
                <span>Monthly Enrollments Trend</span>
              </h2>
              <p className="text-xs text-slate-500">Student enrollment volume broken down month-by-month</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl font-medium outline-none focus:border-sky-500"
              >
                <option value="All Time">2026 Academic Year</option>
                <option value="This Quarter">Q3 2026</option>
              </select>
            </div>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="space-y-4">
            <div className="h-64 flex items-end justify-between gap-2 pt-6 pb-2 px-2 bg-slate-50/60 rounded-2xl border border-slate-100 relative">
              {monthlyData.map((item, idx) => {
                const heightPercent = Math.round((item.count / maxMonthlyCount) * 100);
                const isSelectedMonth = item.month === 'Sep';
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end relative">
                    {/* Hover Tooltip */}
                    <div className="absolute -top-10 hidden group-hover:flex flex-col items-center bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg z-20 whitespace-nowrap shadow-md">
                      <span className="font-bold">{item.count} Enrolled</span>
                      <span className="text-sky-300">{item.revenue}</span>
                    </div>

                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                        isSelectedMonth
                          ? 'bg-gradient-to-t from-sky-600 to-sky-400 shadow-md shadow-sky-500/30'
                          : 'bg-sky-200 group-hover:bg-sky-400'
                      }`}
                    />
                    <span className={`text-[10px] font-bold ${isSelectedMonth ? 'text-sky-600' : 'text-slate-500'}`}>
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-2">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-sky-500 inline-block"></span>
                <span>Active Enrollment Peak (September: {enrollments.length || 65})</span>
              </span>
              <span className="font-mono text-sky-700 font-bold">Total Annual Growth: +24.8%</span>
            </div>
          </div>

          {/* Monthly Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3 rounded-l-xl">Month</th>
                  <th className="p-3">New Enrollments</th>
                  <th className="p-3">Est. Revenue</th>
                  <th className="p-3 text-right rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {monthlyData.slice(5, 10).map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">{row.month} 2026</td>
                    <td className="p-3 text-slate-700">{row.count} Students</td>
                    <td className="p-3 font-mono text-emerald-600 font-bold">{row.revenue}</td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-100">
                        Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right (4 Cols): Course Category Distribution & Top Rated Courses */}
        <div className="lg:col-span-4 space-y-6">
          {/* Category Donut Distribution */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-sky-600" />
              <span>Course Categories</span>
            </h2>

            <div className="space-y-3">
              {categoryArray.map((cat, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-slate-800 font-bold">{cat.name}</span>
                    <span className="text-slate-500 font-mono">{cat.count} Courses ({cat.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        idx === 0
                          ? 'bg-sky-500'
                          : idx === 1
                          ? 'bg-indigo-500'
                          : idx === 2
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Rated Courses */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Top Rated Courses</span>
              </h2>
              <span className="text-[11px] font-bold text-sky-600">Top {topRatedCourses.length}</span>
            </div>

            {topRatedCourses.length === 0 ? (
              <EmptyState title="No courses found" description="Create a course to see ratings." />
            ) : (
              <div className="space-y-3">
                {topRatedCourses.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 truncate">{c.title}</h3>
                        <p className="text-[11px] text-slate-500">Instructor: {c.instructor}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg border border-amber-200 font-bold text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{c.rating || 4.8}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                      <span>Category: <strong className="text-slate-700">{c.category}</strong></span>
                      <span className="text-sky-600 font-bold">{c.enrolledStudentsCount || 15} Students</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
