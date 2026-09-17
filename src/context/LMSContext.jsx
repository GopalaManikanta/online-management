import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCoursesFromAPI, fetchStudentsFromAPI, INITIAL_COURSES } from '../services/api';
import { toast } from 'react-toastify';

const LMSContext = createContext();

export const LMSProvider = ({ children }) => {
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('edusync_courses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c, idx) => ({
            ...c,
            thumbnail: c.thumbnail || INITIAL_COURSES[idx % INITIAL_COURSES.length].thumbnail,
          }));
        }
      } catch (e) {
        console.error('Error parsing courses from local storage', e);
      }
    }
    return INITIAL_COURSES;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('edusync_students');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error parsing students from local storage', e);
      }
    }
    return [];
  });

  const DEFAULT_ENROLLMENTS = [
    {
      id: 'enr_1',
      studentId: 's1',
      studentName: 'Emily Johnson',
      studentEmail: 'emily.johnson@x.dummyjson.com',
      studentPhone: '+1 555-0192',
      studentQualification: 'B.Tech CS',
      courseId: 'c1',
      courseTitle: 'React JS Masterclass',
      courseCategory: 'Frontend',
      coursePrice: '$99',
      courseDuration: '6 Weeks',
      enrollmentDate: '2026-03-10',
      status: 'Active',
      progress: 65,
    },
    {
      id: 'enr_2',
      studentId: 's2',
      studentName: 'Michael Williams',
      studentEmail: 'michael.williams@x.dummyjson.com',
      studentPhone: '+1 555-0193',
      studentQualification: 'MCA',
      courseId: 'c2',
      courseTitle: 'Full Stack Web Development',
      courseCategory: 'Fullstack',
      coursePrice: '$149',
      courseDuration: '12 Weeks',
      enrollmentDate: '2026-02-15',
      status: 'Completed',
      progress: 100,
    },
    {
      id: 'enr_3',
      studentId: 's3',
      studentName: 'Sophia Miller',
      studentEmail: 'sophia.miller@x.dummyjson.com',
      studentPhone: '+1 555-0194',
      studentQualification: 'B.Sc IT',
      courseId: 'c3',
      courseTitle: 'Python Programming Masterclass',
      courseCategory: 'Backend',
      coursePrice: '$89',
      courseDuration: '8 Weeks',
      enrollmentDate: '2026-03-14',
      status: 'Pending',
      progress: 10,
    },
    {
      id: 'enr_4',
      studentId: 's4',
      studentName: 'James Davis',
      studentEmail: 'james.davis@x.dummyjson.com',
      studentPhone: '+1 555-0195',
      studentQualification: 'M.Tech',
      courseId: 'c4',
      courseTitle: 'Data Science & Machine Learning',
      courseCategory: 'Data Science',
      coursePrice: '$199',
      courseDuration: '16 Weeks',
      enrollmentDate: '2026-01-20',
      status: 'Cancelled',
      progress: 0,
    },
    {
      id: 'enr_5',
      studentId: 's5',
      studentName: 'Daniel Brown',
      studentEmail: 'daniel.brown@x.dummyjson.com',
      studentPhone: '+1 555-0196',
      studentQualification: 'B.E Electronics',
      courseId: 'c5',
      courseTitle: 'Node.js & Express API Development',
      courseCategory: 'Backend',
      coursePrice: '$119',
      courseDuration: '8 Weeks',
      enrollmentDate: '2026-03-01',
      status: 'Active',
      progress: 45,
    },
    {
      id: 'enr_6',
      studentId: 's6',
      studentName: 'Olivia Garcia',
      studentEmail: 'olivia.garcia@x.dummyjson.com',
      studentPhone: '+1 555-0197',
      studentQualification: 'B.Des UI/UX',
      courseId: 'c6',
      courseTitle: 'UI/UX Design Essentials',
      courseCategory: 'Design',
      coursePrice: '$79',
      courseDuration: '4 Weeks',
      enrollmentDate: '2026-02-01',
      status: 'Completed',
      progress: 100,
    },
  ];

  const [enrollments, setEnrollments] = useState(() => {
    const saved = localStorage.getItem('edusync_enrollments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure saved data has pending & cancelled records, else fallback to full set
        const hasPending = parsed.some((e) => e.status === 'Pending');
        const hasCancelled = parsed.some((e) => e.status === 'Cancelled');
        if (Array.isArray(parsed) && parsed.length >= 4 && hasPending && hasCancelled) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing enrollments from local storage', e);
      }
    }
    localStorage.setItem('edusync_enrollments', JSON.stringify(DEFAULT_ENROLLMENTS));
    return DEFAULT_ENROLLMENTS;
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('edusync_activities');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Error parsing activities', e);
      }
    }
    return [
      {
        id: 'act_1',
        action: 'System Initialized',
        detail: 'Course, Student & Enrollment Modules loaded',
        time: 'Just now',
        date: new Date().toLocaleDateString(),
      },
    ];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial courses from DummyJSON API if empty
  useEffect(() => {
    const loadCourses = async () => {
      if (courses.length === 0) {
        setLoading(true);
        setError(null);
        try {
          const apiCourses = await fetchCoursesFromAPI();
          if (apiCourses && apiCourses.length > 0) {
            setCourses(apiCourses);
            localStorage.setItem('edusync_courses', JSON.stringify(apiCourses));
          }
        } catch (err) {
          console.error(err);
          setError('Failed to fetch courses from API.');
        } finally {
          setLoading(false);
        }
      }
    };
    loadCourses();
  }, []);

  // Fetch initial students from DummyJSON API if empty
  useEffect(() => {
    const loadStudents = async () => {
      const saved = localStorage.getItem('edusync_students');
      if (!saved || students.length === 0) {
        try {
          const apiStudents = await fetchStudentsFromAPI();
          if (apiStudents && apiStudents.length > 0) {
            setStudents(apiStudents);
            localStorage.setItem('edusync_students', JSON.stringify(apiStudents));
          }
        } catch (err) {
          console.error('Failed to fetch students from DummyJSON API', err);
        }
      }
    };
    loadStudents();
  }, []);

  // Ensure default enrollments are seeded if empty or missing statuses
  useEffect(() => {
    const hasPending = enrollments.some((e) => e.status === 'Pending');
    const hasCancelled = enrollments.some((e) => e.status === 'Cancelled');
    if (enrollments.length < 4 || !hasPending || !hasCancelled) {
      setEnrollments(DEFAULT_ENROLLMENTS);
      localStorage.setItem('edusync_enrollments', JSON.stringify(DEFAULT_ENROLLMENTS));
    }
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      localStorage.setItem('edusync_courses', JSON.stringify(courses));
    }
  }, [courses]);

  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem('edusync_students', JSON.stringify(students));
    }
  }, [students]);

  useEffect(() => {
    if (enrollments.length > 0) {
      localStorage.setItem('edusync_enrollments', JSON.stringify(enrollments));
    }
  }, [enrollments]);

  useEffect(() => {
    localStorage.setItem('edusync_activities', JSON.stringify(activities));
  }, [activities]);

  const addActivity = (action, detail) => {
    const newAct = {
      id: `act_${Date.now()}`,
      action,
      detail,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString(),
    };
    setActivities((prev) => [newAct, ...prev].slice(0, 20));
  };

  // Course CRUD Functions
  const addCourse = (courseData) => {
    const newCourse = {
      id: `c_${Date.now()}`,
      thumbnail: courseData.thumbnail || INITIAL_COURSES[courses.length % INITIAL_COURSES.length].thumbnail,
      title: courseData.title,
      instructor: courseData.instructor || 'John Smith',
      category: courseData.category || 'React',
      duration: courseData.duration || '6 Weeks',
      level: courseData.level || 'Beginner',
      price: courseData.price ? (courseData.price.startsWith('$') ? courseData.price : `$${courseData.price}`) : '$99',
      description: courseData.description || 'Comprehensive course module.',
      rating: courseData.rating ? Number(courseData.rating) : 5.0,
    };

    const updated = [newCourse, ...courses];
    setCourses(updated);
    addActivity('New Course Added', `Created course "${newCourse.title}"`);
    toast.success(`Course "${courseData.title}" created successfully!`);
    return newCourse;
  };

  const updateCourse = (id, updatedData) => {
    const updated = courses.map((c) => (c.id === id ? { ...c, ...updatedData } : c));
    setCourses(updated);
    addActivity('Course Updated', `Updated course details`);
    toast.success('Course updated successfully!');
  };

  const deleteCourse = (id) => {
    const target = courses.find((c) => c.id === id);
    const updated = courses.filter((c) => c.id !== id);
    setCourses(updated);
    addActivity('Course Deleted', `Removed course "${target?.title || id}"`);
    toast.info(`Course "${target?.title || 'Selected Course'}" deleted.`);
  };

  // Student CRUD Functions
  const addStudent = (studentData) => {
    const newStudent = {
      id: `s_${Date.now()}`,
      name: studentData.name,
      email: studentData.email,
      phone: studentData.phone,
      address: studentData.address,
      qualification: studentData.qualification,
      enrollmentDate: studentData.enrollmentDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    const updated = [newStudent, ...students];
    setStudents(updated);
    addActivity('New Student Added', `Registered student "${newStudent.name}"`);
    toast.success(`Student "${studentData.name}" added successfully!`);
    return newStudent;
  };

  const updateStudent = (id, updatedData) => {
    const updated = students.map((s) => (s.id === id ? { ...s, ...updatedData } : s));
    setStudents(updated);
    addActivity('Student Updated', `Updated details for student "${updatedData.name || id}"`);
    toast.success('Student details updated successfully!');
  };

  const deleteStudent = (id) => {
    const target = students.find((s) => s.id === id);
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    addActivity('Student Deleted', `Removed student "${target?.name || id}"`);
    toast.info(`Student "${target?.name || 'Selected Student'}" deleted.`);
  };

  // Enrollment Helper Functions
  const isAlreadyEnrolled = (studentId, courseId) => {
    return enrollments.some((e) => e.studentId === studentId && e.courseId === courseId && e.status === 'Active');
  };

  const addEnrollment = ({ studentId, courseId, enrollmentDate, status = 'Active', progress = 10 }) => {
    if (isAlreadyEnrolled(studentId, courseId)) {
      toast.warning('Student is already enrolled in this course!');
      return false;
    }

    const student = students.find((s) => s.id === studentId);
    const course = courses.find((c) => c.id === courseId);

    if (!student || !course) {
      toast.error('Invalid student or course selected.');
      return false;
    }

    const newEnrollment = {
      id: `enr_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      studentPhone: student.phone || '+1 555-0199',
      studentQualification: student.qualification || 'Degree',
      courseId: course.id,
      courseTitle: course.title,
      courseCategory: course.category || 'General',
      coursePrice: course.price || '$99',
      courseDuration: course.duration || '6 Weeks',
      enrollmentDate: enrollmentDate || new Date().toISOString().split('T')[0],
      status: status,
      progress: status === 'Completed' ? 100 : Number(progress) || 15,
    };

    const updated = [newEnrollment, ...enrollments];
    setEnrollments(updated);
    localStorage.setItem('edusync_enrollments', JSON.stringify(updated));
    addActivity('Student Enrolled', `Enrolled "${student.name}" into "${course.title}"`);
    toast.success(`Student "${student.name}" enrolled into "${course.title}"!`);
    return true;
  };

  const removeEnrollment = (id) => {
    const target = enrollments.find((e) => e.id === id);
    const updated = enrollments.filter((e) => e.id !== id);
    setEnrollments(updated);
    localStorage.setItem('edusync_enrollments', JSON.stringify(updated));
    addActivity('Enrollment Removed', `Removed enrollment for "${target?.studentName || id}" in "${target?.courseTitle}"`);
    toast.info(`Enrollment for "${target?.studentName || 'Selected Student'}" removed.`);
  };

  const updateEnrollment = (id, { studentId, courseId, enrollmentDate, status, progress }) => {
    const existing = enrollments.find((e) => e.id === id);
    if (!existing) {
      toast.error('Enrollment record not found.');
      return false;
    }

    // Check if changing to a pair that conflicts with another record
    const isDuplicate = enrollments.some(
      (e) => e.id !== id && e.studentId === studentId && e.courseId === courseId && e.status === 'Active'
    );

    if (isDuplicate) {
      toast.warning('Another active enrollment already exists for this student and course!');
      return false;
    }

    const student = students.find((s) => s.id === studentId) || {
      name: existing.studentName,
      email: existing.studentEmail,
      phone: existing.studentPhone,
      qualification: existing.studentQualification,
    };
    const course = courses.find((c) => c.id === courseId) || {
      title: existing.courseTitle,
      category: existing.courseCategory,
      price: existing.coursePrice,
      duration: existing.courseDuration,
    };

    const updatedStatus = status || existing.status || 'Active';
    const updatedProgress = updatedStatus === 'Completed' ? 100 : (progress !== undefined ? Number(progress) : (existing.progress || 25));

    const updatedRecord = {
      ...existing,
      studentId: studentId || existing.studentId,
      studentName: student.name || existing.studentName,
      studentEmail: student.email || existing.studentEmail,
      studentPhone: student.phone || existing.studentPhone || '+1 555-0199',
      studentQualification: student.qualification || existing.studentQualification || 'Degree',
      courseId: courseId || existing.courseId,
      courseTitle: course.title || existing.courseTitle,
      courseCategory: course.category || existing.courseCategory || 'General',
      coursePrice: course.price || existing.coursePrice || '$99',
      courseDuration: course.duration || existing.courseDuration || '6 Weeks',
      enrollmentDate: enrollmentDate || existing.enrollmentDate,
      status: updatedStatus,
      progress: updatedProgress,
    };

    const updated = enrollments.map((e) => (e.id === id ? updatedRecord : e));
    setEnrollments(updated);
    localStorage.setItem('edusync_enrollments', JSON.stringify(updated));
    addActivity('Enrollment Updated', `Updated enrollment for "${updatedRecord.studentName}" in "${updatedRecord.courseTitle}"`);
    toast.success('Enrollment details updated successfully!');
    return true;
  };

  return (
    <LMSContext.Provider
      value={{
        courses,
        students,
        enrollments,
        instructors: [],
        activities,
        loading,
        error,
        addCourse,
        updateCourse,
        deleteCourse,
        addStudent,
        updateStudent,
        deleteStudent,
        addEnrollment,
        updateEnrollment,
        removeEnrollment,
        isAlreadyEnrolled,
        addActivity,
        stats: {
          totalCourses: courses.length,
          totalStudents: students.length,
          totalInstructors: 0,
          totalEnrollments: enrollments.length,
          completedCourses: enrollments.filter((e) => e.status === 'Completed').length,
          activeEnrollments: enrollments.filter((e) => (e.status || 'Active') === 'Active').length,
          pendingEnrollments: enrollments.filter((e) => e.status === 'Pending').length,
          cancelledEnrollments: enrollments.filter((e) => e.status === 'Cancelled').length,
        },
      }}
    >
      {children}
    </LMSContext.Provider>
  );
};

export const useLMS = () => {
  const context = useContext(LMSContext);
  if (!context) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
};
