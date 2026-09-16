import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLMS } from '../../context/LMSContext';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  GraduationCap,
  BookmarkCheck,
  CheckCircle2,
  PlusCircle,
  UserPlus,
  FileText,
  Clock,
  Activity,
  Sparkles,
  ArrowRight,
  Inbox,
  X,
  Image as ImageIcon
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { activities, stats, addCourse } = useLMS();
  const navigate = useNavigate();

  // Quick Action Modal State
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);

  // Form State for Add Course Modal
  const [courseForm, setCourseForm] = useState({
    title: '',
    instructor: '',
    category: 'React',
    duration: '6 Weeks',
    level: 'Beginner',
    price: '99',
    rating: '4.8',
    thumbnail: '',
    description: '',
  });

  const handleAddCourseSubmit = (e) => {
    e.preventDefault();
    if (!courseForm.title.trim() || !courseForm.instructor.trim()) return;

    addCourse(courseForm);

    setCourseForm({
      title: '',
      instructor: '',
      category: 'React',
      duration: '6 Weeks',
      level: 'Beginner',
      price: '99',
      rating: '4.8',
      thumbnail: '',
      description: '',
    });
    setIsAddCourseModalOpen(false);
  };

  // 5 Metric Cards (Total Courses shows active count, others show 0)
  const kpiCards = [
    {
      id: 'total-courses',
      title: 'Total Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      bgColor: 'bg-sky-50 text-sky-600',
    },
    {
      id: 'total-students',
      title: 'Total Students',
      value: 0,
      icon: Users,
      bgColor: 'bg-sky-50 text-sky-600',
    },
    {
      id: 'total-instructors',
      title: 'Total Instructors',
      value: 0,
      icon: GraduationCap,
      bgColor: 'bg-sky-50 text-sky-600',
    },
    {
      id: 'enrolled-courses',
      title: 'Enrolled Courses',
      value: 0,
      icon: BookmarkCheck,
      bgColor: 'bg-sky-50 text-sky-600',
    },
    {
      id: 'completed-courses',
      title: 'Completed Courses',
      value: 0,
      icon: CheckCircle2,
      bgColor: 'bg-sky-50 text-sky-600',
    },
  ];

  // 4 Quick Action Cards (Add New Course is ACTIVE and OPENS MODAL; others do nothing)
  const quickActionCards = [
    {
      id: 'add-course',
      title: 'Add New Course',
      desc: 'Create and publish a new course module',
      icon: PlusCircle,
      bgColor: 'bg-sky-500/10 text-sky-600 group-hover:bg-sky-500 group-hover:text-white',
      action: () => setIsAddCourseModalOpen(true),
      active: true,
    },
    {
      id: 'enroll-student',
      title: 'Enroll Student',
      desc: 'Register a new student to a course',
      icon: UserPlus,
      bgColor: 'bg-sky-500/10 text-sky-600 group-hover:bg-sky-500 group-hover:text-white',
      action: () => {}, 
      active: false,
    },
    {
      id: 'add-instructor',
      title: 'Add Instructor',
      desc: 'Register new faculty or instructor',
      icon: GraduationCap,
      bgColor: 'bg-sky-500/10 text-sky-600 group-hover:bg-sky-500 group-hover:text-white',
      action: () => {},
      active: false,
    },
    {
      id: 'view-reports',
      title: 'View Reports',
      desc: 'Generate & inspect summary report',
      icon: FileText,
      bgColor: 'bg-sky-500/10 text-sky-600 group-hover:bg-sky-500 group-hover:text-white',
      action: () => {}, 
      active: false,
    },
  ];

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300 relative">
      {/* Sky Blue Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-sky-500/20 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>EduSync Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Good Morning, {user?.name || 'Admin'} 👋
          </h1>
          <p className="text-sky-100 text-sm max-w-xl">
            Welcome to your Online Learning Management System dashboard.
          </p>
        </div>

        <button
          onClick={() => navigate('/courses')}
          className="px-5 py-3 bg-white text-sky-600 font-bold rounded-2xl shadow-md hover:bg-sky-50 transition text-xs flex items-center gap-2 self-start sm:self-center cursor-pointer"
        >
          <span>Course Management</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 5 Metric Cards Grid */}
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

      {/* 4 Quick Action Cards (Add New Course is WORKING and OPENS MODAL) */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActionCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={card.action}
                className={`bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs transition-all duration-200 flex items-start gap-4 text-left group ${
                  card.active
                    ? 'hover:border-sky-400 hover:bg-sky-50/50 cursor-pointer'
                    : 'cursor-default'
                }`}
              >
                <div className={`p-3 rounded-2xl transition-all duration-200 ${card.bgColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors truncate">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-snug">{card.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Enrolled Courses, Upcoming Classes, Recent Activities, Recent Students */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Enrolled Courses Progress & Upcoming Classes */}
        <div className="lg:col-span-7 space-y-6">
          {/* Enrolled Courses Progress */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-600" />
                <h2 className="text-lg font-bold text-slate-900">Enrolled Courses Progress</h2>
              </div>
              <span className="text-xs font-semibold text-sky-600 font-mono bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                0 Courses Enrolled
              </span>
            </div>

            <div className="p-8 text-center text-slate-400 space-y-2">
              <Inbox className="w-8 h-8 mx-auto text-sky-300" />
              <p className="text-xs font-semibold text-slate-500">No active enrolled courses (Count: 0)</p>
            </div>
          </div>

          {/* Upcoming Classes Section */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-600" />
                <h2 className="text-lg font-bold text-slate-900">Upcoming Live Classes</h2>
              </div>
              <span className="text-xs font-semibold text-sky-600">0 Scheduled</span>
            </div>

            <div className="p-8 text-center text-slate-400 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-sky-300" />
              <p className="text-xs font-semibold text-slate-500">No upcoming live classes scheduled (Count: 0)</p>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Recent Activities & Recent Students */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Activities Section */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-600" />
                <h2 className="text-lg font-bold text-slate-900">Recent Activities</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">{activities.length} Feed</span>
            </div>

            {activities.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Activity className="w-8 h-8 mx-auto text-sky-300" />
                <p className="text-xs font-semibold text-slate-500">No recent activity logs (Count: 0)</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs p-2.5 rounded-xl hover:bg-slate-50">
                    <div className="p-2 rounded-lg bg-sky-50 text-sky-600 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-800">{act.action}</p>
                      <p className="text-slate-500 text-[11px] truncate">{act.detail}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Students Section */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-600" />
                <h2 className="text-lg font-bold text-slate-900">Recent Students</h2>
              </div>
              <span className="text-xs font-semibold text-sky-600 font-mono">0 Enrolled</span>
            </div>

            <div className="p-8 text-center text-slate-400 space-y-2">
              <Users className="w-8 h-8 mx-auto text-sky-300" />
              <p className="text-xs font-semibold text-slate-500">No recent enrolled students (Count: 0)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Working Add New Course Modal (Opens when Add New Course Quick Action is clicked) */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">Add New Course</h2>
              <button
                onClick={() => setIsAddCourseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCourseSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Course Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. React JS Masterclass"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Instructor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Smith"
                    value={courseForm.instructor}
                    onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Category *</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-white"
                  >
                    <option value="React">React</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Node.js">Node.js</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Python">Python</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Duration *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 6 Weeks"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Level *</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Price ($) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 99"
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    placeholder="4.8"
                    value={courseForm.rating}
                    onChange={(e) => setCourseForm({ ...courseForm, rating: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Course Thumbnail Image URL with Live Image Preview */}
              <div className="space-y-2">
                <label className="block font-semibold text-slate-700">Course Thumbnail Image URL</label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={courseForm.thumbnail}
                    onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
                {courseForm.thumbnail ? (
                  <div className="mt-2 relative h-28 rounded-2xl overflow-hidden border border-slate-200">
                    <img
                      src={courseForm.thumbnail}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 flex items-center justify-center gap-2 text-[11px]">
                    <ImageIcon className="w-4 h-4 text-sky-400" />
                    <span>Enter image URL or leave blank to use automatic category thumbnail</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Description</label>
                <textarea
                  rows="3"
                  placeholder="Detailed course description..."
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl shadow-md shadow-sky-500/25 cursor-pointer"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
