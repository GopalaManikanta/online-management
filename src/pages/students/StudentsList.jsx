import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { useForm } from 'react-hook-form';
import {
  Plus,
  Search,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  X,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  AlertTriangle
} from 'lucide-react';

const ITEMS_PER_PAGE = 6;

const StudentsList = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useLMS();

  // Search & Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);

  // React Hook Form for Add & Edit
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Open Edit Modal
  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setValue('name', student.name);
    setValue('email', student.email);
    setValue('phone', student.phone);
    setValue('address', student.address);
    setValue('qualification', student.qualification);
    setValue('enrollmentDate', student.enrollmentDate);
  };

  // Submit Add or Edit Form
  const handleFormSubmit = (data) => {
    if (editingStudent) {
      updateStudent(editingStudent.id, data);
      setEditingStudent(null);
    } else {
      addStudent(data);
      setIsAddModalOpen(false);
      setCurrentPage(1); // Jump to page 1 so new student displays at the top
    }
    reset();
  };

  // Filter & Search Logic (Full Name, Email, Mobile Number, Qualification)
  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.phone && s.phone.toLowerCase().includes(q)) ||
      (s.qualification && s.qualification.toLowerCase().includes(q)) ||
      (s.address && s.address.toLowerCase().includes(q))
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE) || 1;
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const defaultDate = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      {/* Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-sky-500/20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Student Management Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Enrolled Students
          </h1>
          <p className="text-sky-100 text-sm max-w-xl">
            Add, update, search, and manage student enrollment records with full validation.
          </p>
        </div>
        <button
          onClick={() => {
            reset({
              name: '',
              email: '',
              phone: '',
              address: '',
              qualification: 'B.Tech / B.E.',
              enrollmentDate: defaultDate,
            });
            setEditingStudent(null);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-3 bg-white text-sky-600 hover:bg-sky-50 font-bold text-sm rounded-2xl shadow-md transition self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add Student</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by full name, email, mobile number, or qualification..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500 hidden sm:block">
          Total Registered: <span className="text-sky-600 font-bold">{students.length}</span>
        </div>
      </div>

      {/* Student Cards Grid */}
      {paginatedStudents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedStudents.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                {/* Header Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-sky-500/20">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 text-base truncate group-hover:text-sky-600 transition-colors">
                        {student.name}
                      </h3>
                      <span className="inline-block px-2.5 py-0.5 rounded-lg bg-sky-50 text-sky-700 text-[11px] font-semibold border border-sky-100 mt-0.5">
                        {student.qualification || 'Higher Education'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details List */}
                <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <span>{student.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <span className="truncate">{student.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <span>Enrolled: {student.enrollmentDate}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setViewingStudent(student)}
                  className="flex-1 py-2 bg-sky-50 hover:bg-sky-500 text-sky-600 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => handleOpenEdit(student)}
                  className="p-2 bg-white hover:bg-slate-200 text-slate-700 rounded-xl transition border border-slate-200 cursor-pointer"
                  title="Edit Student"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeletingStudent(student)}
                  className="p-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition cursor-pointer"
                  title="Delete Student"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <Users className="w-10 h-10 text-sky-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">
            {searchQuery ? 'No student records found matching your search.' : 'No students registered yet.'}
          </p>
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
            >
              Clear Search Query
            </button>
          ) : (
            <button
              onClick={() => {
                reset({
                  name: '',
                  email: '',
                  phone: '',
                  address: '',
                  qualification: 'B.Tech / B.E.',
                  enrollmentDate: defaultDate,
                });
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2 bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
            >
              Add First Student
            </button>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {filteredStudents.length > ITEMS_PER_PAGE && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)} of {filteredStudents.length} students
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {(isAddModalOpen || editingStudent) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingStudent ? 'Edit Student Details' : 'Add New Student'}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingStudent(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-xs">
              {/* Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    {...register('name', { required: 'Full name is required' })}
                    className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'
                    }`}
                  />
                  {errors.name && <p className="text-[10px] text-red-500 font-medium">{errors.name.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    placeholder="e.g. rahul@edusync.com"
                    {...register('email', {
                      required: 'Email address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Enter a valid email address',
                      },
                    })}
                    className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      errors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'
                    }`}
                  />
                  {errors.email && <p className="text-[10px] text-red-500 font-medium">{errors.email.message}</p>}
                </div>
              </div>

              {/* Mobile Number & Qualification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Mobile Number *</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    {...register('phone', {
                      required: 'Mobile number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Enter a valid 10-digit mobile number',
                      },
                    })}
                    className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      errors.phone ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'
                    }`}
                  />
                  {errors.phone && <p className="text-[10px] text-red-500 font-medium">{errors.phone.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Qualification *</label>
                  <select
                    {...register('qualification', { required: 'Qualification is required' })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-white"
                  >
                    <option value="B.Tech / B.E.">B.Tech / B.E.</option>
                    <option value="MCA / M.Sc">MCA / M.Sc</option>
                    <option value="Degree (B.Sc / B.Com / B.A)">Degree (B.Sc / B.Com / B.A)</option>
                    <option value="Diploma">Diploma</option>
                    <option value="High School / Intermediate">High School / Intermediate</option>
                    <option value="M.Tech / Ph.D">M.Tech / Ph.D</option>
                  </select>
                </div>
              </div>

              {/* Enrollment Date */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Enrollment Date *</label>
                <input
                  type="date"
                  {...register('enrollmentDate', { required: 'Enrollment date is required' })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-white"
                />
                {errors.enrollmentDate && <p className="text-[10px] text-red-500 font-medium">{errors.enrollmentDate.message}</p>}
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Full Address *</label>
                <textarea
                  rows="3"
                  placeholder="Enter full address details (City, State, Zip)..."
                  {...register('address', { required: 'Address is required' })}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.address ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'
                  }`}
                ></textarea>
                {errors.address && <p className="text-[10px] text-red-500 font-medium">{errors.address.message}</p>}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingStudent(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl shadow-md shadow-sky-500/25 cursor-pointer"
                >
                  {editingStudent ? 'Save Changes' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Student Details Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold rounded-lg">
                Student Profile Record
              </span>
              <button
                onClick={() => setViewingStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-extrabold flex items-center justify-center text-xl shadow-md shadow-sky-500/20">
                  {viewingStudent.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{viewingStudent.name}</h3>
                  <p className="text-xs text-sky-600 font-semibold">{viewingStudent.qualification}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-sky-500" />
                  <span className="font-semibold text-slate-900">Email:</span>
                  <span>{viewingStudent.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-sky-500" />
                  <span className="font-semibold text-slate-900">Mobile:</span>
                  <span>{viewingStudent.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-sky-500" />
                  <span className="font-semibold text-slate-900">Qualification:</span>
                  <span>{viewingStudent.qualification}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-500" />
                  <span className="font-semibold text-slate-900">Enrollment Date:</span>
                  <span>{viewingStudent.enrollmentDate}</span>
                </div>
                <div className="flex items-start gap-2 pt-1 border-t border-slate-200/60">
                  <MapPin className="w-4 h-4 text-sky-500 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">Address:</span>
                    <p className="text-slate-600 text-[11px] mt-0.5">{viewingStudent.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setViewingStudent(null)}
                className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-sky-500/25 cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-red-600 font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span>Confirm Delete Student</span>
              </div>
              <button
                onClick={() => setDeletingStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-red-50 rounded-2xl border border-red-100 text-red-700 font-medium leading-relaxed">
                Are you sure you want to delete this student record? This action cannot be undone.
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-sky-500 text-white font-bold flex items-center justify-center text-sm">
                  {deletingStudent.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-900 truncate">{deletingStudent.name}</h4>
                  <p className="text-slate-500 text-[11px]">{deletingStudent.email}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteStudent(deletingStudent.id);
                  setDeletingStudent(null);
                }}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-md shadow-red-500/25 cursor-pointer"
              >
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsList;
