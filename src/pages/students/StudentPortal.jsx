import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLMS } from '../../context/LMSContext';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  Search,
  Sparkles,
  Mail,
  Phone,
  PlayCircle,
  Check,
  BookmarkCheck,
  Filter,
  ArrowRight,
  X,
  Download,
  AlertTriangle,
  Trash2
} from 'lucide-react';

const StudentPortal = () => {
  const { user } = useAuth();
  const {
    students,
    courses,
    enrollments,
    instructors,
    addEnrollment,
    removeEnrollment,
    toggleLessonCompletion,
  } = useLMS();

  // Current Logged-in Student Object (Gopala Manikanta)
  const currentStudent = students.find(
    (s) => (user && s.email.toLowerCase() === user.email.toLowerCase()) || s.name.toLowerCase().includes('manikanta')
  ) || {
    id: 's_manikanta',
    name: user?.name || 'Gopala Manikanta',
    email: user?.email || 'gopala.manikanta@edusync.com',
    qualification: 'B.Tech Computer Science & Engineering',
    enrollmentDate: '2026-01-10',
  };

  const [activeTab, setActiveTab] = useState('my-courses'); // 'my-courses' | 'explore' | 'certificates' | 'instructors'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Course Player Modal State
  const [activeLearningCourse, setActiveLearningCourse] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  // Certificate, Unenroll & Course Overview / Confirmation Modal States
  const [viewingCertificate, setViewingCertificate] = useState(null);
  const [droppingEnrollment, setDroppingEnrollment] = useState(null);
  const [previewingCourse, setPreviewingCourse] = useState(null);
  const [confirmingEnrollmentCourse, setConfirmingEnrollmentCourse] = useState(null);

  // Student's Personal Enrollments (Strictly filtered for Gopala Manikanta)
  const studentEnrollments = enrollments.filter(
    (e) => e.studentId === currentStudent.id || e.studentEmail?.toLowerCase() === currentStudent.email?.toLowerCase()
  );

  // Metrics
  const completedCount = studentEnrollments.filter((e) => e.status === 'Completed').length;
  const activeCount = studentEnrollments.filter((e) => (e.status || 'Active') === 'Active').length;

  // Categories list
  const categories = ['All', ...new Set(courses.map((c) => c.category || 'General'))];

  // Helper to find instructor for a course
  const getInstructorForCourse = (courseId) => {
    return instructors.find((inst) => inst.assignedCourseIds?.includes(courseId)) || {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@edusync.com',
      specialization: 'Lead Faculty Member',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      rating: 4.9,
    };
  };

  // Lesson completion toggle handler
  const handleToggleLessonComplete = (enrRecord, lessonIdx) => {
    toggleLessonCompletion(enrRecord.id, lessonIdx);
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      {/* --- STUDENT PORTAL HEADER BANNER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-sky-500/20">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white text-sky-600 font-extrabold flex items-center justify-center text-2xl sm:text-3xl shadow-lg ring-4 ring-white/30">
              {currentStudent.name.charAt(0).toUpperCase()}
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full"></span>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Personalized Student Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentStudent.name}!
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm flex items-center gap-3 flex-wrap">
              <span>Qualification: <strong>{currentStudent.qualification || 'B.Tech CS'}</strong></span>
              <span>•</span>
              <span>Email: <strong>{currentStudent.email}</strong></span>
            </p>
          </div>
        </div>

        {/* Student Account Verification Card */}
        <div className="bg-white/15 backdrop-blur-md p-3.5 px-5 rounded-2xl border border-white/20 space-y-1 self-start lg:self-center shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Verified Student Account</span>
          </div>
          <p className="text-[11px] text-sky-100 font-mono">Student ID: STU-MANIKANTA-2026</p>
        </div>
      </div>

      {/* --- STUDENT PORTAL METRIC STATS --- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enrolled Courses</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-0.5">{studentEnrollments.length}</h3>
          </div>
          <div className="p-3 rounded-2xl bg-sky-50 text-sky-600">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Learning</p>
            <h3 className="text-2xl font-extrabold text-sky-600 mt-0.5">{activeCount}</h3>
          </div>
          <div className="p-3 rounded-2xl bg-sky-50 text-sky-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Courses</p>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-0.5">{completedCount}</h3>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certificates Earned</p>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-0.5">{completedCount}</h3>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* --- TABBED NAVIGATION BAR --- */}
      <div className="bg-white rounded-2xl p-2 border border-sky-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('my-courses')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'my-courses'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                : 'text-slate-600 hover:bg-sky-50 hover:text-sky-600'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>My Enrolled Courses ({studentEnrollments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                : 'text-slate-600 hover:bg-sky-50 hover:text-sky-600'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Explore & Self-Enroll Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'certificates'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                : 'text-slate-600 hover:bg-sky-50 hover:text-sky-600'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>My Certificates ({completedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('instructors')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'instructors'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                : 'text-slate-600 hover:bg-sky-50 hover:text-sky-600'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>My Instructors</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: MY ENROLLED COURSES --- */}
      {activeTab === 'my-courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">My Active Learning Roster</h2>
            <span className="text-xs text-slate-500 font-medium">Real-time Course Progress Tracking</span>
          </div>

          {studentEnrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentEnrollments.map((enr) => {
                const courseObj = courses.find((c) => c.id === enr.courseId) || {
                  thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
                  title: enr.courseTitle,
                  category: enr.courseCategory,
                  duration: '6 Weeks',
                  price: enr.coursePrice,
                };

                const instructorObj = getInstructorForCourse(enr.courseId);
                const statusLower = (enr.status || 'Active').toLowerCase();
                const progressVal = typeof enr.progress === 'number' ? enr.progress : statusLower === 'completed' ? 100 : 45;

                return (
                  <div
                    key={enr.id}
                    className="bg-white rounded-3xl border border-sky-100 p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      {/* Thumbnail & Status Badge */}
                      <div className="relative h-40 rounded-2xl overflow-hidden shadow-xs">
                        <img
                          src={courseObj.thumbnail}
                          alt={enr.courseTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                        <div className="absolute top-3 right-3">
                          {statusLower === 'completed' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-md flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Completed</span>
                            </span>
                          )}
                          {statusLower === 'active' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500 text-white shadow-md flex items-center gap-1">
                              <PlayCircle className="w-3 h-3" />
                              <span>In Progress</span>
                            </span>
                          )}
                          {statusLower === 'pending' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-md flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Pending</span>
                            </span>
                          )}
                          {(statusLower === 'cancelled' || statusLower === 'canceled') && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500 text-white shadow-md flex items-center gap-1">
                              <X className="w-3 h-3" />
                              <span>Cancelled</span>
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-3 left-3 text-white">
                          <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-bold">
                            {enr.courseCategory || 'General'}
                          </span>
                        </div>
                      </div>

                      {/* Title & Enrolled Date */}
                      <div>
                        <h3 className="text-base font-bold text-slate-800 group-hover:text-sky-600 transition-colors line-clamp-1">
                          {enr.courseTitle}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Enrolled on: {enr.enrollmentDate || 'Recent'}</p>
                      </div>

                      {/* Instructor Info Banner */}
                      <div className="p-3 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={instructorObj.avatar}
                            alt={instructorObj.name}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-200 shrink-0"
                          />
                          <div className="truncate">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Professor</p>
                            <p className="font-bold text-slate-800 text-xs truncate">{instructorObj.name}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-amber-600 bg-white px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                          ⭐ {instructorObj.rating || 4.8}
                        </span>
                      </div>

                      {/* Progress Bar & Percentage */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-600">Course Completion</span>
                          <span className="text-sky-600">{progressVal}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              statusLower === 'completed'
                                ? 'bg-emerald-500'
                                : statusLower === 'pending'
                                ? 'bg-amber-500'
                                : statusLower === 'cancelled'
                                ? 'bg-red-400'
                                : 'bg-sky-500'
                            }`}
                            style={{ width: `${progressVal}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {statusLower === 'completed' ? (
                        <button
                          onClick={() => setViewingCertificate(enr)}
                          className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-emerald-200"
                        >
                          <Award className="w-4 h-4 text-emerald-600" />
                          <span>View Completion Certificate</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 w-full">
                          <button
                            onClick={() => {
                              setActiveLearningCourse(enr);
                              setActiveLessonIndex(0);
                            }}
                            className="flex-1 py-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 font-bold text-xs transition-colors shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <PlayCircle className="w-4 h-4" />
                            <span>Continue Learning</span>
                          </button>
                          <button
                            onClick={() => setDroppingEnrollment(enr)}
                            className="px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 hover:border-red-200 shrink-0"
                            title="Drop Active Course"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Drop Course</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 bg-white rounded-3xl border border-sky-100 space-y-3">
              <BookOpen className="w-12 h-12 mx-auto text-sky-300" />
              <div className="space-y-1">
                <p className="font-bold text-slate-700 text-sm">No Active Enrolled Courses Found</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Explore our academic course catalog to self-enroll into your preferred courses.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('explore')}
                className="px-5 py-2.5 rounded-xl bg-sky-500 text-white font-bold text-xs hover:bg-sky-600 transition-colors inline-flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Explore Course Catalog</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: EXPLORE & SELF-ENROLL CATALOG --- */}
      {activeTab === 'explore' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search courses by title, instructor, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    Category: {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses
              .filter((c) => {
                const q = searchQuery.toLowerCase();
                const matchesQuery = c.title.toLowerCase().includes(q) || (c.category && c.category.toLowerCase().includes(q));
                const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
                return matchesQuery && matchesCat;
              })
              .map((c) => {
                const isAlreadyEnrolled = studentEnrollments.some((e) => e.courseId === c.id);
                const instructorObj = getInstructorForCourse(c.id);

                return (
                  <div
                    key={c.id}
                    className="bg-white rounded-3xl border border-sky-100 p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="relative h-44 rounded-2xl overflow-hidden shadow-xs">
                        <img
                          src={c.thumbnail}
                          alt={c.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-sky-600 text-white shadow-md">
                            {c.price}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 font-bold text-[10px]">
                          {c.category}
                        </span>
                        <h3 className="text-base font-bold text-slate-800 mt-1">{c.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{c.description}</p>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={instructorObj.avatar}
                            alt={instructorObj.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="font-bold text-slate-700">{instructorObj.name}</span>
                        </div>
                        <span className="text-slate-400 font-medium text-[11px]">{c.duration || '6 Weeks'}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      {isAlreadyEnrolled ? (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed"
                        >
                          <Check className="w-4 h-4" />
                          <span>Already Enrolled</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setPreviewingCourse(c)}
                          className="w-full py-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 font-bold text-xs transition-colors shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <BookmarkCheck className="w-4 h-4" />
                          <span>Read Details & Enroll ({c.price})</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* --- TAB 3: MY CERTIFICATES --- */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">My Verified Academic Certificates</h2>
            <span className="text-xs text-slate-500">Official EduSync Learning Credentials</span>
          </div>

          {studentEnrollments.filter((e) => e.status === 'Completed').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentEnrollments
                .filter((e) => e.status === 'Completed')
                .map((enr) => {
                  const instructorObj = getInstructorForCourse(enr.courseId);
                  return (
                    <div
                      key={enr.id}
                      className="bg-white rounded-3xl border-2 border-amber-200 p-6 shadow-md space-y-4 relative overflow-hidden bg-gradient-to-br from-amber-50/40 via-white to-sky-50/40"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-md">
                            <Award className="w-7 h-7" />
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest block">
                              Official Certificate of Completion
                            </span>
                            <h3 className="text-lg font-extrabold text-slate-800">{enr.courseTitle}</h3>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 italic">
                        "This certifies that <strong className="text-slate-800">{currentStudent.name}</strong> has successfully completed 100% of coursework and academic assessments under <strong className="text-sky-700">{instructorObj.name}</strong>."
                      </p>

                      <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Issue Date</span>
                          <span className="font-bold text-slate-700">{enr.enrollmentDate}</span>
                        </div>
                        <button
                          onClick={() => setViewingCertificate(enr)}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>View & Print Certificate</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 bg-white rounded-3xl border border-sky-100 space-y-3">
              <Award className="w-12 h-12 mx-auto text-amber-400 stroke-1" />
              <div className="space-y-1">
                <p className="font-bold text-slate-700 text-sm">No Certificates Earned Yet</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Complete 100% of any active course module to automatically generate your verified academic certificate.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 4: MY INSTRUCTORS --- */}
      {activeTab === 'instructors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">My Faculty & Instructors</h2>
            <span className="text-xs text-slate-500">Contact Course Mentors</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors
              .filter((inst) => studentEnrollments.some((e) => inst.assignedCourseIds?.includes(e.courseId)))
              .map((inst) => {
              const teachingCourseCount = studentEnrollments.filter((e) => inst.assignedCourseIds?.includes(e.courseId)).length;
              return (
                <div
                  key={inst.id}
                  className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={inst.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
                      alt={inst.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-4 ring-sky-100 shadow-sm"
                    />
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">{inst.name}</h3>
                      <p className="text-xs text-sky-600 font-semibold">{inst.specialization}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        ⭐ {inst.rating || 4.8} / 5.0
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-sky-600" />
                      <span className="truncate">{inst.email}</span>
                    </div>
                    {inst.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-sky-600" />
                        <span>{inst.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Teaching You:</span>
                    <span className="font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                      {teachingCourseCount} Courses
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- COURSE PLAYER & LESSON STREAM MODAL --- */}
      {activeLearningCourse && (() => {
        const freshCourseRecord = enrollments.find((e) => e.id === activeLearningCourse.id) || activeLearningCourse;
        const activeCourseLessons = (Array.isArray(freshCourseRecord.lessons) && freshCourseRecord.lessons.length > 0)
          ? freshCourseRecord.lessons
          : [
              { title: '01. Course Overview & Environment Setup', duration: '12 mins', completed: true },
              { title: '02. Core Architecture & Fundamental Concepts', duration: '25 mins', completed: true },
              { title: '03. Hands-on Project Initialization & Components', duration: '40 mins', completed: false },
              { title: '04. State Management, Context & Data Flow', duration: '35 mins', completed: false },
              { title: '05. Production Build Deployment & Best Practices', duration: '30 mins', completed: false },
            ];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-sky-100 space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700">
                    Interactive Learning Player
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-800 mt-1">{freshCourseRecord.courseTitle}</h3>
                  <p className="text-xs text-slate-500">
                    Category: {freshCourseRecord.courseCategory} • Enrolled: {freshCourseRecord.enrollmentDate}
                  </p>
                </div>
                <button
                  onClick={() => setActiveLearningCourse(null)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Placeholder */}
              <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center shadow-lg group">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
                  alt="Lesson Video"
                  className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-2">
                  <div className="w-16 h-16 rounded-full bg-sky-500/90 text-white flex items-center justify-center shadow-xl backdrop-blur-md transform group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-10 h-10" />
                  </div>
                  <p className="font-bold text-sm">
                    {activeCourseLessons[activeLessonIndex]?.title || 'Lesson Stream'}
                  </p>
                  <span className="text-xs text-sky-200 font-mono">
                    Duration: {activeCourseLessons[activeLessonIndex]?.duration || '15 mins'}
                  </span>
                </div>
              </div>

              {/* Lesson Modules Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                    Course Modules & Lesson Checklist:
                  </h4>
                  <span className="text-sky-600 font-bold text-xs">
                    Overall Progress: {freshCourseRecord.progress || 0}%
                  </span>
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {activeCourseLessons.map((lesson, idx) => {
                    const isLessonDone = lesson.completed || idx <= Math.floor(((freshCourseRecord.progress || 0) / 100) * activeCourseLessons.length) - 1;

                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveLessonIndex(idx)}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                          activeLessonIndex === idx
                            ? 'border-sky-500 bg-sky-50/70 font-semibold'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <PlayCircle className={`w-4 h-4 ${activeLessonIndex === idx ? 'text-sky-600' : 'text-slate-400'}`} />
                          <span className={`text-xs ${isLessonDone ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                            {lesson.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-400 font-mono">{lesson.duration}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleLessonComplete(freshCourseRecord, idx);
                            }}
                            className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                              isLessonDone
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-sky-500 hover:text-white'
                            }`}
                          >
                            {isLessonDone ? '✓ Completed' : 'Mark Done'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setActiveLearningCourse(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-colors shadow-md shadow-sky-500/20 cursor-pointer"
                >
                  Close Player
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* --- OFFICIAL CERTIFICATE PREVIEW MODAL --- */}
      {viewingCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border-4 border-amber-300 space-y-6 animate-in zoom-in-95 duration-200 relative overflow-hidden bg-gradient-to-br from-amber-50/30 via-white to-sky-50/30 text-center">
            <button
              onClick={() => setViewingCertificate(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 rounded-full bg-amber-500 text-white mx-auto flex items-center justify-center shadow-xl ring-8 ring-amber-100">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">
                EduSync Academic Certification Board
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Certificate of Completion</h2>
              <p className="text-xs text-slate-500">Verification ID: CERT-{viewingCertificate.id.toUpperCase()}</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/80 border border-amber-200 space-y-3 text-sm text-slate-700 max-w-md mx-auto shadow-xs">
              <p className="text-xs text-slate-500">This is to proudly certify that</p>
              <h3 className="text-xl font-extrabold text-sky-700">{currentStudent.name}</h3>
              <p className="text-xs text-slate-600">
                has successfully fulfilled all academic curriculum requirements and completed the course:
              </p>
              <h4 className="text-lg font-bold text-slate-900">{viewingCertificate.courseTitle}</h4>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-amber-200 max-w-md mx-auto">
              <div>
                <p className="font-bold text-slate-800">Date Issued:</p>
                <p>{viewingCertificate.enrollmentDate}</p>
              </div>
              <div>
                <p className="font-bold text-slate-800">Academic Status:</p>
                <p className="text-emerald-600 font-bold">100% Verified</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Print / Download Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- UNENROLL / DROP COURSE CONFIRMATION MODAL --- */}
      {droppingEnrollment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-sky-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Drop Enrolled Course?</h3>
                  <p className="text-xs text-slate-500">Academic Unenrollment Request</p>
                </div>
              </div>
              <button
                onClick={() => setDroppingEnrollment(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-red-50 border border-red-100 space-y-2">
              <p className="text-xs text-red-900 font-bold">
                Are you sure you want to drop <span className="underline font-extrabold">{droppingEnrollment.courseTitle}</span>?
              </p>
              <p className="text-[11px] text-red-700 leading-relaxed">
                Unenrolling will remove this course from your active roster and clear your current completion progress ({droppingEnrollment.progress || 0}%). You can re-enroll anytime from the course catalog.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDroppingEnrollment(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
              >
                Keep Enrolled
              </button>
              <button
                onClick={() => {
                  removeEnrollment(droppingEnrollment.id);
                  setDroppingEnrollment(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-lg shadow-red-600/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirm Drop Course</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- COURSE OVERVIEW & READ DETAILS MODAL --- */}
      {previewingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold rounded-lg">
                  {previewingCourse.category}
                </span>
                <span className="text-xs text-slate-400 font-semibold">• Course Syllabus Overview</span>
              </div>
              <button
                onClick={() => setPreviewingCourse(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <img
                src={previewingCourse.thumbnail}
                alt={previewingCourse.title}
                className="w-full h-56 object-cover rounded-2xl border border-slate-200"
              />
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-slate-900">{previewingCourse.title}</h2>
                <div className="flex flex-wrap gap-4 text-xs text-slate-600 font-medium">
                  <span>Faculty: <strong className="text-slate-900">{previewingCourse.instructor}</strong></span>
                  <span>Duration: <strong className="text-slate-900">{previewingCourse.duration || '6 Weeks'}</strong></span>
                  <span>Level: <strong className="text-slate-900">{previewingCourse.level || 'Intermediate'}</strong></span>
                  <span>Rating: <strong className="text-amber-500">{previewingCourse.rating || 4.8} ★</strong></span>
                  <span>Tuition: <strong className="text-sky-600 text-sm font-bold">{previewingCourse.price || '$99'}</strong></span>
                </div>
              </div>

              <div className="bg-slate-50 p-4.5 rounded-2xl text-xs text-slate-600 leading-relaxed space-y-2 border border-slate-200/70">
                <h4 className="font-bold text-slate-800 text-sm">Course Overview & Curriculum Details</h4>
                <p>{previewingCourse.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setPreviewingCourse(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition"
              >
                Close Overview
              </button>

              <button
                onClick={() => {
                  const selected = previewingCourse;
                  setPreviewingCourse(null);
                  setConfirmingEnrollmentCourse(selected);
                }}
                className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/25 flex items-center gap-2 cursor-pointer transition"
              >
                <span>Read & Proceed to Enroll</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ENROLLMENT CONFIRMATION MODAL --- */}
      {confirmingEnrollmentCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 w-full max-w-lg p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Confirm Course Enrollment</h3>
                  <p className="text-xs text-slate-500">Real-Time Student Self-Enrollment</p>
                </div>
              </div>
              <button
                onClick={() => setConfirmingEnrollmentCourse(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Student Profile Box */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2">
                <p className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">Enrolling Student Profile</p>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>Student Name:</span>
                  <strong className="text-sky-900">{currentStudent.name}</strong>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Email:</span>
                  <span className="font-mono text-[11px]">{currentStudent.email}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Qualification:</span>
                  <span>{currentStudent.qualification || 'B.Tech CSE'}</span>
                </div>
              </div>

              {/* Course Detail Box */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <img
                  src={confirmingEnrollmentCourse.thumbnail}
                  alt={confirmingEnrollmentCourse.title}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-700 text-[10px] font-bold">
                    {confirmingEnrollmentCourse.category || 'General'}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm truncate">{confirmingEnrollmentCourse.title}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Faculty: <strong>{confirmingEnrollmentCourse.instructor}</strong></span>
                    <strong className="text-sky-600 text-sm">{confirmingEnrollmentCourse.price || '$99'}</strong>
                  </div>
                </div>
              </div>

              {/* Terms Text */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] leading-relaxed flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  By confirming enrollment, this academic course module will be added directly to your active student learning roster with full lecture access.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 text-xs font-bold">
              <button
                type="button"
                onClick={() => setConfirmingEnrollmentCourse(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer transition"
              >
                Cancel / Back
              </button>
              <button
                type="button"
                onClick={() => {
                  addEnrollment({
                    studentId: currentStudent.id,
                    courseId: confirmingEnrollmentCourse.id,
                    status: 'Active',
                    progress: 10,
                  });
                  setConfirmingEnrollmentCourse(null);
                }}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Enrollment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPortal;
