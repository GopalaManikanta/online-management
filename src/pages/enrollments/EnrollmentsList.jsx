import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Plus,
  Search,
  BookOpen,
  Calendar,
  X,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  BookmarkCheck,
  Filter,
  CheckCircle2,
  Clock,
  Award,
  ArrowUpDown,
  GraduationCap
} from 'lucide-react';

const ITEMS_PER_PAGE = 8;

const EnrollmentsList = () => {
  const {
    enrollments,
    students,
    courses,
    addEnrollment,
    updateEnrollment,
    removeEnrollment,
    isAlreadyEnrolled,
  } = useLMS();

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatusTab, setSelectedStatusTab] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [viewingEnrollment, setViewingEnrollment] = useState(null);
  const [deletingEnrollment, setDeletingEnrollment] = useState(null);

  // Form States
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [enrollmentDate, setEnrollmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [enrollmentStatus, setEnrollmentStatus] = useState('Active');
  const [enrollmentProgress, setEnrollmentProgress] = useState(25);
  const [formError, setFormError] = useState('');

  // Categories list
  const categories = ['All', ...new Set(courses.map((c) => c.category || 'General'))];

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingEnrollment(null);
    setSelectedStudentId(students[0]?.id || '');
    setSelectedCourseId(courses[0]?.id || '');
    setEnrollmentDate(new Date().toISOString().split('T')[0]);
    setEnrollmentStatus('Active');
    setEnrollmentProgress(10);
    setFormError('');
    setIsEnrollModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item) => {
    setEditingEnrollment(item);
    setSelectedStudentId(item.studentId);
    setSelectedCourseId(item.courseId);
    setEnrollmentDate(item.enrollmentDate || new Date().toISOString().split('T')[0]);
    setEnrollmentStatus(item.status || 'Active');
    setEnrollmentProgress(item.progress !== undefined ? item.progress : 50);
    setFormError('');
  };

  // Submit Handler
  const handleSubmitEnrollment = (e) => {
    e.preventDefault();
    setFormError('');

    if (!selectedStudentId) {
      setFormError('Please select a student.');
      return;
    }
    if (!selectedCourseId) {
      setFormError('Please select a course.');
      return;
    }

    if (editingEnrollment) {
      const success = updateEnrollment(editingEnrollment.id, {
        studentId: selectedStudentId,
        courseId: selectedCourseId,
        enrollmentDate,
        status: enrollmentStatus,
        progress: enrollmentProgress,
      });

      if (success) {
        setEditingEnrollment(null);
      }
    } else {
      if (isAlreadyEnrolled(selectedStudentId, selectedCourseId)) {
        setFormError('This student is already enrolled in the selected course.');
        return;
      }

      const success = addEnrollment({
        studentId: selectedStudentId,
        courseId: selectedCourseId,
        enrollmentDate,
        status: enrollmentStatus,
        progress: enrollmentProgress,
      });

      if (success) {
        setIsEnrollModalOpen(false);
        setCurrentPage(1);
      }
    }
  };

  // Tab count metrics
  const statusCounts = {
    All: enrollments.length,
    Active: enrollments.filter((e) => (e.status || 'Active') === 'Active').length,
    Completed: enrollments.filter((e) => e.status === 'Completed').length,
    Pending: enrollments.filter((e) => e.status === 'Pending').length,
    Cancelled: enrollments.filter((e) => e.status === 'Cancelled').length,
  };

  // Filter & Search Logic
  const filteredEnrollments = enrollments
    .filter((e) => {
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        e.studentName.toLowerCase().includes(q) ||
        e.studentEmail.toLowerCase().includes(q) ||
        e.courseTitle.toLowerCase().includes(q) ||
        (e.courseCategory && e.courseCategory.toLowerCase().includes(q)) ||
        (e.id && e.id.toLowerCase().includes(q));

      const matchesCategory = selectedCategory === 'All' || e.courseCategory === selectedCategory;
      const matchesStatus = selectedStatusTab === 'All' || (e.status || 'Active') === selectedStatusTab;

      return matchesQuery && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.enrollmentDate || 0) - new Date(a.enrollmentDate || 0);
      if (sortBy === 'oldest') return new Date(a.enrollmentDate || 0) - new Date(b.enrollmentDate || 0);
      if (sortBy === 'progress-high') return (b.progress || 0) - (a.progress || 0);
      if (sortBy === 'price-high') {
        const priceA = parseFloat((a.coursePrice || '$0').replace(/[^0-9.]/g, '')) || 0;
        const priceB = parseFloat((b.coursePrice || '$0').replace(/[^0-9.]/g, '')) || 0;
        return priceB - priceA;
      }
      return 0;
    });

  // Pagination Logic
  const totalPages = Math.ceil(filteredEnrollments.length / ITEMS_PER_PAGE) || 1;
  const paginatedEnrollments = filteredEnrollments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Status Badge Styling Helper
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Completed':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      {/* Enterprise Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-sky-500/20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Enterprise LMS Enrollment Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Course Enrollments Directory</h1>
          <p className="text-sky-100 text-sm max-w-xl">
            Real-time enrollment management platform to track active subscriptions, student course progress, and completion metrics.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-sky-600 hover:bg-sky-50 font-bold shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Enroll Student</span>
        </button>
      </div>

      {/* 5-Card Interactive Status Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Card */}
        <button
          onClick={() => {
            setSelectedStatusTab('All');
            setCurrentPage(1);
          }}
          className={`bg-white rounded-2xl p-4 border transition-all text-left flex items-center justify-between cursor-pointer ${
            selectedStatusTab === 'All'
              ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-md'
              : 'border-sky-100 hover:border-sky-300 shadow-xs'
          }`}
        >
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Enrollments</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{statusCounts.All}</h3>
            <p className="text-[11px] text-sky-600 font-medium">All student records</p>
          </div>
          <div className="p-3 rounded-2xl bg-sky-50 text-sky-600">
            <BookmarkCheck className="w-5 h-5" />
          </div>
        </button>

        {/* Active Card */}
        <button
          onClick={() => {
            setSelectedStatusTab('Active');
            setCurrentPage(1);
          }}
          className={`bg-white rounded-2xl p-4 border transition-all text-left flex items-center justify-between cursor-pointer ${
            selectedStatusTab === 'Active'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
              : 'border-emerald-100 hover:border-emerald-300 shadow-xs'
          }`}
        >
          <div className="space-y-1">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Active</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{statusCounts.Active}</h3>
            <p className="text-[11px] text-emerald-600 font-medium">In learning progress</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </button>

        {/* Completed Card */}
        <button
          onClick={() => {
            setSelectedStatusTab('Completed');
            setCurrentPage(1);
          }}
          className={`bg-white rounded-2xl p-4 border transition-all text-left flex items-center justify-between cursor-pointer ${
            selectedStatusTab === 'Completed'
              ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
              : 'border-blue-100 hover:border-blue-300 shadow-xs'
          }`}
        >
          <div className="space-y-1">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Completed</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{statusCounts.Completed}</h3>
            <p className="text-[11px] text-blue-600 font-medium">Course finished</p>
          </div>
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
            <Award className="w-5 h-5" />
          </div>
        </button>

        {/* Pending Card */}
        <button
          onClick={() => {
            setSelectedStatusTab('Pending');
            setCurrentPage(1);
          }}
          className={`bg-white rounded-2xl p-4 border transition-all text-left flex items-center justify-between cursor-pointer ${
            selectedStatusTab === 'Pending'
              ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md'
              : 'border-amber-100 hover:border-amber-300 shadow-xs'
          }`}
        >
          <div className="space-y-1">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{statusCounts.Pending}</h3>
            <p className="text-[11px] text-amber-600 font-medium">Awaiting approval</p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </button>

        {/* Cancelled Card */}
        <button
          onClick={() => {
            setSelectedStatusTab('Cancelled');
            setCurrentPage(1);
          }}
          className={`bg-white rounded-2xl p-4 border transition-all text-left flex items-center justify-between cursor-pointer ${
            selectedStatusTab === 'Cancelled'
              ? 'border-red-500 ring-2 ring-red-500/20 shadow-md'
              : 'border-red-100 hover:border-red-300 shadow-xs'
          }`}
        >
          <div className="space-y-1">
            <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Cancelled</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{statusCounts.Cancelled}</h3>
            <p className="text-[11px] text-red-600 font-medium">Subscription ended</p>
          </div>
          <div className="p-3 rounded-2xl bg-red-50 text-red-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* Status Filter Tabs & Control Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-sky-100 shadow-xs space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto scrollbar-none">
          {['All', 'Active', 'Completed', 'Pending', 'Cancelled'].map((tab) => {
            const isActive = selectedStatusTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setSelectedStatusTab(tab);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {statusCounts[tab] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student, email, course title..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Category Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    Category: {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="progress-high">Sort: Highest Progress</option>
                <option value="price-high">Sort: Price (High to Low)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Production-Grade Enrollments Table */}
      <div className="bg-white rounded-3xl border border-sky-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sky-50/50 border-b border-sky-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Student Details</th>
                <th className="py-4 px-6">Enrolled Course</th>
                <th className="py-4 px-6">Date & Value</th>
                <th className="py-4 px-6">Course Progress</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedEnrollments.length > 0 ? (
                paginatedEnrollments.map((item) => {
                  const progressPct = item.progress !== undefined ? item.progress : (item.status === 'Completed' ? 100 : 35);
                  return (
                    <tr key={item.id} className="hover:bg-sky-50/30 transition-colors duration-150">
                      {/* Student Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
                            {item.studentName ? item.studentName.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{item.studentName}</p>
                            <p className="text-[11px] text-slate-500">{item.studentEmail}</p>
                            <span className="inline-block mt-0.5 text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                              {item.studentQualification || 'Enrolled Student'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Course Info */}
                      <td className="py-4 px-6">
                        <div className="space-y-1 max-w-xs">
                          <p className="font-bold text-slate-800 text-sm truncate">{item.courseTitle}</p>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                              {item.courseCategory || 'General'}
                            </span>
                            <span className="text-[11px] text-slate-400">Duration: {item.courseDuration || '6 Weeks'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Date & Value */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.enrollmentDate}</span>
                          </div>
                          <p className="text-xs font-bold text-emerald-600">{item.coursePrice || '$99'}</p>
                        </div>
                      </td>

                      {/* Course Progress Bar */}
                      <td className="py-4 px-6">
                        <div className="w-36 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-semibold">
                            <span className="text-slate-600 font-mono">{progressPct}%</span>
                            <span className="text-slate-400 text-[10px]">
                              {progressPct === 100 ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                progressPct === 100
                                  ? 'bg-sky-500'
                                  : progressPct > 50
                                  ? 'bg-emerald-500'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(
                            item.status
                          )}`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{item.status || 'Active'}</span>
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewingEnrollment(item)}
                            className="p-2 rounded-xl hover:bg-sky-100 text-sky-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-2 rounded-xl hover:bg-sky-100 text-sky-600 transition-colors"
                            title="Edit Enrollment"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingEnrollment(item)}
                            className="p-2 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
                            title="Remove Enrollment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <BookmarkCheck className="w-12 h-12 mx-auto mb-3 text-slate-300 stroke-1" />
                    <p className="font-bold text-slate-700">No enrollments match your criteria</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting search filters or enroll a new student into a course.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-sky-100 text-xs text-slate-500">
            <span>
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredEnrollments.length)} of {filteredEnrollments.length} enrollment records
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-slate-700 px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- ADD / EDIT ENROLLMENT MODAL --- */}
      {(isEnrollModalOpen || editingEnrollment) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-sky-100 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600">
                  <BookmarkCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {editingEnrollment ? 'Edit Enrollment Details' : 'Enroll Student into Course'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingEnrollment
                      ? 'Modify student assignment, course subscription, date, or progress.'
                      : 'Select a student and a course to register a new active enrollment.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsEnrollModalOpen(false);
                  setEditingEnrollment(null);
                }}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitEnrollment} className="space-y-4">
              {/* Select Student */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Student <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-white"
                >
                  <option value="">-- Choose a Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Course */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Course <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-white"
                >
                  <option value="">-- Choose a Course --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.price || '$99'}) - {c.category || 'General'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Enrollment Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Enrollment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={enrollmentDate}
                  onChange={(e) => setEnrollmentDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  required
                />
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Enrollment Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={enrollmentStatus}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setEnrollmentStatus(newStatus);
                    if (newStatus === 'Completed') setEnrollmentProgress(100);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Progress Slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Course Progress (%)
                  </label>
                  <span className="text-xs font-bold text-sky-600 font-mono">{enrollmentProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={enrollmentProgress}
                  onChange={(e) => setEnrollmentProgress(Number(e.target.value))}
                  disabled={enrollmentStatus === 'Completed'}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEnrollModalOpen(false);
                    setEditingEnrollment(null);
                  }}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-colors shadow-md shadow-sky-500/20"
                >
                  {editingEnrollment ? 'Save Changes' : 'Confirm Enrollment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ENTERPRISE VIEW ENROLLMENT DETAILS MODAL --- */}
      {viewingEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-sky-100 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600">
                  <BookmarkCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Enrollment Summary</h3>
                  <p className="text-xs font-mono text-slate-500">Record ID: {viewingEnrollment.id}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingEnrollment(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Student Profile Card */}
              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-3">
                <h4 className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  <span>Student Profile</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Full Name</span>
                    <strong className="text-slate-800 text-sm">{viewingEnrollment.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Email Address</span>
                    <span className="font-medium truncate block">{viewingEnrollment.studentEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Mobile Number</span>
                    <span className="font-medium">{viewingEnrollment.studentPhone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Qualification</span>
                    <span className="font-medium">{viewingEnrollment.studentQualification || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Course & Progress Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  <span>Course Subscription</span>
                </h4>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">{viewingEnrollment.courseTitle}</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700">
                    {viewingEnrollment.courseCategory || 'General'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-slate-600 text-[11px] pt-1">
                  <div>Price: <strong className="text-slate-800">{viewingEnrollment.coursePrice}</strong></div>
                  <div>Duration: <strong className="text-slate-800">{viewingEnrollment.courseDuration || '6 Weeks'}</strong></div>
                  <div>Enrolled: <strong className="text-slate-800">{viewingEnrollment.enrollmentDate}</strong></div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Learning Progress</span>
                    <span className="text-sky-600">{viewingEnrollment.progress || 50}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-sky-500 h-2 rounded-full"
                      style={{ width: `${viewingEnrollment.progress || 50}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setViewingEnrollment(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-colors shadow-md shadow-sky-500/20"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- REMOVE CONFIRMATION MODAL --- */}
      {deletingEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-red-100 space-y-6 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 border-8 border-red-100 text-red-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800">Remove Enrollment?</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Are you sure you want to remove <span className="font-semibold text-slate-800">{deletingEnrollment.studentName}</span> from <span className="font-semibold text-slate-800">{deletingEnrollment.courseTitle}</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setDeletingEnrollment(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors w-full"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  removeEnrollment(deletingEnrollment.id);
                  setDeletingEnrollment(null);
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md shadow-red-500/20 w-full"
              >
                Remove Enrollment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentsList;
