import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLMS } from '../../context/LMSContext';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Users,
  BookOpen,
  Search,
  Filter,
  Sparkles,
  CheckSquare,
  Square,
  GraduationCap,
  AlertCircle,
  X,
  ArrowRight,
  Lock
} from 'lucide-react';

const LearningProgress = () => {
  const { user } = useAuth();
  const {
    enrollments,
    students,
    courses,
    toggleLessonCompletion,
    DEFAULT_COURSE_LESSONS
  } = useLMS();

  const isStudent = user?.role === 'Student';

  // Filters & Modal State
  const [selectedStudentId, setSelectedStudentId] = useState(
    isStudent ? (user?.email?.toLowerCase().includes('manikanta') ? 's_manikanta' : 'all') : 'all'
  );
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [checklistModalEnrollment, setChecklistModalEnrollment] = useState(null);

  // Helper to resolve lessons checklist for an enrollment record
  const getEnrollmentLessons = (enr) => {
    if (Array.isArray(enr.lessons) && enr.lessons.length > 0) {
      return enr.lessons;
    }
    const defaultTotal = DEFAULT_COURSE_LESSONS.length;
    const completedCount = Math.round(((enr.progress || 0) / 100) * defaultTotal);
    return DEFAULT_COURSE_LESSONS.map((l, idx) => ({
      ...l,
      completed: idx < completedCount,
    }));
  };

  // Filter enrollments based on selected student, status, and search query
  const filteredEnrollments = enrollments.filter((enr) => {
    // If student role logged in, strictly show their own progress unless they select 'all'
    if (isStudent && selectedStudentId === 's_manikanta') {
      const isManikanta = enr.studentId === 's_manikanta' || enr.studentEmail?.toLowerCase().includes('manikanta');
      if (!isManikanta) return false;
    } else if (selectedStudentId !== 'all') {
      if (enr.studentId !== selectedStudentId) return false;
    }

    if (selectedStatus !== 'All') {
      const statusLower = (enr.status || 'Active').toLowerCase();
      if (statusLower !== selectedStatus.toLowerCase()) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = enr.courseTitle?.toLowerCase().includes(q);
      const matchStudent = enr.studentName?.toLowerCase().includes(q);
      const matchCategory = enr.courseCategory?.toLowerCase().includes(q);
      if (!matchTitle && !matchStudent && !matchCategory) return false;
    }

    return true;
  });

  // Calculate Overall Analytics
  let totalLessonsCount = 0;
  let totalCompletedLessonsCount = 0;
  let totalProgressSum = 0;

  enrollments.forEach((enr) => {
    const lessonsList = getEnrollmentLessons(enr);
    const completedInEnr = lessonsList.filter((l) => l.completed).length;
    totalLessonsCount += lessonsList.length;
    totalCompletedLessonsCount += completedInEnr;
    totalProgressSum += enr.progress || 0;
  });

  const totalPendingLessonsCount = totalLessonsCount - totalCompletedLessonsCount;
  const overallAvgCompletion = enrollments.length > 0 ? Math.round(totalProgressSum / enrollments.length) : 0;
  const activeLearnersCount = new Set(enrollments.map((e) => e.studentId || e.studentEmail)).size;

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      {/* --- PAGE HEADER BANNER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-sky-500/20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Real-Time Learning Progress Tracking Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isStudent ? 'My Learning Progress & Lessons' : 'Student Learning Progress Analytics'}
          </h1>
          <p className="text-sky-100 text-xs sm:text-sm max-w-xl">
            {isStudent
              ? 'Track completed vs. pending lessons, completion percentages, and dynamic progress bars for your enrolled courses.'
              : 'Monitor student-wise completion rates, lesson progress checklists, and platform-wide learning metrics in real time.'}
          </p>
        </div>

        <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0 self-start sm:self-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-sky-100">Average Completion Rate</p>
          <h3 className="text-3xl font-extrabold text-white mt-1">{overallAvgCompletion}%</h3>
        </div>
      </div>

      {/* --- OVERALL STATISTICS CARDS (4 METRIC BOXES) --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Overall Average Completion */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Completion</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{overallAvgCompletion}%</h3>
          </div>
          <div className="p-3 rounded-2xl bg-sky-50 text-sky-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Completed Lessons */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Lessons</p>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{totalCompletedLessonsCount}</h3>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Pending Lessons */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Lessons</p>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{totalPendingLessonsCount}</h3>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Active Learners */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Learners</p>
            <h3 className="text-2xl font-extrabold text-sky-600 mt-1">{activeLearnersCount}</h3>
          </div>
          <div className="p-3 rounded-2xl bg-sky-50 text-sky-600">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* --- FILTERS & CONTROLS BAR --- */}
      <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Student-wise Dropdown Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <GraduationCap className="w-4 h-4 text-sky-600 shrink-0" />
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Filter Student:</span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full md:w-64 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="all">All Students (Platform Wide)</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.email})
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter & Search Input */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search course or student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          {/* Status Filter Selector */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="All">All Statuses</option>
              <option value="Active">In Progress (Active)</option>
              <option value="Completed">Completed (100%)</option>
              <option value="Pending">Pending Start</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- STUDENT-WISE & COURSE PROGRESS CARDS GRID --- */}
      {filteredEnrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enr) => {
            const lessonsList = getEnrollmentLessons(enr);
            const completedLessons = lessonsList.filter((l) => l.completed).length;
            const totalLessons = lessonsList.length;
            const pendingLessons = totalLessons - completedLessons;
            const progressVal = typeof enr.progress === 'number' ? enr.progress : Math.round((completedLessons / totalLessons) * 100);
            const isCompleted = progressVal === 100 || enr.status === 'Completed';

            const courseObj = courses.find((c) => c.id === enr.courseId) || {
              thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
              title: enr.courseTitle,
              category: enr.courseCategory,
            };

            return (
              <div
                key={enr.id}
                className="bg-white rounded-3xl border border-sky-100 p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-4">
                  {/* Student Info Badge */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-sky-50/70 border border-sky-100">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-sky-600 text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-xs">
                        {enr.studentName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Learner</p>
                        <p className="font-extrabold text-slate-800 text-xs truncate">{enr.studentName}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-sky-700 bg-white px-2 py-0.5 rounded-md border border-sky-200 shrink-0">
                      {enr.studentQualification || 'CSE'}
                    </span>
                  </div>

                  {/* Thumbnail & Title */}
                  <div className="flex gap-3 items-center">
                    <img
                      src={courseObj.thumbnail}
                      alt={enr.courseTitle}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200 shadow-xs"
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-700 text-[10px] font-bold">
                        {enr.courseCategory || 'General'}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                        {enr.courseTitle}
                      </h3>
                      <p className="text-[11px] text-slate-400">Duration: {enr.courseDuration || '6 Weeks'}</p>
                    </div>
                  </div>

                  {/* Completion Percentage & Dynamic Progress Bar */}
                  <div className="space-y-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between text-xs font-extrabold">
                      <span className="text-slate-700 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
                        <span>Completion Rate</span>
                      </span>
                      <span className={isCompleted ? 'text-emerald-600' : 'text-sky-600'}>
                        {progressVal}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : progressVal >= 40
                            ? 'bg-gradient-to-r from-sky-500 to-blue-500'
                            : 'bg-gradient-to-r from-amber-500 to-orange-400'
                        }`}
                        style={{ width: `${progressVal}%` }}
                      ></div>
                    </div>

                    {/* Lesson Counters (Completed & Pending) */}
                    <div className="flex items-center justify-between text-[11px] font-bold pt-1">
                      <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Completed: {completedLessons}</span>
                      </span>
                      <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Pending: {pendingLessons}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button: Open Lesson Checklist Modal */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setChecklistModalEnrollment(enr)}
                    className="w-full py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs transition-all flex items-center justify-between cursor-pointer shadow-md shadow-sky-500/20 group-hover:bg-sky-600"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-white" />
                      <span>Manage Lessons ({completedLessons}/{totalLessons})</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center text-slate-400 bg-white rounded-3xl border border-sky-100 space-y-3 shadow-xs">
          <AlertCircle className="w-12 h-12 mx-auto text-sky-300" />
          <div className="space-y-1">
            <p className="font-bold text-slate-700 text-base">No Matching Progress Records Found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your student filter, search query, or course status selection.
            </p>
          </div>
        </div>
      )}

      {/* --- REAL-TIME LESSON PROGRESS INSPECTOR MODAL --- */}
      {checklistModalEnrollment && (() => {
        // Fetch fresh enrollment record from LMSContext state
        const currentEnr = enrollments.find((e) => e.id === checklistModalEnrollment.id) || checklistModalEnrollment;
        const currentLessons = getEnrollmentLessons(currentEnr);
        const currentCompleted = currentLessons.filter((l) => l.completed).length;
        const currentTotal = currentLessons.length;
        const currentPending = currentTotal - currentCompleted;
        const currentProgress = Math.round((currentCompleted / currentTotal) * 100);
        const isFinished = currentProgress === 100;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 w-full max-w-xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Interactive Lesson Checklist</h3>
                    <p className="text-xs text-slate-500">Student Progress & Syllabus Tracking</p>
                  </div>
                </div>
                <button
                  onClick={() => setChecklistModalEnrollment(null)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Student & Course Summary */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-600 text-white font-extrabold flex items-center justify-center text-xs">
                      {currentEnr.studentName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Learner Profile</p>
                      <h4 className="font-extrabold text-slate-900 text-xs">{currentEnr.studentName}</h4>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-sky-200 text-sky-700 text-[10px] font-bold">
                    {currentEnr.courseCategory || 'General'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{currentEnr.courseTitle}</h3>

                {/* Progress Bar in Modal */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600">Course Completion Percentage</span>
                    <span className={isFinished ? 'text-emerald-600 font-extrabold' : 'text-sky-600 font-extrabold'}>
                      {currentProgress}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFinished ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-sky-500 to-blue-500'
                      }`}
                      style={{ width: `${currentProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold pt-1">
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{currentCompleted} Completed Lessons</span>
                    </span>
                    <span className="text-amber-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{currentPending} Pending Lessons</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Lesson Checklist Items (Student Interactive, Admin Read-Only Audit Log) */}
              {(() => {
                const canEditProgress = isStudent && (
                  currentEnr.studentId === 's_manikanta' ||
                  currentEnr.studentEmail?.toLowerCase() === user?.email?.toLowerCase()
                );

                return (
                  <div className="space-y-3">

                    <div className="space-y-2">
                      {currentLessons.map((lesson, idx) => (
                        <div
                          key={lesson.id || idx}
                          onClick={() => {
                            if (canEditProgress) {
                              toggleLessonCompletion(currentEnr.id, idx);
                            }
                          }}
                          className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                            canEditProgress ? 'cursor-pointer' : 'cursor-default'
                          } ${
                            lesson.completed
                              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900 font-semibold shadow-xs'
                              : 'bg-slate-50 border-slate-200/90 text-slate-700 hover:border-sky-300 hover:bg-sky-50/40'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {lesson.completed ? (
                              <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-400 shrink-0" />
                            )}
                            <span className={`text-xs ${lesson.completed ? 'line-through text-emerald-700 font-bold' : 'font-medium'}`}>
                              {lesson.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 ml-2 shrink-0">
                            <span className="text-[11px] text-slate-400 font-mono">{lesson.duration}</span>
                            {!canEditProgress && (
                              <Lock className="w-3.5 h-3.5 text-slate-400" title="Read-Only Audit" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Modal Footer */}
              <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                <button
                  onClick={() => setChecklistModalEnrollment(null)}
                  className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition"
                >
                  Done / Close Inspector
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default LearningProgress;
