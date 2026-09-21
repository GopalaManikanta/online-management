import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLMS } from '../../context/LMSContext';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  Plus,
  Search,
  Star,
  Clock,
  User,
  X,
  BookOpen,
  Edit2,
  Trash2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  CheckSquare,
  Square,
  Lock,
  Unlock,
  Award,
  Printer,
  FileText,
  HelpCircle,
  Send,
  Timer,
  PlayCircle
} from 'lucide-react';

const ITEMS_PER_PAGE = 6;

const CoursesList = () => {
  const { user } = useAuth();
  const {
    courses,
    enrollments,
    instructors,
    assignments,
    quizzes,
    loading,
    error,
    addCourse,
    updateCourse,
    deleteCourse,
    addEnrollment,
    removeEnrollment,
    toggleLessonCompletion,
    DEFAULT_COURSE_LESSONS,
    submitAssignment,
    submitQuizAttempt,
  } = useLMS();

  const isStudent = user?.role === 'Student';

  // Search, Filter, Sort, Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'name-asc' | 'name-desc' | 'rating-desc' | 'price-asc'
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [viewingCourse, setViewingCourse] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [confirmingEnrollmentCourse, setConfirmingEnrollmentCourse] = useState(null);
  const [customInstructorName, setCustomInstructorName] = useState('');

  // Course Hub Modal States
  const [hubTab, setHubTab] = useState('overview'); // 'overview' | 'lessons' | 'assignment_quiz' | 'certificate'
  const [asgText, setAsgText] = useState('');
  const [asgLink, setAsgLink] = useState('');

  // Course Quiz Player State
  const [activeQuizModal, setActiveQuizModal] = useState(null);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizTimerSec, setQuizTimerSec] = useState(0);

  // Certificate Modal State
  const [viewingCertModal, setViewingCertModal] = useState(null);

  const categories = ['All', 'React', 'JavaScript', 'Node.js', 'UI/UX Design', 'Python', 'Data Science'];

  // React Hook Form for Add/Edit
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const watchInstructor = useWatch({ control, name: 'instructor' });

  // Quiz finish handler with mandatory answer validation
  const handleFinishQuiz = useCallback((forceAutoSubmit = false) => {
    if (!activeQuizModal) return;
    const questions = activeQuizModal.questions || [];

    if (!forceAutoSubmit) {
      const unansweredIndices = [];
      questions.forEach((_, idx) => {
        if (quizAnswers[idx] === undefined) {
          unansweredIndices.push(idx + 1);
        }
      });

      if (unansweredIndices.length > 0) {
        toast.warning(
          `Please answer all questions before submitting! Unanswered: Q${unansweredIndices.join(', Q')}`
        );
        const firstUnanswered = unansweredIndices[0] - 1;
        setQuizIdx(firstUnanswered);
        return;
      }
    }

    let earnedScore = 0;
    questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) {
        earnedScore += 10;
      }
    });

    const maxScore = questions.length * 10 || 50;
    const passMarks = activeQuizModal.passMarks || 35;
    const percentage = Math.round((earnedScore / maxScore) * 100);
    const passed = earnedScore >= passMarks;

    const attemptPayload = {
      attemptedAt: new Date().toLocaleString(),
      score: earnedScore,
      maxScore,
      percentage,
      passed,
      userAnswers: quizAnswers,
    };

    submitQuizAttempt(activeQuizModal.id, attemptPayload);

    setActiveQuizModal(null);
  }, [activeQuizModal, quizAnswers, submitQuizAttempt]);

  // Quiz Timer Effect
  useEffect(() => {
    let interval = null;
    if (activeQuizModal && quizTimerSec > 0) {
      interval = setInterval(() => {
        setQuizTimerSec((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleFinishQuiz(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeQuizModal, quizTimerSec, handleFinishQuiz]);

  // Open Add Modal cleanly
  const handleOpenAdd = () => {
    reset();
    setEditingCourse(null);
    setCustomInstructorName('');
    if (instructors && instructors.length > 0) {
      setValue('instructor', instructors[0].name);
    }
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setValue('title', course.title);

    const exists = instructors?.some((i) => i.name === course.instructor);
    if (exists) {
      setValue('instructor', course.instructor);
      setCustomInstructorName('');
    } else {
      setValue('instructor', '__custom__');
      setCustomInstructorName(course.instructor || '');
    }

    setValue('category', course.category);
    setValue('duration', course.duration);
    setValue('level', course.level);
    setValue('price', course.price.replace('$', ''));
    setValue('rating', course.rating);
    setValue('thumbnail', course.thumbnail);
    setValue('description', course.description);
  };

  // Submit Add or Edit Form
  const handleFormSubmit = (data) => {
    let finalInstructor = data.instructor;
    if (data.instructor === '__custom__') {
      if (!customInstructorName.trim()) {
        return;
      }
      finalInstructor = customInstructorName.trim();
    }

    const payload = { ...data, instructor: finalInstructor };

    if (editingCourse) {
      updateCourse(editingCourse.id, payload);
      setEditingCourse(null);
    } else {
      addCourse(payload);
      setIsAddModalOpen(false);
      setSortBy('newest');
      setCurrentPage(1);
    }
    reset();
    setCustomInstructorName('');
  };

  // Filter & Search Logic
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort Logic
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'newest') return 0;
    if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
    if (sortBy === 'name-desc') return b.title.localeCompare(a.title);
    if (sortBy === 'rating-desc') return b.rating - a.rating;
    if (sortBy === 'price-asc') {
      const pA = parseFloat(a.price.replace('$', '')) || 0;
      const pB = parseFloat(b.price.replace('$', '')) || 0;
      return pA - pB;
    }
    return 0;
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedCourses.length / ITEMS_PER_PAGE) || 1;
  const paginatedCourses = sortedCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Helper to open course view modal with default tab reset
  const handleOpenCourseModal = (course) => {
    setViewingCourse(course);
    setHubTab('overview');
    setAsgText('');
    setAsgLink('');
  };

  // Quiz player launch
  const handleStartQuiz = (quiz) => {
    setActiveQuizModal(quiz);
    setQuizIdx(0);
    setQuizAnswers({});
    setQuizTimerSec((quiz.durationMinutes || 10) * 60);
  };



  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-sky-500/20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>{isStudent ? 'Academic Course Catalog' : 'Course Management System'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {isStudent ? 'Browse Academic Courses' : 'Course Curriculum Directory'}
          </h1>
          <p className="text-sky-100 text-sm max-w-xl">
            {isStudent
              ? 'Explore certified academic course modules offered by EduSync faculty and self-enroll in real-time.'
              : 'Create, edit, manage, and assign academic course curriculum across the institute.'}
          </p>
        </div>
        {!isStudent && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-3 bg-white text-sky-600 hover:bg-sky-50 font-bold text-sm rounded-2xl shadow-md transition self-start sm:self-center cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Add Course</span>
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500 mx-auto" />
          <p className="text-sm font-semibold">Loading academic course catalog...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Search, Category Filter, and Sort Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort Input */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses or instructor..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="newest">Sort: Newest First (Default)</option>
              <option value="name-asc">Sort: Name (A-Z)</option>
              <option value="name-desc">Sort: Name (Z-A)</option>
              <option value="rating-desc">Sort: Highest Rating</option>
              <option value="price-asc">Sort: Price (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid Display (Each course includes Thumbnail, Name, Instructor, Category, Duration, Level, Price, Description, Rating) */}
      {!loading && paginatedCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
            >
              {/* Clickable Card Body (Opens View Modal) */}
              <div onClick={() => handleOpenCourseModal(course)} className="flex-1 flex flex-col justify-between">
                {/* Course Thumbnail */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-xl bg-sky-500 text-white text-[10px] font-bold shadow-md">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold shadow-md">
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Course Info Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-slate-800 text-base group-hover:text-sky-600 transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="flex items-center gap-1.5 font-medium">
                        <User className="w-3.5 h-3.5 text-sky-500" />
                        <span>{course.instructor}</span>
                      </span>
                      <span className="flex items-center gap-1 font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{course.rating}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.duration}</span>
                      </span>
                      <span className="font-extrabold text-sky-600 text-sm">{course.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                {isStudent ? (
                  (() => {
                    const enrRecord = enrollments?.find(
                      (e) => e.courseId === course.id && (e.studentEmail?.toLowerCase() === user?.email?.toLowerCase() || e.studentId === 's_manikanta')
                    );
                    const isCompleted = enrRecord?.status === 'Completed' || enrRecord?.progress === 100;
                    if (enrRecord) {
                      return (
                        <div className="w-full flex items-center justify-between gap-2">
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{isCompleted ? 'Completed' : 'Enrolled'}</span>
                          </span>
                          {!isCompleted && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingCourse({
                                  ...course,
                                  isEnrollmentDrop: true,
                                  enrollmentId: enrRecord.id,
                                });
                              }}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-[11px] transition cursor-pointer"
                            >
                              Drop Course
                            </button>
                          )}
                        </div>
                      );
                    }
                    return (
                      <div className="w-full flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleOpenCourseModal(course)}
                          className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition text-center cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleOpenCourseModal(course)}
                          className="flex-1 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-xs transition text-center cursor-pointer"
                        >
                          Enroll Now
                        </button>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex items-center justify-end w-full gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenEdit(course)}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-600 font-semibold rounded-xl transition cursor-pointer flex items-center gap-1"
                      title="Edit Course"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeletingCourse(course)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white font-semibold rounded-xl transition cursor-pointer flex items-center gap-1"
                      title="Delete Course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No courses found</h3>
            <p className="text-xs text-slate-400">Try adjusting your search query or category filter.</p>
          </div>
        )
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">
            Page <strong className="text-slate-800">{currentPage}</strong> of <strong className="text-slate-800">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Course Modal */}
      {(isAddModalOpen || editingCourse) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingCourse ? 'Edit Academic Course' : 'Create Academic Course'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingCourse(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Course Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. React JS Masterclass"
                    {...register('title', { required: 'Course name is required' })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium"
                  />
                  {errors.title && <p className="text-[10px] text-red-500">{errors.title.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Assign Instructor *</label>
                  <select
                    {...register('instructor', { required: 'Instructor is required' })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium"
                  >
                    {instructors && instructors.map((inst) => (
                      <option key={inst.id} value={inst.name}>
                        {inst.name} ({inst.specialization || 'Faculty'})
                      </option>
                    ))}
                    <option value="__custom__">+ Add Custom / New Instructor Name</option>
                  </select>
                  {errors.instructor && <p className="text-[10px] text-red-500">{errors.instructor.message}</p>}
                </div>
              </div>

              {watchInstructor === '__custom__' && (
                <div className="space-y-1.5 p-3 rounded-2xl bg-sky-50/70 border border-sky-200 animate-in fade-in duration-200">
                  <label className="block text-[11px] font-bold text-sky-800">New Instructor Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Prof. Alan Turing"
                    value={customInstructorName}
                    onChange={(e) => setCustomInstructorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-semibold"
                    required
                  />
                  <p className="text-[10px] text-sky-600 font-medium">
                    ✨ Entering a new instructor will automatically create a new profile in the Instructors Directory!
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Category *</label>
                  <select
                    {...register('category')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
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
                  <label className="block text-xs font-semibold text-slate-700">Duration *</label>
                  <input
                    type="text"
                    placeholder="e.g. 6 Weeks"
                    {...register('duration', { required: 'Duration is required' })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Level *</label>
                  <select
                    {...register('level')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Price ($) *</label>
                  <input
                    type="text"
                    placeholder="e.g. 99"
                    {...register('price', { required: 'Price is required' })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    placeholder="4.8"
                    {...register('rating')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Course Thumbnail Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  {...register('thumbnail')}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Description</label>
                <textarea
                  rows="3"
                  placeholder="Detailed course description..."
                  {...register('description')}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingCourse(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-sky-500/25"
                >
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- INTERACTIVE COURSE HUB MODAL (OVERVIEW, LESSONS, ASSIGNMENT & QUIZ, CERTIFICATE) --- */}
      {viewingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-3xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            {/* Header & Category Badge */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-sky-100 text-sky-700 text-xs font-extrabold rounded-xl">
                  {viewingCourse.category}
                </span>
                <span className="text-xs font-bold text-slate-400">Course Code: {viewingCourse.id.toUpperCase()}</span>
              </div>
              <button
                onClick={() => setViewingCourse(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Course Title Banner */}
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900">{viewingCourse.title}</h2>
              <p className="text-xs text-slate-500">Instructor: <strong className="text-sky-700">{viewingCourse.instructor}</strong> • Duration: {viewingCourse.duration}</p>
            </div>

            {/* Hub Navigation Tabs (For Enrolled Students) */}
            {(() => {
              const enrRecord = enrollments?.find(
                (e) => e.courseId === viewingCourse.id && (e.studentEmail?.toLowerCase() === user?.email?.toLowerCase() || e.studentId === 's_manikanta')
              );
              const courseAsg = assignments?.find((a) => a.courseId === viewingCourse.id);
              const courseQz = quizzes?.find((q) => q.courseId === viewingCourse.id);

              const isLessonsDone = enrRecord?.progress === 100 || enrRecord?.status === 'Completed';
              const isAsgDone = courseAsg && (courseAsg.status === 'Submitted' || courseAsg.status === 'Graded');
              const isQuizPassed = courseQz && (courseQz.status === 'Completed' || courseQz.userAttempt?.passed);
              const isCertReady = isLessonsDone && isAsgDone && isQuizPassed;

              const getLessonsList = () => {
                if (!enrRecord) return [];
                if (Array.isArray(enrRecord.lessons) && enrRecord.lessons.length > 0) return enrRecord.lessons;
                const total = DEFAULT_COURSE_LESSONS.length;
                const doneCount = Math.round(((enrRecord.progress || 0) / 100) * total);
                return DEFAULT_COURSE_LESSONS.map((l, idx) => ({ ...l, completed: idx < doneCount }));
              };

              const currentLessons = getLessonsList();

              return (
                <div className="space-y-6">
                  {/* Tab Selector Buttons */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100 scrollbar-none">
                    <button
                      onClick={() => setHubTab('overview')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        hubTab === 'overview'
                          ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Overview</span>
                    </button>

                    {enrRecord && (
                      <>
                        {/* Step 1: Lessons */}
                        <button
                          onClick={() => setHubTab('lessons')}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            hubTab === 'lessons'
                              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>1. Lessons ({enrRecord.progress || 0}%)</span>
                        </button>

                        {/* Step 2: Assignment */}
                        <button
                          onClick={() => setHubTab('assignment')}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            hubTab === 'assignment'
                              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {isLessonsDone ? <Unlock className="w-3.5 h-3.5 text-emerald-500" /> : <Lock className="w-3.5 h-3.5 text-amber-500" />}
                          <span>2. Assignment</span>
                        </button>

                        {/* Step 3: Quiz */}
                        <button
                          onClick={() => setHubTab('quiz')}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            hubTab === 'quiz'
                              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                              : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                          }`}
                        >
                          {isAsgDone ? <Unlock className="w-3.5 h-3.5 text-emerald-500" /> : <Lock className="w-3.5 h-3.5 text-purple-400" />}
                          <span>3. Assessment Quiz</span>
                        </button>

                        {/* Step 4: Certificate */}
                        <button
                          onClick={() => setHubTab('certificate')}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            hubTab === 'certificate'
                              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          }`}
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>4. Certificate</span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* TAB: OVERVIEW */}
                  {hubTab === 'overview' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <img
                        src={viewingCourse.thumbnail}
                        alt={viewingCourse.title}
                        className="w-full h-52 object-cover rounded-2xl border border-slate-200"
                      />
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-slate-400 font-medium block text-[10px] uppercase">Instructor</span>
                          <strong className="text-slate-800 text-xs truncate block">{viewingCourse.instructor}</strong>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-slate-400 font-medium block text-[10px] uppercase">Duration</span>
                          <strong className="text-slate-800 text-xs block">{viewingCourse.duration}</strong>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-slate-400 font-medium block text-[10px] uppercase">Rating</span>
                          <strong className="text-amber-500 text-xs block">{viewingCourse.rating} ★</strong>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-slate-400 font-medium block text-[10px] uppercase">Price</span>
                          <strong className="text-sky-600 text-xs block">{viewingCourse.price}</strong>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl text-xs text-slate-600 leading-relaxed space-y-2 border border-slate-200/80">
                        <h4 className="font-bold text-slate-800 text-sm">Course Overview & Description</h4>
                        <p>{viewingCourse.description}</p>
                      </div>
                    </div>
                  )}

                  {/* STEP 1: LESSONS & LEARNING PROGRESS */}
                  {hubTab === 'lessons' && enrRecord && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      {/* Progress Summary Header */}
                      <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-sky-900">Step 1: Course Lessons Progress</span>
                          <span className="text-sky-600">{enrRecord.progress || 0}% Completed</span>
                        </div>
                        <div className="w-full h-3 bg-sky-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500"
                            style={{ width: `${enrRecord.progress || 0}%` }}
                          ></div>
                        </div>
                        <p className="text-[11px] text-sky-700 font-medium">
                          {isLessonsDone
                            ? '🎉 Step 1 Complete (100%)! Proceed to Step 2 to submit your Course Assignment.'
                            : 'Complete all 5 course lessons (100%) to unlock Step 2: Course Assignment.'}
                        </p>
                      </div>

                      {/* Lessons Checklist */}
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Course Lessons Checklist</h4>
                        {currentLessons.map((l, idx) => (
                          <div
                            key={l.id || idx}
                            onClick={() => toggleLessonCompletion(enrRecord.id, idx)}
                            className={`p-3 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                              l.completed
                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                : 'bg-white border-slate-200 hover:border-sky-300 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {l.completed ? (
                                <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                              ) : (
                                <Square className="w-5 h-5 text-slate-300 shrink-0" />
                              )}
                              <span className={`text-xs font-bold ${l.completed ? 'line-through text-emerald-800' : ''}`}>
                                {l.title}
                              </span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-400 shrink-0">{l.duration}</span>
                          </div>
                        ))}
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

                  {/* STEP 2: ASSIGNMENT (LOCKED UNTIL LESSONS = 100%) */}
                  {hubTab === 'assignment' && enrRecord && (
                    <div className="space-y-5 animate-in fade-in duration-200">
                      {!isLessonsDone ? (
                        <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-200 text-center space-y-3">
                          <Lock className="w-10 h-10 text-amber-500 mx-auto" />
                          <h3 className="text-base font-extrabold text-amber-900">Step 2: Assignment Locked</h3>
                          <p className="text-xs text-amber-700 max-w-md mx-auto leading-relaxed">
                            Please finish 100% of your course lessons in <strong>Step 1</strong> before unlocking this course assignment.
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

                          {/* Course Assignment Box */}
                          <div className="bg-white p-5 rounded-3xl border-2 border-sky-100 shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-sky-100 text-sky-600">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-sky-600 uppercase">Practical Assignment Project</span>
                                  <h4 className="font-extrabold text-slate-800 text-sm">{courseAsg?.title || `${viewingCourse.title} Project`}</h4>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                                isAsgDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {courseAsg?.status || 'Pending'}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">{courseAsg?.instructions}</p>

                            {isAsgDone ? (
                              <div className="space-y-3">
                                <div className="p-3 bg-emerald-50 rounded-2xl text-xs text-emerald-900 space-y-1">
                                  <p className="font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span>Assignment Submitted on {courseAsg?.submittedAt}</span>
                                  </p>
                                  {courseAsg?.submissionLink && (
                                    <p className="font-mono text-[11px] truncate">Link: {courseAsg.submissionLink}</p>
                                  )}
                                  {courseAsg?.obtainedMarks !== null && (
                                    <p className="font-extrabold text-emerald-800">Grade: {courseAsg.obtainedMarks} / 100 Marks ({courseAsg.gradePercentage}%)</p>
                                  )}
                                </div>

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
                                      submitAssignment(courseAsg.id, { submissionText: asgText, submissionLink: finalLink });
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

                  {/* STEP 3: QUIZ (LOCKED UNTIL ASSIGNMENT = SUBMITTED) */}
                  {hubTab === 'quiz' && enrRecord && (
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
                            <span>Step 2 Assignment Submitted! Timed Assessment Quiz is unlocked for this course.</span>
                          </div>

                          {/* Course Quiz Box */}
                          <div className="bg-white p-5 rounded-3xl border-2 border-purple-100 shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
                                  <HelpCircle className="w-5 h-5" />
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-purple-600 uppercase">Timed Assessment Quiz</span>
                                  <h4 className="font-extrabold text-slate-800 text-sm">{courseQz?.title || `${viewingCourse.title} Quiz`}</h4>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                                isQuizPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {isQuizPassed ? 'Passed' : 'Available'}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">{courseQz?.instructions}</p>

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
                              <button
                                onClick={() => courseQz && handleStartQuiz(courseQz)}
                                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                              >
                                <Timer className="w-4 h-4" />
                                <span>Start Timed Course Quiz</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 4: CERTIFICATE GENERATOR (LOCKED UNTIL QUIZ IS PASSED) */}
                  {hubTab === 'certificate' && enrRecord && (
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
                              <span className="font-semibold">Step 3: Course Quiz Passed</span>
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
                              Congratulations! You have successfully completed Step 1 Lessons, Step 2 Assignment, and Step 3 Quiz for <strong>{viewingCourse.title}</strong>.
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              setViewingCertModal({
                                studentName: user?.name || 'Student User',
                                courseTitle: viewingCourse.title,
                                courseId: viewingCourse.id,
                                instructor: viewingCourse.instructor,
                                date: enrRecord.enrollmentDate || new Date().toLocaleDateString(),
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

                  {/* Modal Footer Controls */}
                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setViewingCourse(null)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Close Modal
                    </button>

                    {!enrRecord && (
                      <button
                        onClick={() => {
                          const selected = viewingCourse;
                          setViewingCourse(null);
                          setConfirmingEnrollmentCourse(selected);
                        }}
                        className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/25 flex items-center gap-2 cursor-pointer"
                      >
                        <span>Enroll Now to Start Learning</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

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
              <div>
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">{activeQuizModal.courseTitle}</span>
                <h3 className="text-lg font-extrabold text-slate-900">{activeQuizModal.title}</h3>
              </div>
              <div className="px-3.5 py-1.5 rounded-2xl bg-amber-100 text-amber-800 font-mono text-xs font-bold flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-amber-600" />
                <span>
                  {Math.floor(quizTimerSec / 60).toString().padStart(2, '0')}:
                  {(quizTimerSec % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Question Card */}
            {(() => {
              const qList = activeQuizModal.questions || [];
              const curQ = qList[quizIdx];
              if (!curQ) return null;

              return (
                <div className="space-y-5">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                    <span>Question {quizIdx + 1} of {qList.length}</span>
                    <span className="text-sky-600">{Object.keys(quizAnswers).length} / {qList.length} Answered</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <h4 className="text-sm font-bold text-slate-800 leading-snug">{curQ.question}</h4>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {curQ.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        onClick={() => setQuizAnswers({ ...quizAnswers, [quizIdx]: optIdx })}
                        className={`p-3.5 rounded-2xl border transition flex items-center gap-3 cursor-pointer ${
                          quizAnswers[quizIdx] === optIdx
                            ? 'bg-sky-500 text-white font-bold border-sky-500 shadow-md shadow-sky-500/20'
                            : 'bg-white border-slate-200 hover:border-sky-300 text-slate-700'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          quizAnswers[quizIdx] === optIdx ? 'bg-white text-sky-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className="text-xs">{opt}</span>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => setQuizIdx((prev) => Math.max(prev - 1, 0))}
                      disabled={quizIdx === 0}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl font-bold transition cursor-pointer"
                    >
                      Previous
                    </button>

                    {quizIdx < qList.length - 1 ? (
                      <button
                        onClick={() => setQuizIdx((prev) => Math.min(prev + 1, qList.length - 1))}
                        className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold transition cursor-pointer"
                      >
                        Next Question
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFinishQuiz(false)}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition cursor-pointer"
                      >
                        Submit Quiz Answers
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* --- OFFICIAL CERTIFICATE VIEW & PRINT MODAL --- */}
      {viewingCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-300 w-full max-w-2xl p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto print:max-w-none print:w-full print:h-full print:border-none">
            {/* Top Bar */}
            <div className="flex items-center justify-between print:hidden border-b border-slate-100 pb-3">
              <span className="text-xs font-extrabold text-amber-700 uppercase tracking-widest">EduSync Official Academic Certificate</span>
              <button
                onClick={() => setViewingCertModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Canvas */}
            <div className="bg-gradient-to-br from-amber-50/60 via-white to-sky-50/60 p-8 rounded-3xl border-2 border-amber-200 text-center space-y-6 relative overflow-hidden shadow-inner">
              <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto shadow-lg">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-widest block">Verification ID: CERT-EDUSYNC-{viewingCertModal.courseId?.toUpperCase() || 'LMS'}-2026</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Certificate of Academic Completion</h1>
                <p className="text-xs text-slate-500 italic">This is to certify that</p>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-700 underline decoration-sky-300 underline-offset-8">
                {viewingCertModal.studentName}
              </h2>

              <p className="text-xs text-slate-700 max-w-lg mx-auto leading-relaxed">
                has successfully completed 100% of coursework, practical capstone project assignments, and comprehensive assessment quizzes for the certified course:
              </p>

              <h3 className="text-xl font-extrabold text-slate-900 bg-white/80 py-2.5 px-4 rounded-2xl border border-amber-200 max-w-md mx-auto shadow-xs">
                {viewingCertModal.courseTitle}
              </h3>

              <div className="pt-6 border-t border-amber-200/80 grid grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="space-y-0.5 text-left">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Issue Date</span>
                  <strong className="text-slate-800">{viewingCertModal.date}</strong>
                </div>
                <div className="space-y-0.5 text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Authorized Faculty</span>
                  <strong className="text-sky-700">{viewingCertModal.instructor}</strong>
                </div>
              </div>
            </div>

            {/* Print Action Controls */}
            <div className="flex items-center justify-end gap-3 print:hidden">
              <button
                onClick={() => setViewingCertModal(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Download PDF Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Enrollment Confirmation Modal */}
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
              {/* Student Profile Summary Box */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2">
                <p className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">Enrolling Student Profile</p>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>Student Name:</span>
                  <strong className="text-sky-900">{user?.name || 'Student User'}</strong>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Email:</span>
                  <span className="font-mono text-[11px]">{user?.email || 'student@edusync.com'}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Qualification:</span>
                  <span>B.Tech Computer Science & Engineering</span>
                </div>
              </div>

              {/* Course Detail Summary Box */}
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

              {/* Terms Agreement Text */}
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
                    studentId: user?.id || 's_manikanta',
                    studentEmail: user?.email || 'gopala.manikanta@edusync.com',
                    courseId: courseObj.id,
                    status: 'Active',
                    progress: 10,
                  });
                  setConfirmingEnrollmentCourse(null);
                  if (courseObj) {
                    setViewingCourse(courseObj);
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

      {/* Delete / Drop Confirmation Modal */}
      {deletingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-red-600 font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span>{deletingCourse.isEnrollmentDrop ? 'Drop Course Enrollment?' : 'Confirm Delete Course'}</span>
              </div>
              <button
                onClick={() => setDeletingCourse(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-red-50 rounded-2xl border border-red-100 text-red-700 font-medium leading-relaxed">
                {deletingCourse.isEnrollmentDrop
                  ? 'Are you sure you want to drop this course? It will be removed from your enrolled courses roster, and you can re-enroll anytime.'
                  : 'Are you sure you want to delete this course? This action will remove the course module permanently.'}
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <img
                  src={deletingCourse.thumbnail}
                  alt={deletingCourse.title}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-900 truncate">{deletingCourse.title}</h4>
                  <p className="text-slate-500 text-[11px]">Instructor: {deletingCourse.instructor}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setDeletingCourse(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deletingCourse.isEnrollmentDrop) {
                    removeEnrollment(deletingCourse.enrollmentId);
                  } else {
                    deleteCourse(deletingCourse.id);
                  }
                  setDeletingCourse(null);
                }}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-md shadow-red-500/25 cursor-pointer"
              >
                {deletingCourse.isEnrollmentDrop ? 'Confirm Drop' : 'Delete Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesList;
