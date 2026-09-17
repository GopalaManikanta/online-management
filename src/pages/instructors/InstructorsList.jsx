import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Plus,
  Search,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  X,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Award,
  Briefcase,
  Grid,
  List,
  Check,
  Star,
  Users,
  Filter,
  ArrowUpDown,
  UserPlus
} from 'lucide-react';

const ITEMS_PER_PAGE = 8;

const InstructorsList = () => {
  const {
    instructors,
    courses,
    students,
    enrollments,
    addInstructor,
    updateInstructor,
    deleteInstructor,
    assignCourseToInstructor,
    addEnrollment,
    removeEnrollment,
  } = useLMS();

  // Filter, Sort & View Mode States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [viewingInstructor, setViewingInstructor] = useState(null);
  const [assigningInstructor, setAssigningInstructor] = useState(null);
  const [deletingInstructor, setDeletingInstructor] = useState(null);

  // Direct Student Selection Modal State
  const [enrollingInstructor, setEnrollingInstructor] = useState(null);
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState('');
  const [selectedStudentIdsForEnroll, setSelectedStudentIdsForEnroll] = useState([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  // Form States for Add / Edit Instructor
  const [instructorForm, setInstructorForm] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '5 Years',
    specialization: 'Full Stack Web Development',
    rating: '4.8',
    avatar: '',
    bio: '',
  });
  const [formError, setFormError] = useState('');

  // Course Assignment Form State
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);

  // Specializations list
  const specializations = ['All', ...new Set(instructors.map((i) => i.specialization || 'General'))];

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingInstructor(null);
    setInstructorForm({
      name: '',
      email: '',
      phone: '+1 (555) 019-2831',
      experience: '5 Years',
      specialization: 'React & Frontend Architecture',
      rating: '4.8',
      avatar: '',
      bio: 'Experienced faculty member passionate about modern web engineering.',
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (inst) => {
    setEditingInstructor(inst);
    setInstructorForm({
      name: inst.name,
      email: inst.email,
      phone: inst.phone || '+1 (555) 019-2831',
      experience: inst.experience || '5 Years',
      specialization: inst.specialization || 'Software Engineering',
      rating: inst.rating ? String(inst.rating) : '4.8',
      avatar: inst.avatar || '',
      bio: inst.bio || '',
    });
    setFormError('');
  };

  // Open Assign Courses Modal
  const handleOpenAssignModal = (inst) => {
    setAssigningInstructor(inst);
    setSelectedCourseIds(inst.assignedCourseIds || []);
  };

  // Submit Add or Edit Form
  const handleSubmitInstructor = (e) => {
    e.preventDefault();
    setFormError('');

    if (!instructorForm.name.trim()) {
      setFormError('Instructor name is required.');
      return;
    }
    if (!instructorForm.email.trim() || !/\S+@\S+\.\S+/.test(instructorForm.email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (editingInstructor) {
      updateInstructor(editingInstructor.id, {
        ...instructorForm,
        rating: Number(instructorForm.rating) || 4.8,
      });
      setEditingInstructor(null);
    } else {
      addInstructor({
        ...instructorForm,
        rating: Number(instructorForm.rating) || 4.8,
      });
      setIsAddModalOpen(false);
      setCurrentPage(1);
    }
  };

  // Toggle Course Assignment Checkbox
  const handleToggleCourse = (courseId) => {
    if (selectedCourseIds.includes(courseId)) {
      setSelectedCourseIds(selectedCourseIds.filter((id) => id !== courseId));
    } else {
      setSelectedCourseIds([...selectedCourseIds, courseId]);
    }
  };

  // Save Assigned Courses
  const handleSaveAssignments = () => {
    if (assigningInstructor) {
      assignCourseToInstructor(assigningInstructor.id, selectedCourseIds);
      setAssigningInstructor(null);
    }
  };

  // Open Direct Student Selection Modal for Instructor
  const handleOpenEnrollStudentsModal = (inst) => {
    setEnrollingInstructor(inst);
    const initialCourse = inst.assignedCourseIds?.[0] || courses[0]?.id || '';
    setSelectedCourseForEnroll(initialCourse);
    setSelectedStudentIdsForEnroll([]);
    setStudentSearchQuery('');
  };

  // Toggle Student selection checkbox
  const handleToggleStudentSelection = (studentId) => {
    if (selectedStudentIdsForEnroll.includes(studentId)) {
      setSelectedStudentIdsForEnroll(selectedStudentIdsForEnroll.filter((id) => id !== studentId));
    } else {
      setSelectedStudentIdsForEnroll([...selectedStudentIdsForEnroll, studentId]);
    }
  };

  // Submit batch enroll students to instructor's course
  const handleBatchEnrollStudents = (e) => {
    e.preventDefault();
    if (!selectedCourseForEnroll) {
      return;
    }
    if (selectedStudentIdsForEnroll.length === 0) {
      return;
    }

    selectedStudentIdsForEnroll.forEach((studentId) => {
      addEnrollment({
        studentId,
        courseId: selectedCourseForEnroll,
        status: 'Active',
        progress: 10,
      });
    });

    setEnrollingInstructor(null);
  };

  // Filter & Sort Logic
  const filteredInstructors = instructors
    .filter((inst) => {
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        inst.name.toLowerCase().includes(q) ||
        inst.email.toLowerCase().includes(q) ||
        (inst.specialization && inst.specialization.toLowerCase().includes(q));

      const matchesSpec = selectedSpecialization === 'All' || inst.specialization === selectedSpecialization;

      return matchesQuery && matchesSpec;
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'rating-high') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'courses-high') return (b.assignedCourseIds?.length || 0) - (a.assignedCourseIds?.length || 0);
      if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  // Pagination Logic
  const totalPages = Math.ceil(filteredInstructors.length / ITEMS_PER_PAGE) || 1;
  const paginatedInstructors = filteredInstructors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Compute Instructor Metrics
  const totalInstructors = instructors.length;
  const totalAssignedCourses = instructors.reduce((sum, i) => sum + (i.assignedCourseIds?.length || 0), 0);
  const avgRating = instructors.length > 0
    ? (instructors.reduce((sum, i) => sum + (i.rating || 4.8), 0) / instructors.length).toFixed(1)
    : '4.8';
  const totalStudentsTaughtOverall = enrollments.length;

  // Helper to get Assigned Courses Objects for an instructor
  const getAssignedCourses = (assignedCourseIds = []) => {
    return courses.filter((c) => assignedCourseIds.includes(c.id));
  };

  // Helper to get total students enrolled in instructor's courses
  const getStudentsTaughtCount = (assignedCourseIds = []) => {
    return enrollments.filter((e) => assignedCourseIds.includes(e.courseId)).length;
  };

  // Helper to get total course value generated by instructor
  const getInstructorCourseValue = (assignedCourseIds = []) => {
    const assignedCoursesList = getAssignedCourses(assignedCourseIds);
    return assignedCoursesList.reduce((sum, c) => {
      const priceNum = parseFloat((c.price || '$0').replace(/[^0-9.]/g, '')) || 0;
      return sum + priceNum;
    }, 0);
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      {/* Enterprise Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-sky-500/20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Enterprise Faculty Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Academic Faculty Directory</h1>
          <p className="text-sky-100 text-sm max-w-xl">
            Register lead instructors, assign specialized courses, track student enrollment reach, and manage faculty credentials.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-sky-600 hover:bg-sky-50 font-bold shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Add Instructor</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Faculty</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalInstructors}</h3>
            <p className="text-[11px] text-emerald-600 font-medium">+100% active staff</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-sky-50 text-sky-600">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Courses</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalAssignedCourses}</h3>
            <p className="text-[11px] text-indigo-600 font-medium">Course allocations</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Students Taught</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalStudentsTaughtOverall}</h3>
            <p className="text-[11px] text-sky-600 font-medium">Learners reached</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Excellence Rating</p>
            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-1">
              <span>{avgRating}</span>
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </h3>
            <p className="text-[11px] text-amber-600 font-medium">Average feedback</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Specialization Filter, Sort & View Mode Switcher */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-sky-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, specialization..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Specialization Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedSpecialization}
              onChange={(e) => {
                setSelectedSpecialization(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  Domain: {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            >
              <option value="newest">Sort: Newest Joined</option>
              <option value="name-asc">Sort: Name (A to Z)</option>
              <option value="rating-high">Sort: Rating (High to Low)</option>
              <option value="courses-high">Sort: Most Courses Assigned</option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'grid' ? 'bg-white text-sky-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'table' ? 'bg-white text-sky-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- INSTRUCTOR GRID VIEW --- */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedInstructors.length > 0 ? (
            paginatedInstructors.map((inst) => {
              const assignedCoursesList = getAssignedCourses(inst.assignedCourseIds);
              const studentsTaught = getStudentsTaughtCount(inst.assignedCourseIds);

              return (
                <div
                  key={inst.id}
                  className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group space-y-4 relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Header Avatar, Rating & Experience Badge */}
                    <div className="flex items-start justify-between">
                      <div className="relative">
                        <img
                          src={inst.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={inst.name}
                          className="w-16 h-16 rounded-2xl object-cover ring-4 ring-sky-50 shadow-sm"
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{inst.rating || 4.8}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700">
                          <Briefcase className="w-3 h-3" />
                          <span>{inst.experience}</span>
                        </span>
                      </div>
                    </div>

                    {/* Name & Email */}
                    <div>
                      <h3 className="text-base font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                        {inst.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{inst.email}</span>
                      </p>
                      {inst.phone && (
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-300 shrink-0" />
                          <span>{inst.phone}</span>
                        </p>
                      )}
                    </div>

                    {/* Specialization Pill */}
                    <div className="p-3 rounded-2xl bg-sky-50/50 border border-sky-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specialization</p>
                      <p className="text-xs font-semibold text-sky-700 mt-0.5 truncate">{inst.specialization}</p>
                    </div>

                    {/* Assigned Courses Tags */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Courses</p>
                      <div className="flex flex-wrap gap-1">
                        {assignedCoursesList.length > 0 ? (
                          assignedCoursesList.slice(0, 2).map((c) => (
                            <span key={c.id} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium truncate max-w-[120px]">
                              {c.title}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">No courses assigned</span>
                        )}
                        {assignedCoursesList.length > 2 && (
                          <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 text-[10px] font-bold">
                            +{assignedCoursesList.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metric Pills */}
                    <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2 border-t border-slate-100">
                      <div className="p-2 rounded-xl bg-slate-50">
                        <span className="text-[10px] text-slate-400 block font-semibold">Courses</span>
                        <strong className="text-slate-800 font-extrabold">{assignedCoursesList.length}</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50">
                        <span className="text-[10px] text-slate-400 block font-semibold">Students</span>
                        <strong className="text-slate-800 font-extrabold">{studentsTaught}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                    <button
                      onClick={() => setViewingInstructor(inst)}
                      className="px-3.5 py-2 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Profile</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEnrollStudentsModal(inst)}
                        className="p-2 rounded-xl hover:bg-sky-50 text-sky-600 transition-colors cursor-pointer"
                        title="Select & Enroll Students"
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenAssignModal(inst)}
                        className="p-2 rounded-xl hover:bg-sky-50 text-sky-600 transition-colors cursor-pointer"
                        title="Assign Courses"
                      >
                        <BookOpen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(inst)}
                        className="p-2 rounded-xl hover:bg-sky-50 text-sky-600 transition-colors cursor-pointer"
                        title="Edit Instructor"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingInstructor(inst)}
                        className="p-2 rounded-xl hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                        title="Delete Instructor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-3xl border border-sky-100">
              <GraduationCap className="w-12 h-12 mx-auto mb-3 text-slate-300 stroke-1" />
              <p className="font-bold text-slate-700">No instructors match your search criteria</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting search filters or add a new faculty member.</p>
            </div>
          )}
        </div>
      ) : (
        /* --- INSTRUCTOR TABLE VIEW --- */
        <div className="bg-white rounded-3xl border border-sky-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sky-50/50 border-b border-sky-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Instructor Profile</th>
                  <th className="py-4 px-6">Specialization & Bio</th>
                  <th className="py-4 px-6">Experience & Rating</th>
                  <th className="py-4 px-6">Assigned Courses</th>
                  <th className="py-4 px-6">Students Taught</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedInstructors.length > 0 ? (
                  paginatedInstructors.map((inst) => {
                    const assignedCoursesList = getAssignedCourses(inst.assignedCourseIds);
                    const studentsTaught = getStudentsTaughtCount(inst.assignedCourseIds);

                    return (
                      <tr key={inst.id} className="hover:bg-sky-50/30 transition-colors duration-150">
                        {/* Instructor Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={inst.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                              alt={inst.name}
                              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-sky-100 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{inst.name}</p>
                              <p className="text-[11px] text-slate-500">{inst.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Specialization & Bio */}
                        <td className="py-4 px-6">
                          <div className="space-y-0.5 max-w-xs">
                            <p className="font-semibold text-slate-800 text-xs">{inst.specialization}</p>
                            <p className="text-[11px] text-slate-400 truncate">{inst.bio || 'Faculty Member'}</p>
                          </div>
                        </td>

                        {/* Experience & Rating */}
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                              {inst.experience}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              <span>{inst.rating || 4.8} / 5.0</span>
                            </div>
                          </div>
                        </td>

                        {/* Assigned Courses */}
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {assignedCoursesList.length > 0 ? (
                              assignedCoursesList.map((c) => (
                                <span key={c.id} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                                  {c.title}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 text-[10px] italic">No courses assigned</span>
                            )}
                          </div>
                        </td>

                        {/* Students Taught */}
                        <td className="py-4 px-6 font-bold text-slate-800">
                          <div className="flex items-center gap-1 text-slate-700">
                            <Users className="w-3.5 h-3.5 text-sky-600" />
                            <span>{studentsTaught} Learners</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setViewingInstructor(inst)}
                              className="p-2 rounded-xl hover:bg-sky-100 text-sky-600 transition-colors"
                              title="View Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEnrollStudentsModal(inst)}
                              className="p-2 rounded-xl hover:bg-sky-100 text-sky-600 transition-colors"
                              title="Select & Enroll Students"
                            >
                              <UserPlus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenAssignModal(inst)}
                              className="p-2 rounded-xl hover:bg-sky-100 text-sky-600 transition-colors"
                              title="Assign Courses"
                            >
                              <BookOpen className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(inst)}
                              className="p-2 rounded-xl hover:bg-sky-100 text-sky-600 transition-colors"
                              title="Edit Instructor"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingInstructor(inst)}
                              className="p-2 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
                              title="Delete Instructor"
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
                      <GraduationCap className="w-12 h-12 mx-auto mb-3 text-slate-300 stroke-1" />
                      <p className="font-bold text-slate-700">No instructors found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-sky-100 text-xs text-slate-500">
          <span>
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredInstructors.length)} of {filteredInstructors.length} faculty members
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-700 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT INSTRUCTOR MODAL --- */}
      {(isAddModalOpen || editingInstructor) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-sky-100 space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {editingInstructor ? 'Edit Faculty Details' : 'Register New Instructor'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingInstructor
                      ? 'Update instructor profile, contact details, rating, or bio.'
                      : 'Add a new academic faculty member to your institute.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingInstructor(null);
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

            <form onSubmit={handleSubmitInstructor} className="space-y-4 text-xs">
              {/* Name */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sarah Johnson"
                  value={instructorForm.name}
                  onChange={(e) => setInstructorForm({ ...instructorForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah.johnson@edusync.com"
                    value={instructorForm.email}
                    onChange={(e) => setInstructorForm({ ...instructorForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +1 (555) 234-5678"
                    value={instructorForm.phone}
                    onChange={(e) => setInstructorForm({ ...instructorForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm"
                  />
                </div>
              </div>

              {/* Experience & Rating */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 8 Years"
                    value={instructorForm.experience}
                    onChange={(e) => setInstructorForm({ ...instructorForm, experience: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Rating (1 - 5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    placeholder="4.9"
                    value={instructorForm.rating}
                    onChange={(e) => setInstructorForm({ ...instructorForm, rating: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm"
                  />
                </div>
              </div>

              {/* Specialization */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Specialization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React & Frontend Architecture"
                  value={instructorForm.specialization}
                  onChange={(e) => setInstructorForm({ ...instructorForm, specialization: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm"
                />
              </div>

              {/* Profile Image URL */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Profile Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={instructorForm.avatar}
                  onChange={(e) => setInstructorForm({ ...instructorForm, avatar: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm"
                />
              </div>

              {/* Short Bio */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Faculty Bio / Summary
                </label>
                <textarea
                  rows="3"
                  placeholder="Brief summary of faculty background..."
                  value={instructorForm.bio}
                  onChange={(e) => setInstructorForm({ ...instructorForm, bio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingInstructor(null);
                  }}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-colors shadow-md shadow-sky-500/20"
                >
                  {editingInstructor ? 'Save Changes' : 'Register Instructor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ASSIGN COURSES MODAL --- */}
      {assigningInstructor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-sky-100 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Assign Courses</h3>
                  <p className="text-xs text-slate-500">Faculty: {assigningInstructor.name}</p>
                </div>
              </div>
              <button
                onClick={() => setAssigningInstructor(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
              <p className="font-bold text-slate-700 uppercase tracking-wider">Select Courses to Assign:</p>
              {courses.map((course) => {
                const isAssigned = selectedCourseIds.includes(course.id);
                return (
                  <div
                    key={course.id}
                    onClick={() => handleToggleCourse(course.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isAssigned
                        ? 'border-sky-500 bg-sky-50/50 text-sky-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-800">{course.title}</p>
                        <p className="text-[10px] text-slate-500">{course.category} • {course.price}</p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                        isAssigned ? 'bg-sky-500 border-sky-500 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isAssigned && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setAssigningInstructor(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssignments}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-colors shadow-md shadow-sky-500/20"
              >
                Save Assignments ({selectedCourseIds.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ENTERPRISE INSTRUCTOR PROFILE DETAILS MODAL --- */}
      {viewingInstructor && (() => {
        const assignedCoursesList = getAssignedCourses(viewingInstructor.assignedCourseIds);
        const instructorStudents = enrollments.filter((e) =>
          viewingInstructor.assignedCourseIds?.includes(e.courseId)
        );

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-sky-100 space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              {/* Header Profile Card */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative">
                    <img
                      src={viewingInstructor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={viewingInstructor.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-sky-100 shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800">{viewingInstructor.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700">
                        {viewingInstructor.specialization}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-sky-600" />
                        {viewingInstructor.email}
                      </span>
                      {viewingInstructor.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-sky-600" />
                          {viewingInstructor.phone}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingInstructor(null)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 text-xs">
                {/* Bio Banner */}
                {viewingInstructor.bio && (
                  <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 text-slate-600 text-xs italic leading-relaxed">
                    "{viewingInstructor.bio}"
                  </div>
                )}

                {/* Profile Key Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Experience</span>
                    <span className="font-extrabold text-sky-600 text-sm mt-0.5 block">{viewingInstructor.experience}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Faculty Rating</span>
                    <span className="font-extrabold text-amber-600 text-sm mt-0.5 flex items-center justify-center gap-1">
                      {viewingInstructor.rating || 4.8} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Courses Assigned</span>
                    <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">{assignedCoursesList.length}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Enrolled Students</span>
                    <span className="font-extrabold text-emerald-600 text-sm mt-0.5 block">{instructorStudents.length}</span>
                  </div>
                </div>

                {/* Section 1: Assigned Courses */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-sky-600" />
                      <span>Assigned Academic Courses ({assignedCoursesList.length})</span>
                    </h4>
                    <span className="text-sky-600 font-mono text-[11px] font-bold">
                      Total Value: ${getInstructorCourseValue(viewingInstructor.assignedCourseIds)}
                    </span>
                  </div>

                  {assignedCoursesList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {assignedCoursesList.map((c) => {
                        const courseEnrCount = enrollments.filter((e) => e.courseId === c.id).length;
                        return (
                          <div key={c.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <img src={c.thumbnail} alt={c.title} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                              <div className="truncate">
                                <p className="font-bold text-slate-800 text-xs truncate">{c.title}</p>
                                <p className="text-[10px] text-slate-500">{c.category} • {courseEnrCount} Students</p>
                              </div>
                            </div>
                            <span className="font-bold text-sky-600 text-xs shrink-0">{c.price}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-center py-4 bg-slate-50 rounded-2xl italic">
                      No courses currently assigned to this faculty member.
                    </p>
                  )}
                </div>

                {/* Section 2: Enrolled Students Under Faculty Member */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4 text-sky-600" />
                      <span>Enrolled Students Under Faculty ({instructorStudents.length})</span>
                    </h4>

                    <button
                      onClick={() => handleOpenEnrollStudentsModal(viewingInstructor)}
                      className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>+ Enroll Student</span>
                    </button>
                  </div>

                  {instructorStudents.length > 0 ? (
                    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-sky-50/70 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              <th className="py-2.5 px-3">Student Name</th>
                              <th className="py-2.5 px-3">Course</th>
                              <th className="py-2.5 px-3">Learning Progress</th>
                              <th className="py-2.5 px-3">Status</th>
                              <th className="py-2.5 px-3 text-right">Enrolled Date</th>
                              <th className="py-2.5 px-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs bg-white">
                            {instructorStudents.map((st) => {
                              const statusLower = (st.status || 'Active').toLowerCase();
                              let statusBadge = (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700">
                                  Active
                                </span>
                              );
                              if (statusLower === 'completed') {
                                statusBadge = (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                                    Completed
                                  </span>
                                );
                              } else if (statusLower === 'pending') {
                                statusBadge = (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                                    Pending
                                  </span>
                                );
                              } else if (statusLower === 'cancelled' || statusLower === 'canceled') {
                                statusBadge = (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                                    Cancelled
                                  </span>
                                );
                              }

                              const progressVal = typeof st.progress === 'number' ? st.progress : statusLower === 'completed' ? 100 : 45;

                              return (
                                <tr key={st.id || `${st.studentId}-${st.courseId}`} className="hover:bg-slate-50 transition-colors">
                                  <td className="py-2.5 px-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                                        {st.studentName ? st.studentName.charAt(0).toUpperCase() : 'S'}
                                      </div>
                                      <div>
                                        <p className="font-bold text-slate-800 text-xs">{st.studentName}</p>
                                        <p className="text-[10px] text-slate-400">{st.studentEmail}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <p className="font-semibold text-slate-800 text-xs">{st.courseTitle}</p>
                                    <p className="text-[10px] text-slate-400">{st.courseCategory || 'General'}</p>
                                  </td>
                                  <td className="py-2.5 px-3 min-w-[120px]">
                                    <div className="space-y-1">
                                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                                        <span>Progress</span>
                                        <span>{progressVal}%</span>
                                      </div>
                                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                          className={`h-full rounded-full ${
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
                                  </td>
                                  <td className="py-2.5 px-3">{statusBadge}</td>
                                  <td className="py-2.5 px-3 text-right text-[11px] font-medium text-slate-500">
                                    {st.enrollmentDate || 'Recent'}
                                  </td>
                                  <td className="py-2.5 px-3 text-right">
                                    <button
                                      onClick={() => removeEnrollment(st.id)}
                                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                      title="Remove Enrollment"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <Users className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs font-bold text-slate-600">No Enrolled Students Yet</p>
                      <button
                        onClick={() => handleOpenEnrollStudentsModal(viewingInstructor)}
                        className="px-3.5 py-1.5 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Select & Add Students</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setViewingInstructor(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-colors shadow-md shadow-sky-500/20"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* --- DIRECT STUDENT SELECTION & ENROLLMENT MODAL --- */}
      {enrollingInstructor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-sky-100 space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Select & Enroll Students</h3>
                  <p className="text-xs text-slate-500">Faculty: {enrollingInstructor.name}</p>
                </div>
              </div>
              <button
                onClick={() => setEnrollingInstructor(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Step 1: Select Course */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  1. Select Course taught by {enrollingInstructor.name}:
                </label>
                <select
                  value={selectedCourseForEnroll}
                  onChange={(e) => setSelectedCourseForEnroll(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                >
                  {getAssignedCourses(enrollingInstructor.assignedCourseIds).length > 0 ? (
                    getAssignedCourses(enrollingInstructor.assignedCourseIds).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.category} • {c.price})
                      </option>
                    ))
                  ) : (
                    courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.category} • {c.price})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Form Step 2: Search and Select Students */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider">
                    2. Select Students to Enroll:
                  </label>
                  <span className="text-sky-600 font-bold">{selectedStudentIdsForEnroll.length} Selected</span>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search student by name or email..."
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {students
                    .filter((st) => {
                      const q = studentSearchQuery.toLowerCase();
                      return st.name.toLowerCase().includes(q) || st.email.toLowerCase().includes(q);
                    })
                    .map((st) => {
                      const alreadyEnrolled = enrollments.some(
                        (e) => e.studentId === st.id && e.courseId === selectedCourseForEnroll && e.status === 'Active'
                      );
                      const isSelected = selectedStudentIdsForEnroll.includes(st.id);

                      return (
                        <div
                          key={st.id}
                          onClick={() => !alreadyEnrolled && handleToggleStudentSelection(st.id)}
                          className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                            alreadyEnrolled
                              ? 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed opacity-70'
                              : isSelected
                              ? 'border-sky-500 bg-sky-50/60 text-sky-900 cursor-pointer shadow-xs font-semibold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-sky-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                              {st.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{st.name}</p>
                              <p className="text-[10px] text-slate-400">{st.email} • {st.qualification || 'Student'}</p>
                            </div>
                          </div>

                          {alreadyEnrolled ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                              Enrolled
                            </span>
                          ) : (
                            <div
                              className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                                isSelected ? 'bg-sky-500 border-sky-500 text-white' : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEnrollingInstructor(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBatchEnrollStudents}
                disabled={selectedStudentIdsForEnroll.length === 0}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-sky-500/20"
              >
                Enroll Selected ({selectedStudentIdsForEnroll.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- REMOVE CONFIRMATION MODAL --- */}
      {deletingInstructor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-red-100 space-y-6 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 border-8 border-red-100 text-red-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800">Remove Instructor?</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Are you sure you want to remove <span className="font-semibold text-slate-800">{deletingInstructor.name}</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setDeletingInstructor(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors w-full"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteInstructor(deletingInstructor.id);
                  setDeletingInstructor(null);
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md shadow-red-500/20 w-full"
              >
                Delete Instructor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorsList;
