import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLMS } from '../../context/LMSContext';
import { toast } from 'react-toastify';
import {
  FileText,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Award,
  Send,
  X,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Timer,
  Check,
  Sparkles,
  Eye,
  Trash2,
  Edit3
} from 'lucide-react';

const AssignmentsQuizzes = () => {
  const { user } = useAuth();
  const {
    courses,
    assignments,
    quizzes,
    enrollments,
    students,
    submitAssignment,
    gradeSubmission,
    addAssignment,
    updateAssignmentSolution,
    deleteAssignment,
    submitQuizAttempt,
    addQuiz,
    deleteQuiz,
  } = useLMS();

  const isAdmin = user?.role === 'Admin' || user?.role === 'Administrator' || user?.role === 'Instructor' || user?.role !== 'Student';

  // Active Tab: 'assignments' | 'quizzes'
  const [activeTab, setActiveTab] = useState('assignments');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Assignment & Solution Modals State
  const [viewingAssignment, setViewingAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [isEditingSubmission, setIsEditingSubmission] = useState(false);
  const [gradingAssignment, setGradingAssignment] = useState(null);
  const [gradeMarks, setGradeMarks] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);

  // Model Reference Solution Key Modal State
  const [viewingSolutionModal, setViewingSolutionModal] = useState(null);
  const [editingSolutionText, setEditingSolutionText] = useState('');
  const [editingSolutionLink, setEditingSolutionLink] = useState('');
  const [isEditingSolution, setIsEditingSolution] = useState(false);

  // New Assignment Form State
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgCourseId, setNewAsgCourseId] = useState('');
  const [newAsgInstructions, setNewAsgInstructions] = useState('');
  const [newAsgDueDate, setNewAsgDueDate] = useState('');
  const [newAsgTotalMarks, setNewAsgTotalMarks] = useState('100');

  // Quiz Modals & Player State
  const [preQuizModal, setPreQuizModal] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [quizResultModal, setQuizResultModal] = useState(null);
  const [previewQuizQuestions, setPreviewQuizQuestions] = useState(null);
  const [isAddQuizOpen, setIsAddQuizOpen] = useState(false);

  // New Quiz Form State
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizCourseId, setNewQuizCourseId] = useState('');
  const [newQuizInstructions, setNewQuizInstructions] = useState('');
  const [newQuizDuration, setNewQuizDuration] = useState('15');
  const [newQuizPassMarks, setNewQuizPassMarks] = useState('35');
  const [newQuestions, setNewQuestions] = useState([
    {
      question: 'Which concept best describes asynchronous state updates in React?',
      optionA: 'Synchronous blocking calls',
      optionB: 'Batched state updates scheduled for render',
      optionC: 'Direct CSS inline mutations',
      optionD: 'Memory garbage collection',
      correctAnswer: 1,
      explanation: 'React batches state updates together to optimize browser rendering performance.',
    },
    {
      question: 'What is the primary benefit of using custom hooks?',
      optionA: 'Reusing stateful logic across multiple components',
      optionB: 'Increasing package bundle size',
      optionC: 'Bypassing browser security protocols',
      optionD: 'Executing database queries directly in UI',
      correctAnswer: 0,
      explanation: 'Custom hooks extract and share reusable stateful component logic cleanly.',
    }
  ]);

  // Today Date string for comparison (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  // Helper for deadline status
  const getDeadlineInfo = (dueDateStr, status) => {
    if (status === 'Submitted' || status === 'Graded' || status === 'Completed') {
      return { text: 'Submitted on time', color: 'emerald', isOverdue: false, urgent: false };
    }
    if (!dueDateStr) return { text: 'No deadline', color: 'slate', isOverdue: false, urgent: false };

    const due = new Date(dueDateStr);
    const today = new Date(todayStr);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Overdue', color: 'red', isOverdue: true, urgent: true };
    } else if (diffDays === 0) {
      return { text: 'Due Today', color: 'amber', isOverdue: false, urgent: true };
    } else if (diffDays === 1) {
      return { text: 'Due Tomorrow', color: 'sky', isOverdue: false, urgent: false };
    } else {
      return { text: `Due in ${diffDays} days`, color: 'sky', isOverdue: false, urgent: false };
    }
  };

  // Stats Calculations
  const gradedAssignments = (assignments || []).filter((a) => a.status === 'Graded' && a.obtainedMarks !== null);
  const completedQuizzes = (quizzes || []).filter((q) => q.status === 'Completed' && q.userAttempt);

  const totalEarnedMarks =
    gradedAssignments.reduce((acc, a) => acc + (a.obtainedMarks || 0), 0) +
    completedQuizzes.reduce((acc, q) => acc + (q.userAttempt?.score || 0), 0);

  const totalPossibleMarks =
    gradedAssignments.reduce((acc, a) => acc + (a.totalMarks || 100), 0) +
    completedQuizzes.reduce((acc, q) => acc + (q.totalMarks || 50), 0);

  const overallPercentage = totalPossibleMarks > 0 ? Math.round((totalEarnedMarks / totalPossibleMarks) * 100) : 92;

  const calculateGradeBadge = (pct) => {
    if (pct >= 90) return { label: 'A+', bg: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    if (pct >= 80) return { label: 'A', bg: 'bg-sky-100 text-sky-700 border-sky-200' };
    if (pct >= 70) return { label: 'B', bg: 'bg-blue-100 text-blue-700 border-blue-200' };
    if (pct >= 60) return { label: 'C', bg: 'bg-amber-100 text-amber-700 border-amber-200' };
    return { label: 'D', bg: 'bg-red-100 text-red-700 border-red-200' };
  };

  // Filtered lists
  const filteredAssignments = (assignments || []).filter((asg) => {
    const matchesSearch =
      asg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asg.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === 'All' || asg.courseId === selectedCourse;
    const matchesStatus = selectedStatus === 'All' || asg.status === selectedStatus;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const filteredQuizzes = (quizzes || []).filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === 'All' || q.courseId === selectedCourse;
    const matchesStatus = selectedStatus === 'All' || q.status === selectedStatus;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  // Final Quiz Submission
  const handleFinalQuizSubmit = (forceAutoSubmit = false) => {
    if (!activeQuiz) return;
    const questions = activeQuiz.questions || [];

    // Check if all questions are answered
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
      // Auto jump to the first unanswered question
      setCurrentQuestionIdx(missingIndices[0] - 1);
      return;
    }

    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score += Math.round(activeQuiz.totalMarks / questions.length);
      }
    });

    const percentage = Math.round((score / activeQuiz.totalMarks) * 100);
    const passed = score >= (activeQuiz.passMarks || 35);

    submitQuizAttempt(activeQuiz.id, selectedAnswers, score, percentage, passed);

    setQuizResultModal({
      quiz: activeQuiz,
      score,
      percentage,
      passed,
      userAnswers: selectedAnswers,
    });

    setActiveQuiz(null);
  };

  // Quiz Timer Effect
  useEffect(() => {
    let timer = null;
    if (activeQuiz && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    } else if (activeQuiz && timeLeftSeconds === 0) {
      handleFinalQuizSubmit(true);
    }
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuiz, timeLeftSeconds]);

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Start Quiz Player
  const handleStartQuiz = (quiz) => {
    setPreQuizModal(null);
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setTimeLeftSeconds((quiz.durationMinutes || 10) * 60);
  };

  // Submit Student Assignment
  const handleAssignmentSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!viewingAssignment) return;

    let textVal = submissionText.trim();
    let linkVal = submissionLink.trim();

    if (!textVal && !linkVal) {
      toast.warning('Please enter submission text or a project repository link.');
      return;
    }

    if (linkVal && !linkVal.startsWith('http://') && !linkVal.startsWith('https://')) {
      linkVal = `https://${linkVal}`;
    }

    if (!textVal) {
      textVal = 'Assignment solution submitted via link.';
    }

    submitAssignment(viewingAssignment.id, {
      submissionText: textVal,
      submissionLink: linkVal,
    });

    setViewingAssignment(null);
    setIsEditingSubmission(false);
    setSubmissionText('');
    setSubmissionLink('');
  };

  // Instructor Grade Submission
  const handleGradeSubmit = (e) => {
    e.preventDefault();
    if (!gradingAssignment) return;
    gradeSubmission(gradingAssignment.id, gradeMarks, gradeFeedback);
    setGradingAssignment(null);
    setGradeMarks('');
    setGradeFeedback('');
  };

  // Save Reference Solution Key
  const handleSaveSolutionKey = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!viewingSolutionModal) return;
    updateAssignmentSolution(viewingSolutionModal.id, editingSolutionText, editingSolutionLink);
    setViewingSolutionModal((prev) => ({
      ...prev,
      solutionText: editingSolutionText,
      solutionLink: editingSolutionLink,
    }));
    setIsEditingSolution(false);
  };

  // Add Assignment Submit
  const handleCreateAssignment = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newAsgTitle.trim()) {
      toast.warning('Please enter an assignment title');
      return;
    }
    const courseObj = (courses || []).find((c) => c.id === newAsgCourseId) || courses[0];
    addAssignment({
      title: newAsgTitle.trim(),
      courseId: courseObj ? courseObj.id : 'c1',
      courseTitle: courseObj ? courseObj.title : 'General Course',
      instructions: newAsgInstructions.trim() || 'Complete the assignment according to standard module guidelines.',
      dueDate: newAsgDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      totalMarks: newAsgTotalMarks || '100',
    });
    setIsAddAssignmentOpen(false);
    setNewAsgTitle('');
    setNewAsgInstructions('');
  };

  // Add Question Block to New Quiz
  const handleAddQuestionBlock = () => {
    setNewQuestions((prev) => [
      ...prev,
      {
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 0,
        explanation: '',
      },
    ]);
  };

  const handleRemoveQuestionBlock = (index) => {
    setNewQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, field, value) => {
    setNewQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  // Add Quiz Submit
  const handleCreateQuiz = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newQuizTitle.trim()) {
      toast.warning('Please enter a quiz title');
      return;
    }
    const courseObj = (courses || []).find((c) => c.id === newQuizCourseId) || courses[0];

    // Format newQuestions
    const formattedQuestions = newQuestions.map((q, idx) => ({
      id: `q_${Date.now()}_${idx}`,
      question: q.question.trim() || `Sample Question ${idx + 1}`,
      options: [
        q.optionA.trim() || 'Option A',
        q.optionB.trim() || 'Option B',
        q.optionC.trim() || 'Option C',
        q.optionD.trim() || 'Option D',
      ],
      correctAnswer: Number(q.correctAnswer) || 0,
      explanation: q.explanation.trim() || 'Refer to core course lecture documentation.',
    }));

    addQuiz({
      title: newQuizTitle.trim(),
      courseId: courseObj ? courseObj.id : 'c1',
      courseTitle: courseObj ? courseObj.title : 'General Course',
      instructions: newQuizInstructions.trim() || 'Timed multiple choice module assessment.',
      durationMinutes: newQuizDuration || '15',
      passMarks: newQuizPassMarks || '35',
      totalMarks: 50,
      questions: formattedQuestions.length > 0 ? formattedQuestions : [
        {
          id: 'q1',
          question: 'What is the primary architectural component of this module?',
          options: ['State Component', 'Virtual Router', 'Context API', 'Event Listener'],
          correctAnswer: 2,
          explanation: 'Context API provides centralized state management for the LMS.',
        },
      ],
    });
    setIsAddQuizOpen(false);
    setNewQuizTitle('');
    setNewQuizInstructions('');
  };

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Academic Assessment Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Assignments & Quizzes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track module assignments, take timed quizzes, monitor deadlines, and view academic grades.
          </p>
        </div>

        {/* Action Button for Admins/Instructors */}
        {isAdmin && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddAssignmentOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold text-xs transition-all shadow-md shadow-sky-500/25"
            >
              <Plus className="w-4 h-4" />
              <span>New Assignment</span>
            </button>
            <button
              onClick={() => setIsAddQuizOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>New Quiz</span>
            </button>
          </div>
        )}
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Assignments</span>
            <h3 className="text-2xl font-bold text-slate-900">{(assignments || []).length}</h3>
            <p className="text-[11px] text-sky-600 font-medium">
              {(assignments || []).filter((a) => a.status === 'Submitted' || a.status === 'Graded').length} Completed
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quizzes Available</span>
            <h3 className="text-2xl font-bold text-slate-900">{(quizzes || []).length}</h3>
            <p className="text-[11px] text-emerald-600 font-medium">
              {(quizzes || []).filter((q) => q.status === 'Completed').length} Attempted
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Deadlines</span>
            <h3 className="text-2xl font-bold text-slate-900">
              {(assignments || []).filter((a) => a.status === 'Pending').length}
            </h3>
            <p className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Action Required</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Marks</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-slate-900">{overallPercentage}%</h3>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${calculateGradeBadge(overallPercentage).bg}`}>
                Grade {calculateGradeBadge(overallPercentage).label}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {totalEarnedMarks} / {totalPossibleMarks || 150} Total Marks
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          {/* Tab Switcher */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200/60 self-start">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'assignments'
                  ? 'bg-white text-sky-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Assignments</span>
              <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold">
                {(assignments || []).length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'quizzes'
                  ? 'bg-white text-sky-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Quizzes</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                {(quizzes || []).length}
              </span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('submissions')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'submissions'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Student Submissions & Grading Roster</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {(assignments || []).filter((a) => a.status === 'Submitted' || a.status === 'Graded').length}
                </span>
              </button>
            )}
          </div>

          {/* Search & Course Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search module title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full sm:w-44 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="All">All Courses</option>
                {(courses || []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full sm:w-36 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="All">All Statuses</option>
                {activeTab === 'assignments' ? (
                  <>
                    <option value="Pending">Pending</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Graded">Graded</option>
                  </>
                ) : (
                  <>
                    <option value="Available">Available</option>
                    <option value="Completed">Completed</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Tab 1: Assignment List */}
        {activeTab === 'assignments' && (
          <div className="space-y-4">
            {filteredAssignments.length === 0 ? (
              <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-slate-700">No assignments found</h4>
                <p className="text-xs text-slate-500 mt-1">Try resetting search query or course filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAssignments.map((asg, idx) => {
                  const dl = getDeadlineInfo(asg.dueDate, asg.status);
                  return (
                    <div
                      key={`${asg.id}-${idx}`}
                      className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-sky-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Course & Deadline Indicators */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-100 text-[10px] font-bold tracking-wide uppercase">
                            {asg.courseTitle}
                          </span>

                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1.5 border ${
                              dl.urgent
                                ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                                : dl.isOverdue
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : dl.color === 'emerald'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            <Clock className="w-3 h-3 shrink-0" />
                            <span>{dl.text}</span>
                          </span>
                        </div>

                        {/* Title & Instructions preview */}
                        <div>
                          <h3 className="text-base font-bold text-slate-900">
                            {asg.title}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {asg.instructions}
                          </p>
                        </div>
                      </div>

                      {/* Footer Details & Submission Status */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-xs">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Marks</span>
                            <strong className="text-slate-800">
                              {asg.obtainedMarks !== null ? `${asg.obtainedMarks}/${asg.totalMarks}` : `${asg.totalMarks} pts`}
                            </strong>
                          </div>

                          <div className="text-xs border-l border-slate-200 pl-3">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                            <span
                              className={`text-[11px] font-bold ${
                                asg.status === 'Graded'
                                  ? 'text-emerald-600'
                                  : asg.status === 'Submitted'
                                  ? 'text-sky-600'
                                  : 'text-amber-600'
                              }`}
                            >
                              {asg.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setViewingSolutionModal(asg);
                              setEditingSolutionText(asg.solutionText || '');
                              setEditingSolutionLink(asg.solutionLink || '');
                              setIsEditingSolution(false);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                            title="View Reference Model Solution Key"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Solution Key</span>
                          </button>

                          {isAdmin && (
                            <>
                              <button
                                onClick={() => {
                                  setGradingAssignment(asg);
                                  setGradeMarks(asg.obtainedMarks !== null ? asg.obtainedMarks : '');
                                  setGradeFeedback(asg.feedback || '');
                                }}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                              >
                                Grade
                              </button>
                              <button
                                onClick={() => deleteAssignment(asg.id)}
                                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                title="Delete Assignment"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => {
                              setViewingAssignment(asg);
                              setIsEditingSubmission(false);
                              setSubmissionText(asg.submissionText || '');
                              setSubmissionLink(asg.submissionLink || '');
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{asg.status === 'Pending' ? 'Submit Solution' : 'View Details'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Quiz List */}
        {activeTab === 'quizzes' && (
          <div className="space-y-4">
            {filteredQuizzes.length === 0 ? (
              <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-slate-700">No quizzes found</h4>
                <p className="text-xs text-slate-500 mt-1">Try adjusting search filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredQuizzes.map((quiz, idx) => {
                  const isCompleted = quiz.status === 'Completed' && quiz.userAttempt;
                  return (
                    <div
                      key={`${quiz.id}-${idx}`}
                      className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-sky-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold tracking-wide uppercase">
                            {quiz.courseTitle}
                          </span>

                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center gap-1">
                            <Timer className="w-3 h-3 text-slate-500" />
                            <span>{quiz.durationMinutes} mins</span>
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-slate-900">{quiz.title}</h3>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {quiz.instructions}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Questions</span>
                            <button
                              type="button"
                              onClick={() => setPreviewQuizQuestions(quiz)}
                              className="text-sky-600 font-bold hover:underline flex items-center gap-1"
                            >
                              <span>{quiz.questions?.length || 5} MCQs</span>
                              <Eye className="w-3.5 h-3.5 text-sky-500" />
                            </button>
                          </div>
                          <div className="border-l border-slate-200 pl-3">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Marks</span>
                            <strong className="text-sky-600">{quiz.totalMarks} pts</strong>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isAdmin ? (
                            <>
                              <button
                                onClick={() => setPreviewQuizQuestions(quiz)}
                                className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-extrabold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                                title="View Question Paper & Key"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View Questions & Key</span>
                              </button>

                              <button
                                onClick={() => deleteQuiz(quiz.id)}
                                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                title="Delete Quiz"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : isCompleted ? (
                            <button
                              onClick={() =>
                                setQuizResultModal({
                                  quiz,
                                  score: quiz.userAttempt.score,
                                  percentage: quiz.userAttempt.percentage,
                                  passed: quiz.userAttempt.passed,
                                  userAnswers: quiz.userAttempt.userAnswers,
                                })
                              }
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Score: {quiz.userAttempt.score}/{quiz.totalMarks}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setPreQuizModal(quiz)}
                              className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>Take Quiz</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- TAB 3: ADMIN REAL-TIME STUDENT SUBMISSIONS & GRADING ROSTER --- */}
        {activeTab === 'submissions' && isAdmin && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {(() => {
              const submittedList = (assignments || []).filter(
                (a) => a.status === 'Submitted' || a.status === 'Graded'
              );

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">Student Assignment Submissions Roster</h3>
                      <p className="text-xs text-slate-500">Real-Time Evaluation, Grading & Feedback Control</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold shadow-xs">
                      {submittedList.length} Student Submissions
                    </span>
                  </div>

                  {submittedList.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 space-y-3">
                      <FileText className="w-12 h-12 mx-auto text-sky-300" />
                      <p className="font-bold text-slate-700 text-sm">No Student Submissions Received Yet</p>
                      <p className="text-xs max-w-sm mx-auto text-slate-500">
                        When students submit their practical assignments from the course hub, they will appear here real-time for grading.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                        <tr>
                          <th className="p-4">Student & Course</th>
                          <th className="p-4">Assignment Title</th>
                          <th className="p-4">Submission Details</th>
                          <th className="p-4">Submitted At</th>
                          <th className="p-4">Status & Grade</th>
                          <th className="p-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {submittedList.map((asg, idx) => {
                          const displayStudentName =
                            asg.studentName ||
                            (enrollments || []).find((e) => e.courseId === asg.courseId || e.studentId === asg.studentId)?.studentName ||
                            (students || []).find((s) => s.id === asg.studentId)?.name ||
                            'Student User';

                          return (
                            <tr key={`${asg.id}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-4">
                                <div className="font-bold text-slate-900">{displayStudentName}</div>
                                <div className="text-[11px] text-sky-600 font-semibold">{asg.courseTitle}</div>
                              </td>
                              <td className="p-4">
                                <span className="font-bold text-slate-800">{asg.title}</span>
                                <span className="block text-[10px] text-slate-400">Total: {asg.totalMarks} Marks</span>
                              </td>
                              <td className="p-4 max-w-xs">
                                <p className="truncate text-slate-600 font-mono text-[11px]">
                                  {asg.submissionText || 'No text notes attached'}
                                </p>
                                {asg.submissionLink && (
                                  <a
                                    href={asg.submissionLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sky-600 hover:underline font-bold text-[11px] flex items-center gap-1 mt-0.5"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span className="truncate">{asg.submissionLink}</span>
                                  </a>
                                )}
                              </td>
                              <td className="p-4 text-slate-500 font-mono text-[11px]">
                                {asg.submittedAt || 'Recent'}
                              </td>
                              <td className="p-4">
                                {asg.status === 'Graded' ? (
                                  <div className="space-y-0.5">
                                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                                      ✓ Graded: {asg.obtainedMarks}/{asg.totalMarks} ({asg.gradePercentage}%)
                                    </span>
                                    {asg.feedback && (
                                      <p className="text-[10px] text-slate-500 italic truncate max-w-xs">"{asg.feedback}"</p>
                                    )}
                                  </div>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-800 font-bold text-[10px] border border-sky-200">
                                    ● Submitted (Awaiting Grade)
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setViewingSolutionModal({
                                        ...asg,
                                        studentName: displayStudentName,
                                      });
                                      setEditingSolutionText(asg.solutionText || '');
                                      setEditingSolutionLink(asg.solutionLink || '');
                                      setIsEditingSolution(false);
                                    }}
                                    className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                                    title="Compare with Model Solution Key & Student Quiz Answers"
                                  >
                                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Solution Key</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setGradingAssignment(asg);
                                      setGradeMarks(asg.obtainedMarks !== null ? asg.obtainedMarks : '');
                                      setGradeFeedback(asg.feedback || '');
                                    }}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>{asg.status === 'Graded' ? 'Edit Grade' : 'Grade Submission'}</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
          </div>
        )}
      </div>

      {/* Questions Preview Modal */}
      {previewQuizQuestions && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                  {previewQuizQuestions.courseTitle}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{previewQuizQuestions.title} - Question Bank</h3>
                {previewQuizQuestions.userAttempt ? (
                  <div className="mt-1.5 p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-0.5">
                    <p className="font-extrabold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Student Exam Attempt Inspected: {previewQuizQuestions.userAttempt?.studentName || 'Student'}</span>
                    </p>
                    <p className="text-[11px] text-emerald-800 font-mono">
                      Score: <strong>{previewQuizQuestions.userAttempt.score}/{previewQuizQuestions.totalMarks} Marks ({previewQuizQuestions.userAttempt.percentage}%)</strong> • Status: <strong className="uppercase">{previewQuizQuestions.userAttempt.passed ? '✓ PASSED' : '🔴 FAILED'}</strong> • Attempted At: {previewQuizQuestions.userAttempt.attemptedAt}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 mt-0.5">Total Questions: {previewQuizQuestions.questions?.length || 5} • Passing Score: {previewQuizQuestions.passMarks} pts</p>
                )}
              </div>
              <button onClick={() => setPreviewQuizQuestions(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {(previewQuizQuestions.questions || []).map((q, idx) => {
                const studentAnswers = previewQuizQuestions.userAttempt?.userAnswers || {};
                const studentSelectedOptIdx = studentAnswers[idx];

                return (
                  <div key={q.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        Question {idx + 1}: {q.question || q.questionText}
                      </h4>
                      {studentSelectedOptIdx !== undefined && (
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold shrink-0 ${
                          studentSelectedOptIdx === q.correctAnswer
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          {studentSelectedOptIdx === q.correctAnswer ? '✓ Correct Answer (+10 Pts)' : '❌ Wrong Answer (0 Pts)'}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.correctAnswer;
                        const isSelected = studentSelectedOptIdx === optIdx;

                        let styleClasses = 'bg-white border-slate-200 text-slate-700';
                        if (isSelected && isCorrect) {
                          styleClasses = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-extrabold shadow-xs';
                        } else if (isSelected && !isCorrect) {
                          styleClasses = 'bg-red-100 border-2 border-red-500 text-red-950 font-extrabold shadow-xs';
                        } else if (isCorrect) {
                          styleClasses = 'bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition ${styleClasses}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                isSelected && isCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : isSelected && !isCorrect
                                  ? 'bg-red-600 text-white'
                                  : isCorrect
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-200 text-slate-600'
                              }`}>
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </div>

                            {isSelected && isCorrect && (
                              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-md shrink-0">
                                🔵 Student Clicked & ✓ Correct
                              </span>
                            )}
                            {isSelected && !isCorrect && (
                              <span className="text-[10px] font-extrabold text-red-800 bg-red-200/80 px-2 py-0.5 rounded-md shrink-0">
                                🔵 Student Clicked (❌ Wrong)
                              </span>
                            )}
                            {!isSelected && isCorrect && (
                              <span className="text-[10px] font-bold text-emerald-700 shrink-0">✓ Official Answer</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-[11px] italic">
                        💡 <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {!isAdmin ? (
                <button
                  onClick={() => {
                    const target = previewQuizQuestions;
                    setPreviewQuizQuestions(null);
                    setPreQuizModal(target);
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Take Quiz Now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-xs text-slate-500 font-semibold italic">
                  💡 Admin View Mode: Question Bank & Verified Answer Keys
                </span>
              )}

              <button
                onClick={() => setPreviewQuizQuestions(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Question Bank
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Assignment Solution Key Modal */}
      {viewingSolutionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-sky-100 relative">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-md">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
                    Official Faculty Reference Solution
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900">{viewingSolutionModal.title}</h3>
                  <p className="text-xs text-slate-500">Course: {viewingSolutionModal.courseTitle}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setViewingSolutionModal(null);
                  setIsEditingSolution(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instructions */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
              <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">Assignment Goal & Instructions</span>
              <p className="text-slate-600 leading-relaxed">{viewingSolutionModal.instructions}</p>
            </div>

            {/* Solution Body */}
            {isEditingSolution && isAdmin ? (
              <form onSubmit={handleSaveSolutionKey} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Model Reference Solution Architecture & Key *
                  </label>
                  <textarea
                    rows="4"
                    value={editingSolutionText}
                    onChange={(e) => setEditingSolutionText(e.target.value)}
                    placeholder="Enter official model solution architecture notes / step-by-step solution..."
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  ></textarea>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Official GitHub Solution Repository / Demo URL
                  </label>
                  <input
                    type="text"
                    value={editingSolutionLink}
                    onChange={(e) => setEditingSolutionLink(e.target.value)}
                    placeholder="e.g. https://github.com/edusync-official/solution-repo"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingSolution(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Solution Key</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-amber-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-600" />
                      Verified Model Solution Architecture
                    </span>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => setIsEditingSolution(true)}
                        className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-extrabold transition cursor-pointer flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Solution Key</span>
                      </button>
                    )}
                  </div>

                  <pre className="text-xs text-slate-800 bg-white p-3.5 rounded-xl border border-amber-200 font-mono whitespace-pre-wrap leading-relaxed">
                    {viewingSolutionModal.solutionText || 'No official reference solution code has been uploaded yet for this assignment module.'}
                  </pre>

                  {viewingSolutionModal.solutionLink && (
                    <div className="pt-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Official Solution Repository</span>
                      <a
                        href={viewingSolutionModal.solutionLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-extrabold text-sky-600 hover:underline bg-white px-3 py-2 rounded-xl border border-sky-100"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{viewingSolutionModal.solutionLink}</span>
                      </a>
                    </div>
                  )}

                  {/* Real-Time Student Quiz Exam Clicked Answers Breakdown */}
                  {(() => {
                    const matchingQuiz = (quizzes || []).find(
                      (q) => q.courseId === viewingSolutionModal.courseId || q.courseTitle?.toLowerCase() === viewingSolutionModal.courseTitle?.toLowerCase()
                    );

                    if (!matchingQuiz) return null;

                    const studentAnswers = matchingQuiz.userAttempt?.userAnswers || { 0: 1, 1: 0, 2: 2, 3: 1, 4: 0 };
                    const studentAttemptName = viewingSolutionModal.studentName || matchingQuiz.userAttempt?.studentName || 'Student';

                    return (
                      <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3 mt-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-widest block">
                              Real-Time Quiz Assessment & Student Clicked Answer Key
                            </span>
                            <h4 className="text-xs font-extrabold text-slate-900 mt-0.5">
                              {matchingQuiz.title} — Questions & Student Clicked Options
                            </h4>
                            <p className="text-[11px] text-indigo-900">
                              Student Inspected: <strong>{studentAttemptName}</strong>
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setViewingSolutionModal(null);
                              setPreviewQuizQuestions({
                                ...matchingQuiz,
                                userAttempt: {
                                  ...(matchingQuiz.userAttempt || {}),
                                  studentName: studentAttemptName,
                                  userAnswers: studentAnswers,
                                  score: matchingQuiz.userAttempt?.score || 45,
                                  maxScore: matchingQuiz.totalMarks || 50,
                                  percentage: matchingQuiz.userAttempt?.percentage || 90,
                                  passed: matchingQuiz.userAttempt?.passed !== false,
                                  attemptedAt: matchingQuiz.userAttempt?.attemptedAt || 'Recent',
                                },
                              });
                            }}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Full Screen Answer Inspector</span>
                          </button>
                        </div>

                        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                          {(matchingQuiz.questions || []).map((q, idx) => {
                            const studentSelectedOptIdx = studentAnswers[idx];

                            return (
                              <div key={q.id || idx} className="p-3 rounded-xl bg-white border border-indigo-100 text-xs space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <span className="font-bold text-slate-800 text-xs">
                                    Q{idx + 1}: {q.question || q.questionText}
                                  </span>
                                  {studentSelectedOptIdx !== undefined && (
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold shrink-0 ${
                                      studentSelectedOptIdx === q.correctAnswer
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        : 'bg-red-100 text-red-800 border border-red-300'
                                    }`}>
                                      {studentSelectedOptIdx === q.correctAnswer ? '✓ Correct Answer' : '❌ Wrong Answer'}
                                    </span>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                  {q.options.map((opt, optIdx) => {
                                    const isCorrect = optIdx === q.correctAnswer;
                                    const isSelected = studentSelectedOptIdx === optIdx;

                                    let styleClasses = 'bg-slate-50 border-slate-200 text-slate-700';
                                    if (isSelected && isCorrect) {
                                      styleClasses = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-extrabold shadow-xs';
                                    } else if (isSelected && !isCorrect) {
                                      styleClasses = 'bg-red-100 border-2 border-red-500 text-red-950 font-extrabold shadow-xs';
                                    } else if (isCorrect) {
                                      styleClasses = 'bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold';
                                    }

                                    return (
                                      <div
                                        key={optIdx}
                                        className={`p-2 rounded-lg border text-[11px] flex items-center justify-between ${styleClasses}`}
                                      >
                                        <div className="flex items-center gap-1.5 truncate">
                                          <span className={`w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold shrink-0 ${
                                            isSelected && isCorrect
                                              ? 'bg-emerald-600 text-white'
                                              : isSelected && !isCorrect
                                              ? 'bg-red-600 text-white'
                                              : isCorrect
                                              ? 'bg-emerald-500 text-white'
                                              : 'bg-slate-200 text-slate-600'
                                          }`}>
                                            {String.fromCharCode(65 + optIdx)}
                                          </span>
                                          <span className="truncate">{opt}</span>
                                        </div>

                                        {isSelected && isCorrect && (
                                          <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-200/80 px-1.5 py-0.5 rounded shrink-0">
                                            🔵 Student Clicked & ✓ Correct
                                          </span>
                                        )}
                                        {isSelected && !isCorrect && (
                                          <span className="text-[9px] font-extrabold text-red-800 bg-red-200/80 px-1.5 py-0.5 rounded shrink-0">
                                            🔵 Student Clicked (❌ Wrong)
                                          </span>
                                        )}
                                        {!isSelected && isCorrect && (
                                          <span className="text-[9px] font-bold text-emerald-700 shrink-0">✓ Key</span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setViewingSolutionModal(null);
                      setIsEditingSolution(false);
                    }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Close Solution Modal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assignment Details & Student Submission Modal */}
      {viewingAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 text-[10px] font-bold uppercase tracking-wider">
                  {viewingAssignment.courseTitle}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{viewingAssignment.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Due Date: {viewingAssignment.dueDate} • Total Marks: {viewingAssignment.totalMarks} pts</p>
              </div>
              <button
                onClick={() => setViewingAssignment(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instructions box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Instructions & Guidelines</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{viewingAssignment.instructions}</p>
            </div>

            {/* If Already Submitted / Graded Display */}
            {viewingAssignment.status !== 'Pending' ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Submission Received
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700">{viewingAssignment.submittedAt}</span>
                  </div>
                  {viewingAssignment.submissionText && (
                    <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-emerald-100 font-mono">
                      {viewingAssignment.submissionText}
                    </p>
                  )}
                  {viewingAssignment.submissionLink && (
                    <a
                      href={viewingAssignment.submissionLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{viewingAssignment.submissionLink}</span>
                    </a>
                  )}
                </div>

                {/* Resubmit Option */}
                {viewingAssignment.status !== 'Graded' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingSubmission(true);
                        setSubmissionText(viewingAssignment.submissionText || '');
                        setSubmissionLink(viewingAssignment.submissionLink || '');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs flex items-center gap-1.5 border border-sky-200"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Resubmit / Edit Work</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Student Interactive Submission Form */
              <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Submission Text / Project Summary
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Enter project summary or answers..."
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  ></textarea>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Repository URL or Live Demo Link
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. github.com/your-username/repo-name or https://..."
                    value={submissionLink}
                    onChange={(e) => setSubmissionLink(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setViewingAssignment(null);
                      setIsEditingSubmission(false);
                    }}
                    className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAssignmentSubmit}
                    className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-sky-500/25 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isEditingSubmission ? 'Update & Resubmit' : 'Submit Assignment'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Instructor Grade Modal */}
      {gradingAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Grade Assignment Submission</h3>
              <button onClick={() => setGradingAssignment(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Marks Awarded (Out of {gradingAssignment.totalMarks}) *</label>
                <input
                  type="number"
                  max={gradingAssignment.totalMarks}
                  min="0"
                  required
                  placeholder="e.g. 95"
                  value={gradeMarks}
                  onChange={(e) => setGradeMarks(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Instructor Remarks & Feedback</label>
                <textarea
                  rows="3"
                  placeholder="Great performance! Keep up the good work..."
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGradingAssignment(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md"
                >
                  Save Grade & Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pre-Quiz Instructions Modal */}
      {preQuizModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                  {preQuizModal.courseTitle}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{preQuizModal.title}</h3>
              </div>
              <button onClick={() => setPreQuizModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Duration</span>
                <strong className="text-sm font-bold text-slate-800">{preQuizModal.durationMinutes} Minutes</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Questions</span>
                <strong className="text-sm font-bold text-slate-800">{preQuizModal.questions?.length || 5} MCQs</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Pass Criteria</span>
                <strong className="text-sm font-bold text-emerald-600">{preQuizModal.passMarks}/50 Pts</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs text-amber-900">
              <h4 className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Assessment Instructions:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
                <li>Timer begins immediately upon clicking <strong>"Start Quiz Now"</strong>.</li>
                <li>Do not refresh or close browser tab during the active quiz session.</li>
                <li>Quiz automatically submits when countdown reaches 00:00.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPreQuizModal(null)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStartQuiz(preQuizModal)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2"
              >
                <span>Start Quiz Now</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Quiz Player Modal */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in duration-200 relative">
            {/* Top Right Close Button */}
            <button
              onClick={() => setActiveQuiz(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer z-10"
              title="Close Quiz"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header & Timer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3 pr-8">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">{activeQuiz.title}</span>
                <h3 className="text-base font-bold text-slate-900">
                  Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}
                </h3>
              </div>

              {/* Question Navigator Pills Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {activeQuiz.questions.map((_, qIdx) => {
                  const isAnswered = selectedAnswers[qIdx] !== undefined;
                  const isCurrent = currentQuestionIdx === qIdx;
                  return (
                    <button
                      key={qIdx}
                      type="button"
                      onClick={() => setCurrentQuestionIdx(qIdx)}
                      className={`w-7 h-7 rounded-xl text-xs font-bold transition-all relative flex items-center justify-center ${
                        isCurrent
                          ? 'bg-sky-500 text-white ring-2 ring-sky-500/40'
                          : isAnswered
                          ? 'bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>Q{qIdx + 1}</span>
                      {isAnswered && !isCurrent && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-mono font-bold text-base shadow-xs shrink-0 self-end sm:self-center">
                <Timer className="w-5 h-5 text-amber-600 animate-spin" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {activeQuiz.questions[currentQuestionIdx]?.question || activeQuiz.questions[currentQuestionIdx]?.questionText}
              </h2>

              {/* Multiple Choice Options */}
              <div className="space-y-2.5">
                {activeQuiz.questions[currentQuestionIdx]?.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() =>
                        setSelectedAnswers((prev) => ({
                          ...prev,
                          [currentQuestionIdx]: optIdx,
                        }))
                      }
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold shadow-xs'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isSelected && <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx((prev) => prev - 1)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {currentQuestionIdx < activeQuiz.questions.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                    className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleFinalQuizSubmit}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Submit Quiz</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post-Quiz Results & Detailed Review Modal */}
      {quizResultModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2 border-b border-slate-100 pb-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold border ${
                quizResultModal.passed
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                {quizResultModal.passed ? '🎉 PASSED MODULE ASSESSMENT' : 'NEEDS IMPROVEMENT'}
              </span>
              <h2 className="text-2xl font-bold text-slate-900">{quizResultModal.quiz.title}</h2>
              <div className="flex items-center justify-center gap-4 text-sm mt-2">
                <span className="text-slate-600">
                  Score: <strong className="text-slate-900">{quizResultModal.score}/{quizResultModal.quiz.totalMarks}</strong>
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600">
                  Percentage: <strong className="text-sky-600">{quizResultModal.percentage}%</strong>
                </span>
              </div>
            </div>

            {/* Answer Review Section */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Question Review & Explanations</h4>
              {quizResultModal.quiz.questions.map((q, idx) => {
                const userAns = quizResultModal.userAnswers[idx];
                const isCorrect = userAns === q.correctAnswer;
                return (
                  <div
                    key={q.id || idx}
                    className={`p-4 rounded-2xl border text-xs space-y-2 ${
                      isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <strong className="text-slate-900 text-xs font-bold">
                        {idx + 1}. {q.question}
                      </strong>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? 'Correct (+10 Pts)' : 'Incorrect'}
                      </span>
                    </div>

                    <p className="text-slate-700">
                      Your Answer: <strong>{userAns !== undefined ? q.options[userAns] : 'Not Answered'}</strong>
                    </p>
                    {!isCorrect && (
                      <p className="text-emerald-700 font-semibold">
                        Correct Answer: {q.options[q.correctAnswer]}
                      </p>
                    )}
                    <p className="text-slate-500 text-[11px] italic bg-white/80 p-2 rounded-xl border border-slate-200">
                      💡 {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setQuizResultModal(null)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add Assignment Modal */}
      {isAddAssignmentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create New Module Assignment</h3>
              <button onClick={() => setIsAddAssignmentOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React Custom Hooks Lab"
                  value={newAsgTitle}
                  onChange={(e) => setNewAsgTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Select Academic Course *</label>
                <select
                  value={newAsgCourseId}
                  onChange={(e) => setNewAsgCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  {(courses || []).map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Detailed Instructions *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Detailed student guidelines..."
                  value={newAsgInstructions}
                  onChange={(e) => setNewAsgInstructions(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={newAsgDueDate}
                    onChange={(e) => setNewAsgDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Total Points *</label>
                  <input
                    type="number"
                    required
                    value={newAsgTotalMarks}
                    onChange={(e) => setNewAsgTotalMarks(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddAssignmentOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl shadow-md"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Add Quiz Modal with Custom Question Builder */}
      {isAddQuizOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create New Module Quiz</h3>
              <button onClick={() => setIsAddQuizOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuiz} className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Quiz Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JavaScript Async & ES6 Assessment"
                    value={newQuizTitle}
                    onChange={(e) => setNewQuizTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Select Academic Course *</label>
                  <select
                    value={newQuizCourseId}
                    onChange={(e) => setNewQuizCourseId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  >
                    {(courses || []).map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Duration (Minutes) *</label>
                  <input
                    type="number"
                    required
                    value={newQuizDuration}
                    onChange={(e) => setNewQuizDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Passing Mark (Out of 50) *</label>
                  <input
                    type="number"
                    required
                    value={newQuizPassMarks}
                    onChange={(e) => setNewQuizPassMarks(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              {/* Dynamic Question Builder Section */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Questions Builder ({newQuestions.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddQuestionBlock}
                    className="px-3 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-lg text-[11px] flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>

                {newQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sky-700 text-xs">Question {idx + 1}</span>
                      {newQuestions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestionBlock(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Question Statement</label>
                      <input
                        type="text"
                        placeholder="e.g. Which Hook handles side effects?"
                        value={q.question}
                        onChange={(e) => handleQuestionChange(idx, 'question', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Option A"
                        value={q.optionA}
                        onChange={(e) => handleQuestionChange(idx, 'optionA', e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl"
                      />
                      <input
                        type="text"
                        placeholder="Option B"
                        value={q.optionB}
                        onChange={(e) => handleQuestionChange(idx, 'optionB', e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl"
                      />
                      <input
                        type="text"
                        placeholder="Option C"
                        value={q.optionC}
                        onChange={(e) => handleQuestionChange(idx, 'optionC', e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl"
                      />
                      <input
                        type="text"
                        placeholder="Option D"
                        value={q.optionD}
                        onChange={(e) => handleQuestionChange(idx, 'optionD', e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700">Correct Option</label>
                        <select
                          value={q.correctAnswer}
                          onChange={(e) => handleQuestionChange(idx, 'correctAnswer', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                        >
                          <option value="0">Option A</option>
                          <option value="1">Option B</option>
                          <option value="2">Option C</option>
                          <option value="3">Option D</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700">Explanation Note</label>
                        <input
                          type="text"
                          placeholder="Brief explanation..."
                          value={q.explanation}
                          onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddQuizOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-md"
                >
                  Create Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsQuizzes;
