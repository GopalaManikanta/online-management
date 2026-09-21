import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
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
  Trash2,
  Lock,
  Unlock,
  FileText,
  Send,
  HelpCircle,
  Timer,
  RefreshCw
} from 'lucide-react';

const StudentPortal = () => {
  const { user } = useAuth();
  const {
    courses = [],
    enrollments = [],
    students = [],
    instructors = [],
    assignments = [],
    quizzes = [],
    addEnrollment,
    removeEnrollment,
    toggleLessonCompletion,
    submitAssignment,
    submitQuizAttempt,
    liveClasses = [],
  } = useLMS();

  // Current Logged-in Student Object dynamically matched from Auth session
  const currentStudent = (user && students.find(
    (s) => s.email?.toLowerCase() === user.email?.toLowerCase() || s.id === user.id
  )) || {
    id: user?.id || 's_student',
    name: user?.name || 'Student User',
    email: user?.email || 'student@edusync.com',
    qualification: 'Computer Science & Engineering',
    enrollmentDate: '2026-01-10',
  };

  const [activeTab, setActiveTab] = useState('my-courses'); // 'my-courses' | 'explore' | 'certificates' | 'instructors'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Course Hub & Learning Player States
  const [activeLearningCourse, setActiveLearningCourse] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [hubTab, setHubTab] = useState('lessons'); // 'lessons' | 'assignment' | 'quiz' | 'certificate'
  const [asgText, setAsgText] = useState('');
  const [asgLink, setAsgLink] = useState('');

  // Inline Timed Quiz Player Modal State
  const [activeQuizModal, setActiveQuizModal] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(300);
  const [quizResultModal, setQuizResultModal] = useState(null);

  // Certificate, Unenroll & Course Overview / Confirmation Modal States
  const [viewingCertificate, setViewingCertificate] = useState(null);
  const [droppingEnrollment, setDroppingEnrollment] = useState(null);
  const [previewingCourse, setPreviewingCourse] = useState(null);
  const [confirmingEnrollmentCourse, setConfirmingEnrollmentCourse] = useState(null);

  // Student's Personal Enrollments (Strictly filtered for Gopala Manikanta)
  const studentEnrollments = enrollments.filter(
    (e) => e.studentId === currentStudent.id || e.studentEmail?.toLowerCase() === currentStudent.email?.toLowerCase()
  );

  // Helper function: Strictly check if a course is OVERALL completed (Lessons 100% + Assignment + Quiz Passed)
  const isCourseFullyCompleted = (enr) => {
    const isLessonsDone = (enr.progress || 0) === 100;
    const courseAsg = assignments.find((a) => a.courseId === enr.courseId);
    const isAsgDone = courseAsg?.status === 'Submitted' || courseAsg?.status === 'Graded';
    const courseQz = quizzes.find((q) => q.courseId === enr.courseId);
    const isQuizPassed = courseQz?.userAttempt?.passed === true;

    return isLessonsDone && isAsgDone && isQuizPassed;
  };

  const completedEnrollments = studentEnrollments.filter(isCourseFullyCompleted);
  const completedCount = completedEnrollments.length;
  const activeCount = studentEnrollments.length - completedCount;

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

  // Start Inline Quiz Player
  const handleStartQuiz = (qz) => {
    setActiveQuizModal(qz);
    setSelectedAnswers({});
    setCurrentQuestionIdx(0);
    setTimeLeftSeconds((qz.timeLimit || 5) * 60);
  };

  // Final Quiz Submission
  const handleFinalQuizSubmit = (forceAutoSubmit = false) => {
    if (!activeQuizModal) return;
    const questions = activeQuizModal.questions || [];

    const missingIndices = [];
    questions.forEach((_, idx) => {
      if (selectedAnswers[idx] === undefined) {
        missingIndices.push(idx + 1);
      }
    });

    if (forceAutoSubmit !== true && missingIndices.length > 0) {
      toast.warning(
        `⚠️ Please answer all questions before submitting! Unanswered: Q${missingIndices.join(', Q')}`
      );
      setCurrentQuestionIdx(missingIndices[0] - 1);
      return;
    }

    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score += Math.round((activeQuizModal.totalMarks || 50) / questions.length);
      }
    });

    const percentage = Math.round((score / (activeQuizModal.totalMarks || 50)) * 100);
    const passed = percentage >= 70;

    submitQuizAttempt(
      activeQuizModal.id,
      selectedAnswers,
      score,
      percentage,
      passed,
      { id: currentStudent.id, name: currentStudent.name, email: currentStudent.email }
    );

    setQuizResultModal({
      quiz: activeQuizModal,
      score,
      percentage,
      passed,
    });

    setActiveQuizModal(null);
  };

  // Quiz Timer Effect
  useEffect(() => {
    let timer = null;
    if (activeQuizModal && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    } else if (activeQuizModal && timeLeftSeconds === 0) {
      handleFinalQuizSubmit(true);
    }
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuizModal, timeLeftSeconds]);

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
          <p className="text-[11px] text-sky-100 font-mono">
            Student ID: {currentStudent.id ? `STU-${currentStudent.id.toString().replace(/^usr_|^s_/, '').toUpperCase()}-2026` : 'STU-2026'}
          </p>
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
                const isFullyDone = isCourseFullyCompleted(enr);
                const statusLower = (enr.status || 'Active').toLowerCase();
                const progressVal = typeof enr.progress === 'number' ? enr.progress : isFullyDone ? 100 : 45;

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
                          {isFullyDone ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-md flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Completed</span>
                            </span>
                          ) : statusLower === 'pending' ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-md flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Pending</span>
                            </span>
                          ) : (statusLower === 'cancelled' || statusLower === 'canceled') ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500 text-white shadow-md flex items-center gap-1">
                              <X className="w-3 h-3" />
                              <span>Cancelled</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500 text-white shadow-md flex items-center gap-1">
                              <PlayCircle className="w-3 h-3" />
                              <span>In Progress</span>
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
                      {(() => {
                        const courseAsg = assignments.find((a) => a.courseId === enr.courseId || a.courseTitle?.toLowerCase() === enr.courseTitle?.toLowerCase());
                        const courseQz = quizzes.find((q) => q.courseId === enr.courseId || q.courseTitle?.toLowerCase() === enr.courseTitle?.toLowerCase());

                        const isLessonsDone = progressVal === 100;
                        const isAsgDone = Boolean(courseAsg && (courseAsg.status === 'Submitted' || courseAsg.status === 'Graded'));
                        const isQuizPassed = Boolean(courseQz && courseQz.userAttempt?.passed === true);
                        const isCertReady = isLessonsDone && isAsgDone && isQuizPassed;

                        const handleOpenHub = (explicitTab) => {
                          let targetTab = explicitTab;
                          if (!targetTab) {
                            if (isCertReady) targetTab = 'certificate';
                            else if (isAsgDone && isLessonsDone) targetTab = 'quiz';
                            else if (isLessonsDone) targetTab = 'assignment';
                            else targetTab = 'lessons';
                          }
                          setHubTab(targetTab);
                          setActiveLearningCourse(enr);
                          setActiveLessonIndex(0);
                        };

                        return (
                          <div className="flex items-center gap-2 w-full">
                            {isCertReady ? (
                              <button
                                onClick={() => handleOpenHub('certificate')}
                                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs transition-colors shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <Award className="w-4 h-4" />
                                <span>View Verified Certificate</span>
                              </button>
                            ) : isAsgDone ? (
                              <button
                                onClick={() => handleOpenHub('quiz')}
                                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs transition-colors shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <Timer className="w-4 h-4" />
                                <span>{isQuizPassed ? 'Step 4: Certificate →' : 'Step 3: Take Quiz →'}</span>
                              </button>
                            ) : isLessonsDone ? (
                              <button
                                onClick={() => handleOpenHub('assignment')}
                                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <FileText className="w-4 h-4" />
                                <span>Step 2: Submit Assignment →</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenHub('lessons')}
                                className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs transition-colors shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <PlayCircle className="w-4 h-4" />
                                <span>Continue Lessons ({progressVal}%)</span>
                              </button>
                            )}

                            <button
                              onClick={() => setDroppingEnrollment(enr)}
                              className="px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 hover:border-red-200 shrink-0"
                              title="Drop Active Course"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Drop</span>
                            </button>
                          </div>
                        );
                      })()}
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
          {/* Upcoming Live Classes Section for Students */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-sky-600 animate-pulse" />
                <h3 className="text-base font-bold text-slate-900">Upcoming Live Interactive Sessions</h3>
              </div>
              <span className="text-xs font-semibold text-sky-600 font-mono">
                {liveClasses.length} Scheduled Sessions
              </span>
            </div>

            {liveClasses.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No live classes currently scheduled for your courses.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveClasses.map((lc) => {
                  const isLiveNow = lc.status === 'Live Now';
                  return (
                    <div
                      key={lc.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                        isLiveNow
                          ? 'bg-gradient-to-r from-red-50/80 via-sky-50/40 to-white border-red-200 shadow-xs'
                          : 'bg-slate-50/70 border-slate-100 hover:border-sky-200'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-700 font-bold text-[10px] uppercase tracking-wide">
                            {lc.courseTitle}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                              isLiveNow ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isLiveNow ? 'bg-white' : 'bg-slate-500'}`} />
                            <span>{lc.status}</span>
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{lc.topic}</h4>

                        <div className="text-[11px] text-slate-500 space-y-1">
                          <p>Instructor: <strong className="text-slate-700">{lc.instructor}</strong></p>
                          <p>Schedule: <strong className="text-sky-600">{lc.date}, {lc.time}</strong> ({lc.platform || 'Google Meet'})</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (isLiveNow) {
                            toast.success(`Connecting to live class: ${lc.topic}`);
                          } else {
                            toast.info(`Live session scheduled for ${lc.date}, ${lc.time}`);
                          }
                        }}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          isLiveNow
                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/25'
                            : 'bg-sky-500 hover:bg-sky-600 text-white shadow-xs'
                        }`}
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>{isLiveNow ? 'Join Live Class' : 'Join Class'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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

          {completedEnrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedEnrollments.map((enr) => {
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

      {/* --- COURSE HUB & 4-STEP SEQUENTIAL WORKFLOW MODAL --- */}
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

        const courseAsg = assignments.find(
          (a) => a.courseId === freshCourseRecord.courseId || a.courseTitle?.toLowerCase() === freshCourseRecord.courseTitle?.toLowerCase()
        ) || {
          id: `asg_${freshCourseRecord.courseId || Date.now()}`,
          courseId: freshCourseRecord.courseId,
          courseTitle: freshCourseRecord.courseTitle,
          title: `${freshCourseRecord.courseTitle} Practical Capstone Project`,
          instructions: `Build and submit your practical project demonstrating core concepts taught in ${freshCourseRecord.courseTitle}. Include repository URL and notes.`,
          totalMarks: 100,
          status: 'Pending',
          solutionText: `Official Reference Solution Key for ${freshCourseRecord.courseTitle}:\n1. Implement modular component architecture.\n2. Handle async state management & API integration.\n3. Follow clean code guidelines and deploy live application.`,
          solutionLink: 'https://github.com/edusync-official/solution-repo',
        };

        const courseQz = quizzes.find(
          (q) => q.courseId === freshCourseRecord.courseId || q.courseTitle?.toLowerCase() === freshCourseRecord.courseTitle?.toLowerCase()
        ) || {
          id: `quiz_${freshCourseRecord.courseId || Date.now()}`,
          courseId: freshCourseRecord.courseId,
          courseTitle: freshCourseRecord.courseTitle,
          title: `${freshCourseRecord.courseTitle} Assessment Quiz`,
          instructions: `Answer all 5 multiple choice questions within 5 minutes. Pass score requirement: 70% or higher.`,
          durationMinutes: 5,
          totalMarks: 50,
          passMarks: 35,
          status: 'Available',
          userAttempt: null,
          questions: [
            {
              id: 'q1',
              question: `What is the primary objective of ${freshCourseRecord.courseTitle}?`,
              options: ['To build production-grade web applications', 'To style HTML with CSS', 'To clean database logs', 'To compile C++ binaries'],
              correctAnswer: 0,
              explanation: 'Production web application architecture is the core goal of this curriculum.',
            },
            {
              id: 'q2',
              question: 'Which architectural pattern separates data logic from presentation components?',
              options: ['MVC / Component Architecture', 'Monolithic Binary', 'Single Threaded Loop', 'Linear Assembly'],
              correctAnswer: 0,
              explanation: 'Component-based MVC pattern decouples state management from rendering UI.',
            },
            {
              id: 'q3',
              question: 'What is the recommended approach for handling asynchronous data fetching?',
              options: ['Async/Await with try-catch blocks', 'Synchronous while loops', 'Global var declarations', 'Inline script tags'],
              correctAnswer: 0,
              explanation: 'Async/await with try-catch provides clean, non-blocking asynchronous error handling.',
            },
            {
              id: 'q4',
              question: 'Where should application state be managed for scalable applications?',
              options: ['Centralized State Store / Context', 'DOM attributes', 'Global window variables', 'Hardcoded text strings'],
              correctAnswer: 0,
              explanation: 'Centralized state management ensures single source of truth across components.',
            },
            {
              id: 'q5',
              question: 'What is the best practice for deploying production web applications?',
              options: ['Automated CI/CD pipelines to cloud hosting', 'Manual FTP copy', 'Emailing ZIP files', 'Running localhost server'],
              correctAnswer: 0,
              explanation: 'CI/CD pipelines automate testing, building, and zero-downtime cloud deployments.',
            },
          ],
        };

        const isLessonsDone = (freshCourseRecord.progress || 0) === 100;
        const isAsgDone = courseAsg?.status === 'Submitted' || courseAsg?.status === 'Graded';
        const isQuizPassed = courseQz?.userAttempt?.passed === true;
        const isCertReady = isLessonsDone && isAsgDone && isQuizPassed;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-sky-100 space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700">
                    Interactive Learning Hub & 4-Step Academic Workflow
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

              {/* 4-Step Navigation Tabs */}
              <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto text-xs font-bold">
                <button
                  onClick={() => setHubTab('lessons')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                    hubTab === 'lessons'
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Step 1: Lessons ({freshCourseRecord.progress || 0}%)</span>
                </button>

                <button
                  onClick={() => setHubTab('assignment')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                    hubTab === 'assignment'
                      ? 'bg-sky-500 text-white shadow-md'
                      : !isLessonsDone
                      ? 'text-slate-400 opacity-60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {!isLessonsDone ? <Lock className="w-3.5 h-3.5 text-amber-500" /> : <FileText className="w-3.5 h-3.5" />}
                  <span>Step 2: Assignment</span>
                </button>

                <button
                  onClick={() => setHubTab('quiz')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                    hubTab === 'quiz'
                      ? 'bg-sky-500 text-white shadow-md'
                      : !isAsgDone
                      ? 'text-slate-400 opacity-60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {!isAsgDone ? <Lock className="w-3.5 h-3.5 text-amber-500" /> : <Timer className="w-3.5 h-3.5" />}
                  <span>Step 3: Quiz</span>
                </button>

                <button
                  onClick={() => setHubTab('certificate')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                    hubTab === 'certificate'
                      ? 'bg-amber-500 text-white shadow-md'
                      : !isCertReady
                      ? 'text-slate-400 opacity-60'
                      : 'text-amber-700 bg-amber-100 hover:bg-amber-200'
                  }`}
                >
                  {!isCertReady ? <Lock className="w-3.5 h-3.5 text-amber-500" /> : <Award className="w-3.5 h-3.5 text-amber-600" />}
                  <span>Step 4: Certificate</span>
                </button>
              </div>

              {/* STEP 1: LESSONS & STREAM PLAYER */}
              {hubTab === 'lessons' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* Video Player Placeholder */}
                  <div className="relative h-52 sm:h-64 rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center shadow-lg group">
                    <img
                      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
                      alt="Lesson Video"
                      className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-2">
                      <div className="w-14 h-14 rounded-full bg-sky-500/90 text-white flex items-center justify-center shadow-xl backdrop-blur-md transform group-hover:scale-110 transition-transform">
                        <PlayCircle className="w-9 h-9" />
                      </div>
                      <p className="font-bold text-sm">
                        {activeCourseLessons[activeLessonIndex]?.title || 'Lesson Stream'}
                      </p>
                      <span className="text-xs text-sky-200 font-mono">
                        Duration: {activeCourseLessons[activeLessonIndex]?.duration || '15 mins'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Header */}
                  <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-sky-900">Course Lessons Progress</span>
                      <span className="text-sky-600">{freshCourseRecord.progress || 0}% Completed</span>
                    </div>
                    <div className="w-full h-3 bg-sky-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500"
                        style={{ width: `${freshCourseRecord.progress || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-sky-700 font-medium">
                      {isLessonsDone
                        ? '🎉 Step 1 Complete (100%)! Proceed to Step 2 to submit your Course Assignment.'
                        : 'Complete all 5 course lessons (100%) to unlock Step 2: Course Assignment.'}
                    </p>
                  </div>

                  {/* Lesson Checklist */}
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Lesson Checklist</h4>
                    {activeCourseLessons.map((lesson, idx) => {
                      const isLessonDone = lesson.completed || idx <= Math.floor(((freshCourseRecord.progress || 0) / 100) * activeCourseLessons.length) - 1;

                      return (
                        <div
                          key={idx}
                          onClick={() => setActiveLessonIndex(idx)}
                          className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
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

                  {isLessonsDone && (
                    <button
                      onClick={() => setHubTab('assignment')}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Proceed to Step 2: Course Assignment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {/* STEP 2: ASSIGNMENT */}
              {hubTab === 'assignment' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {!isLessonsDone ? (
                    <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-200 text-center space-y-3">
                      <Lock className="w-10 h-10 text-amber-500 mx-auto" />
                      <h3 className="text-base font-extrabold text-amber-900">Step 2: Course Assignment Locked</h3>
                      <p className="text-xs text-amber-700 max-w-md mx-auto leading-relaxed">
                        Please complete 100% of your course lessons in <strong>Step 1</strong> before unlocking this course assignment.
                      </p>
                      <button
                        onClick={() => setHubTab('lessons')}
                        className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                      >
                        Go to Step 1: Lessons
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                        <Unlock className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Step 1 Lessons Complete! Course Assignment is unlocked. Submit your project below.</span>
                      </div>

                      <div className="bg-white p-5 rounded-3xl border-2 border-sky-100 shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-sky-100 text-sky-600">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-sky-600 uppercase">Practical Assignment Project</span>
                              <h4 className="font-extrabold text-slate-800 text-sm">{courseAsg?.title || `${freshCourseRecord.courseTitle} Project`}</h4>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                            isAsgDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {courseAsg?.status || 'Pending'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">{courseAsg?.instructions || 'Build and deploy a complete project module demonstrating core concepts taught in this course.'}</p>

                        {isAsgDone ? (
                          <div className="space-y-3">
                            <div className="p-3 bg-emerald-50 rounded-2xl text-xs text-emerald-900 space-y-1">
                              <p className="font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Assignment Submitted!</span>
                              </p>
                            </div>

                            {courseAsg?.solutionText && (
                              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs space-y-1.5">
                                <span className="font-extrabold text-amber-900 flex items-center gap-1.5">
                                  <Sparkles className="w-4 h-4 text-amber-600" />
                                  Official Faculty Reference Solution Key
                                </span>
                                <pre className="text-xs text-slate-800 bg-white p-3 rounded-xl border border-amber-200 font-mono whitespace-pre-wrap leading-relaxed">
                                  {courseAsg.solutionText}
                                </pre>
                              </div>
                            )}

                            <button
                              onClick={() => setHubTab('quiz')}
                              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <span>Proceed to Step 3: Assessment Quiz</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3 pt-2">
                            <textarea
                              rows="2"
                              placeholder="Type your project submission notes / summary here..."
                              value={asgText}
                              onChange={(e) => setAsgText(e.target.value)}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                            ></textarea>
                            <input
                              type="text"
                              placeholder="GitHub Repository or Demo URL (e.g. https://github.com/...)"
                              value={asgLink}
                              onChange={(e) => setAsgLink(e.target.value)}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                            />
                            <button
                              onClick={() => {
                                if (!asgText.trim() && !asgLink.trim()) {
                                  toast.warning('Please enter submission details or repository link!');
                                  return;
                                }
                                let finalLink = asgLink.trim();
                                if (finalLink && !finalLink.startsWith('http://') && !finalLink.startsWith('https://')) {
                                  finalLink = `https://${finalLink}`;
                                }
                                if (courseAsg) {
                                  submitAssignment(
                                    courseAsg.id,
                                    { submissionText: asgText, submissionLink: finalLink },
                                    { id: currentStudent.id, name: currentStudent.name, email: currentStudent.email }
                                  );
                                  toast.success('Assignment submitted! Step 3: Assessment Quiz is now UNLOCKED.');
                                }
                              }}
                              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                            >
                              <Send className="w-4 h-4" />
                              <span>Submit Course Assignment</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: QUIZ */}
              {hubTab === 'quiz' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {!isAsgDone ? (
                    <div className="p-6 rounded-3xl bg-purple-50 border-2 border-purple-200 text-center space-y-3">
                      <Lock className="w-10 h-10 text-purple-500 mx-auto" />
                      <h3 className="text-base font-extrabold text-purple-900">Step 3: Assessment Quiz Locked</h3>
                      <p className="text-xs text-purple-700 max-w-md mx-auto leading-relaxed">
                        {!isLessonsDone
                          ? 'Please complete 100% of your course lessons in Step 1 first.'
                          : 'Please submit your Course Assignment in Step 2 before unlocking this timed assessment quiz.'}
                      </p>
                      <button
                        onClick={() => setHubTab(!isLessonsDone ? 'lessons' : 'assignment')}
                        className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                      >
                        {!isLessonsDone ? 'Go to Step 1: Lessons' : 'Go to Step 2: Assignment'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                        <Unlock className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Step 2 Assignment Submitted! Timed Assessment Quiz is unlocked.</span>
                      </div>

                      <div className="bg-white p-5 rounded-3xl border-2 border-purple-100 shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
                              <HelpCircle className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-purple-600 uppercase">Timed Assessment Quiz</span>
                              <h4 className="font-extrabold text-slate-800 text-sm">{courseQz?.title || `${freshCourseRecord.courseTitle} Quiz`}</h4>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                            isQuizPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {isQuizPassed ? 'Passed' : 'Available'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">{courseQz?.instructions || 'Answer all 5 multiple-choice questions within 5 minutes. Pass score requirement: 70% or higher.'}</p>

                        {isQuizPassed ? (
                          <div className="space-y-3">
                            <div className="p-3 bg-emerald-50 rounded-2xl text-xs text-emerald-900 space-y-1">
                              <p className="font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Quiz Passed with Score: {courseQz.userAttempt?.score} / {courseQz.userAttempt?.maxScore || 50} ({courseQz.userAttempt?.percentage}%)</span>
                              </p>
                            </div>

                            <button
                              onClick={() => setHubTab('certificate')}
                              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <span>Proceed to Step 4: Academic Certificate</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {courseQz?.userAttempt?.passed === false && (
                              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                                <span>Quiz Failed (Score: {courseQz.userAttempt?.score}/50 - {courseQz.userAttempt?.percentage}%). Minimum 70% required to unlock certificate!</span>
                              </div>
                            )}
                            <button
                              onClick={() => courseQz && handleStartQuiz(courseQz)}
                              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                            >
                              <Timer className="w-4 h-4" />
                              <span>{courseQz?.userAttempt?.passed === false ? 'Retake Timed Course Quiz' : 'Start Timed Course Quiz'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: CERTIFICATE */}
              {hubTab === 'certificate' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {!isCertReady ? (
                    <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 text-center space-y-4">
                      <Lock className="w-10 h-10 text-slate-400 mx-auto" />
                      <h3 className="text-base font-extrabold text-slate-800">Step 4: Academic Certificate Locked</h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Complete all 3 prerequisites below to generate your official verified Certificate of Completion:
                      </p>
                      <div className="max-w-md mx-auto bg-white p-4 rounded-2xl border border-slate-200 text-left space-y-2.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Step 1: Course Lessons (100% Progress)</span>
                          <span className={`font-bold ${isLessonsDone ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {isLessonsDone ? '✓ Completed' : '🔒 Pending'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Step 2: Course Assignment Submission</span>
                          <span className={`font-bold ${isAsgDone ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {isAsgDone ? '✓ Submitted' : '🔒 Pending'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Step 3: Course Quiz Passed (&gt;= 70%)</span>
                          <span className={`font-bold ${isQuizPassed ? 'text-emerald-600' : 'text-purple-600'}`}>
                            {isQuizPassed ? '✓ Passed' : '🔒 Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-amber-100/50 to-sky-50 border-2 border-amber-300 text-center space-y-5 shadow-lg">
                      <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
                        <Award className="w-9 h-9" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest block">Verified Academic Achievement</span>
                        <h3 className="text-xl font-extrabold text-slate-900">Certificate of Completion Unlocked & Generated!</h3>
                        <p className="text-xs text-slate-600 max-w-md mx-auto">
                          Congratulations! You have successfully completed Step 1 Lessons, Step 2 Assignment, and Step 3 Quiz for <strong>{freshCourseRecord.courseTitle}</strong>.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setViewingCertificate({
                            id: freshCourseRecord.id,
                            courseTitle: freshCourseRecord.courseTitle,
                            enrollmentDate: freshCourseRecord.enrollmentDate || new Date().toLocaleDateString(),
                          });
                        }}
                        className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 mx-auto cursor-pointer transition"
                      >
                        <Award className="w-4 h-4" />
                        <span>View & Print Official Certificate</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setActiveLearningCourse(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Close Player
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* --- INLINE TIMED QUIZ PLAYER MODAL --- */}
      {activeQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 w-full max-w-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150 relative">
            {/* Top Right Close Button */}
            <button
              onClick={() => setActiveQuizModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer z-10"
              title="Close Quiz"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 pr-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-600">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{activeQuizModal.title}</h3>
                  <p className="text-xs text-slate-500">Timed Assessment Quiz (Pass score &gt;= 70%)</p>
                </div>
              </div>

              {/* Timer Pill */}
              <div className={`px-4 py-2 rounded-2xl font-mono text-sm font-extrabold flex items-center gap-2 ${
                timeLeftSeconds < 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-purple-100 text-purple-800'
              }`}>
                <Timer className="w-4 h-4" />
                <span>{Math.floor(timeLeftSeconds / 60).toString().padStart(2, '0')}:{(timeLeftSeconds % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>

            {/* Question Card */}
            {(() => {
              const questions = activeQuizModal.questions || [];
              const currentQ = questions[currentQuestionIdx];
              if (!currentQ) return null;

              return (
                <div className="space-y-5">
                  {/* Question Navigator Dots */}
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                    <span>Question {currentQuestionIdx + 1} of {questions.length}</span>
                    <div className="flex items-center gap-1.5">
                      {questions.map((_, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => setCurrentQuestionIdx(qIdx)}
                          className={`w-7 h-7 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                            currentQuestionIdx === qIdx
                              ? 'bg-purple-600 text-white shadow-sm'
                              : selectedAnswers[qIdx] !== undefined
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {qIdx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question Title */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-extrabold text-purple-600 uppercase">Question #{currentQuestionIdx + 1}</span>
                    <h4 className="font-extrabold text-slate-900 text-sm leading-relaxed">{currentQ.question || currentQ.questionText}</h4>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2.5">
                    {currentQ.options?.map((opt, oIdx) => {
                      const isSelected = selectedAnswers[currentQuestionIdx] === oIdx;
                      return (
                        <div
                          key={oIdx}
                          onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQuestionIdx]: oIdx })}
                          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'border-purple-600 bg-purple-50/70 font-semibold shadow-xs'
                              : 'border-slate-200 hover:border-purple-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 text-xs">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              isSelected ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {String.fromCharCode(65 + oIdx)}
                            </div>
                            <span className="text-slate-800">{opt}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-bold">
                    <button
                      type="button"
                      disabled={currentQuestionIdx === 0}
                      onClick={() => setCurrentQuestionIdx((prev) => prev - 1)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl cursor-pointer"
                    >
                      ← Previous Question
                    </button>

                    {currentQuestionIdx < questions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                        className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md cursor-pointer"
                      >
                        Next Question →
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleFinalQuizSubmit(false)}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit Quiz Answers</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* --- QUIZ RESULT MODAL --- */}
      {quizResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 sm:p-8 space-y-5 text-center animate-in zoom-in-95 duration-150 relative">
            <button
              onClick={() => setQuizResultModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              title="Close Result"
            >
              <X className="w-5 h-5" />
            </button>
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white shadow-lg ${
              quizResultModal.passed ? 'bg-emerald-500' : 'bg-red-500'
            }`}>
              {quizResultModal.passed ? <CheckCircle2 className="w-9 h-9" /> : <AlertTriangle className="w-9 h-9" />}
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">
                {quizResultModal.passed ? '🎉 Quiz Passed!' : '🔴 Quiz Failed'}
              </h3>
              <p className="text-xs text-slate-500">{quizResultModal.quiz.title}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
              <div className="text-2xl font-black text-slate-900">
                {quizResultModal.score} <span className="text-sm font-normal text-slate-500">/ {quizResultModal.quiz.totalMarks || 50} Marks</span>
              </div>
              <div className="text-xs font-bold text-sky-600">
                Percentage Score: {quizResultModal.percentage}%
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                {quizResultModal.passed
                  ? 'Congratulations! You have passed Step 3 Quiz. Your official Certificate of Completion is now UNLOCKED & GENERATED!'
                  : 'You scored below the 70% passing requirement. Please review the course lessons and click Retake Quiz.'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              {quizResultModal.passed ? (
                <button
                  onClick={() => {
                    setQuizResultModal(null);
                    setHubTab('certificate');
                  }}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Proceed to Step 4: Certificate</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    const qz = quizResultModal.quiz;
                    setQuizResultModal(null);
                    handleStartQuiz(qz);
                  }}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retake Quiz Now</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
                  const courseObj = confirmingEnrollmentCourse;
                  addEnrollment({
                    studentId: currentStudent.id,
                    studentEmail: currentStudent.email,
                    courseId: courseObj.id,
                    status: 'Active',
                    progress: 10,
                  });
                  setConfirmingEnrollmentCourse(null);
                  setActiveTab('my-courses');

                  // Launch active learning player for this course immediately
                  const existingEnr = enrollments.find(
                    (e) =>
                      (e.studentId === currentStudent.id || e.studentEmail?.toLowerCase() === currentStudent.email?.toLowerCase()) &&
                      e.courseId === courseObj.id
                  );
                  if (existingEnr) {
                    setActiveLearningCourse(existingEnr);
                  } else {
                    setActiveLearningCourse({
                      id: `enr_${Date.now()}`,
                      studentId: currentStudent.id,
                      studentName: currentStudent.name,
                      studentEmail: currentStudent.email,
                      courseId: courseObj.id,
                      courseTitle: courseObj.title,
                      courseCategory: courseObj.category || 'General',
                      progress: 10,
                      enrollmentDate: new Date().toISOString().split('T')[0],
                    });
                  }
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
