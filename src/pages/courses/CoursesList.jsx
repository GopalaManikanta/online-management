import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { useForm } from 'react-hook-form';
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
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

const ITEMS_PER_PAGE = 6;

const CoursesList = () => {
  const { courses, loading, error, addCourse, updateCourse, deleteCourse } = useLMS();

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

  const categories = ['All', 'React', 'JavaScript', 'Node.js', 'UI/UX Design', 'Python', 'Data Science'];

  // React Hook Form for Add/Edit
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Open Edit Modal
  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setValue('title', course.title);
    setValue('instructor', course.instructor);
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
    if (editingCourse) {
      updateCourse(editingCourse.id, data);
      setEditingCourse(null);
    } else {
      addCourse(data);
      setIsAddModalOpen(false);
      setSortBy('newest');
      setCurrentPage(1); // Jump to page 1 so newly created course displays FIRST
    }
    reset();
  };

  // Filter & Search Logic
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort Logic (Newest first preserves array order where new items are prepended)
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

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-sky-500/20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Course Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Course Management Directory
          </h1>
          <p className="text-sky-100 text-sm max-w-xl">
            Integrated with Third-Party API (DummyJSON / Axios) & LocalStorage for full CRUD actions.
          </p>
        </div>
        <button
          onClick={() => {
            reset();
            setEditingCourse(null);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-3 bg-white text-sky-600 hover:bg-sky-50 font-bold text-sm rounded-2xl shadow-md transition self-start sm:self-center"
        >
          <Plus className="w-5 h-5" />
          <span>Add Course</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500 mx-auto" />
          <p className="text-sm font-semibold">Fetching courses from Third-Party API...</p>
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
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-sky-200 transition-all duration-300 flex flex-col overflow-hidden group"
            >
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

              {/* Course Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-sky-600 transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Instructor & Actions Footer */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-600 font-bold flex items-center justify-center text-xs">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-800">{course.instructor}</span>
                    </div>
                    <span className="text-base font-extrabold text-sky-600">{course.price}</span>
                  </div>

                  {/* Course Action Buttons (Details, Edit, Delete) */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setViewingCourse(course)}
                      className="flex-1 py-2 bg-sky-50 hover:bg-sky-500 text-sky-600 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                    <button
                      onClick={() => handleOpenEdit(course)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                      title="Edit Course"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingCourse(course)}
                      className="p-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition cursor-pointer"
                      title="Delete Course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <BookOpen className="w-10 h-10 text-sky-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No courses found matching your filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md"
          >
            Reset Search Filters
          </button>
        </div>
      ) : null}

      {/* Pagination Controls */}
      {!loading && sortedCourses.length > ITEMS_PER_PAGE && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, sortedCourses.length)} of {sortedCourses.length} courses
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Course Modal */}
      {(isAddModalOpen || editingCourse) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingCourse ? 'Edit Course Details' : 'Add New Course'}
              </h2>
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                  {errors.title && <p className="text-[10px] text-red-500">{errors.title.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Instructor Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. John Smith"
                    {...register('instructor', { required: 'Instructor name is required' })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                  {errors.instructor && <p className="text-[10px] text-red-500">{errors.instructor.message}</p>}
                </div>
              </div>

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

      {/* Course Details Modal View */}
      {viewingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold rounded-lg">
                {viewingCourse.category}
              </span>
              <button
                onClick={() => setViewingCourse(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <img
                src={viewingCourse.thumbnail}
                alt={viewingCourse.title}
                className="w-full h-56 object-cover rounded-2xl"
              />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">{viewingCourse.title}</h2>
                <div className="flex flex-wrap gap-4 text-xs text-slate-600 font-medium">
                  <span>Instructor: <strong className="text-slate-900">{viewingCourse.instructor}</strong></span>
                  <span>Duration: <strong className="text-slate-900">{viewingCourse.duration}</strong></span>
                  <span>Level: <strong className="text-slate-900">{viewingCourse.level}</strong></span>
                  <span>Rating: <strong className="text-amber-500">{viewingCourse.rating} ★</strong></span>
                  <span>Price: <strong className="text-sky-600 text-sm">{viewingCourse.price}</strong></span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-600 leading-relaxed space-y-2">
                <h4 className="font-bold text-slate-800">Course Overview & Description</h4>
                <p>{viewingCourse.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setViewingCourse(null)}
                className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-sky-500/25"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-red-600 font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span>Confirm Delete Course</span>
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
                Are you sure you want to delete this course? This action will remove the course module permanently.
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
                  deleteCourse(deletingCourse.id);
                  setDeletingCourse(null);
                }}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-md shadow-red-500/25 cursor-pointer"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesList;
