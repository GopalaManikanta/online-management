import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCoursesFromAPI, fetchStudentsFromAPI, INITIAL_COURSES, FACULTY_AVATARS, getFacultyAvatar } from '../services/api';
import { toast } from 'react-toastify';

const LMSContext = createContext();

const DEFAULT_INSTRUCTORS = [
  {
    id: 'inst_1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@edusync.com',
    phone: '+1 (555) 234-5678',
    experience: '8 Years',
    specialization: 'React & Frontend Architecture',
    rating: 4.9,
    bio: 'Lead Frontend Architect & former Senior Engineer with 8+ years specializing in React, Next.js, and modern UI performance.',
    avatar: FACULTY_AVATARS[0],
    assignedCourseIds: ['c1', 'c7'],
    createdAt: '2026-01-10',
  },
  {
    id: 'inst_2',
    name: 'Prof. Mike Davis',
    email: 'mike.davis@edusync.com',
    phone: '+1 (555) 345-6789',
    experience: '10 Years',
    specialization: 'Full Stack & Node.js',
    rating: 4.8,
    bio: 'Associate Professor & Full Stack Consultant with a decade of expertise in Node.js, Microservices, and cloud deployments.',
    avatar: FACULTY_AVATARS[1],
    assignedCourseIds: ['c2', 'c3'],
    createdAt: '2026-01-15',
  },
  {
    id: 'inst_3',
    name: 'Alex Turner',
    email: 'alex.turner@edusync.com',
    phone: '+1 (555) 456-7890',
    experience: '6 Years',
    specialization: 'Python & Data Science',
    rating: 4.9,
    bio: 'Data Scientist & Machine Learning Specialist with hands-on experience building AI models, Pandas analytics pipelines, and neural networks.',
    avatar: FACULTY_AVATARS[2],
    assignedCourseIds: ['c5', 'c6'],
    createdAt: '2026-02-01',
  },
  {
    id: 'inst_4',
    name: 'Emily Carter',
    email: 'emily.carter@edusync.com',
    phone: '+1 (555) 567-8901',
    experience: '5 Years',
    specialization: 'UI/UX Design Systems',
    rating: 4.7,
    bio: 'Senior Product Designer crafting enterprise design systems, Figma wireframes, and intuitive user experiences.',
    avatar: FACULTY_AVATARS[3],
    assignedCourseIds: ['c4', 'c8'],
    createdAt: '2026-02-10',
  },
];

const sanitizeCourses = (list) => {
  return list.map((c) => {
    if (c.id === 'c1') return { ...c, instructor: 'Dr. Sarah Johnson' };
    if (c.id === 'c2' || c.id === 'c3') return { ...c, instructor: 'Prof. Mike Davis' };
    if (c.id === 'c4' || c.id === 'c8') return { ...c, instructor: 'Emily Carter' };
    if (c.id === 'c5' || c.id === 'c6') return { ...c, instructor: 'Alex Turner' };
    if (c.id === 'c7') return { ...c, instructor: 'Dr. Sarah Johnson' };
    return c;
  });
};

const sanitizeInstructors = (list) => {
  return list.map((inst, idx) => {
    if (!inst.avatar || inst.avatar.includes('dicebear')) {
      return { ...inst, avatar: FACULTY_AVATARS[idx % FACULTY_AVATARS.length] };
    }
    return inst;
  });
};

export const LMSProvider = ({ children }) => {
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('edusync_courses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = sanitizeCourses(
            parsed.map((c, idx) => ({
              ...c,
              thumbnail: c.thumbnail || INITIAL_COURSES[idx % INITIAL_COURSES.length].thumbnail,
            }))
          );
          localStorage.setItem('edusync_courses', JSON.stringify(sanitized));
          return sanitized;
        }
      } catch (e) {
        console.error('Error parsing courses from local storage', e);
      }
    }
    const sanitized = sanitizeCourses(INITIAL_COURSES);
    localStorage.setItem('edusync_courses', JSON.stringify(sanitized));
    return sanitized;
  });

  const MANIKANTA_STUDENT = {
    id: 's_manikanta',
    name: 'Gopala Manikanta',
    email: 'gopala.manikanta@edusync.com',
    phone: '+91 98765 43210',
    qualification: 'B.Tech Computer Science & Engineering',
    address: 'Hyderabad, India',
    enrollmentDate: '2026-01-10',
    createdAt: new Date().toISOString(),
  };

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('edusync_students');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (!parsed.some((s) => s.name?.toLowerCase().includes('manikanta'))) {
            const updated = [MANIKANTA_STUDENT, ...parsed];
            localStorage.setItem('edusync_students', JSON.stringify(updated));
            return updated;
          }
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing students from local storage', e);
      }
    }
    return [MANIKANTA_STUDENT];
  });

  const [instructors, setInstructors] = useState(() => {
    const saved = localStorage.getItem('edusync_instructors');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = sanitizeInstructors(parsed);
          localStorage.setItem('edusync_instructors', JSON.stringify(sanitized));
          return sanitized;
        }
      } catch (e) {
        console.error('Error parsing instructors from local storage', e);
      }
    }
    const sanitized = sanitizeInstructors(DEFAULT_INSTRUCTORS);
    localStorage.setItem('edusync_instructors', JSON.stringify(sanitized));
    return sanitized;
  });

  const DEFAULT_ENROLLMENTS = [
    {
      id: 'enr_1',
      studentId: 's1',
      studentName: 'Emily Johnson',
      studentEmail: 'emily.johnson@edusync.com',
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
      studentEmail: 'michael.williams@edusync.com',
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
      studentEmail: 'sophia.miller@edusync.com',
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
      studentEmail: 'james.davis@edusync.com',
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
      studentEmail: 'daniel.brown@edusync.com',
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
      studentEmail: 'olivia.garcia@edusync.com',
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
        // Clean out default hardcoded Manikanta enrollments if present
        const cleaned = parsed.filter(
          (e) => !['enr_m1', 'enr_m2', 'enr_m3'].includes(e.id)
        );
        const hasPending = cleaned.some((e) => e.status === 'Pending');
        const hasCancelled = cleaned.some((e) => e.status === 'Cancelled');
        if (Array.isArray(cleaned) && cleaned.length >= 4 && hasPending && hasCancelled) {
          localStorage.setItem('edusync_enrollments', JSON.stringify(cleaned));
          return cleaned;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Course CRUD Functions with Bidirectional Instructor Synchronization
  const addCourse = (courseData) => {
    const instructorName = courseData.instructor?.trim() || 'Dr. Sarah Johnson';

    const newCourse = {
      id: `c_${Date.now()}`,
      thumbnail: courseData.thumbnail || INITIAL_COURSES[courses.length % INITIAL_COURSES.length].thumbnail,
      title: courseData.title,
      instructor: instructorName,
      category: courseData.category || 'React',
      duration: courseData.duration || '6 Weeks',
      level: courseData.level || 'Beginner',
      price: courseData.price ? (courseData.price.startsWith('$') ? courseData.price : `$${courseData.price}`) : '$99',
      description: courseData.description || 'Comprehensive course module.',
      rating: courseData.rating ? Number(courseData.rating) : 5.0,
    };

    const updatedCourses = [newCourse, ...courses];
    setCourses(updatedCourses);

    // Sync with Instructors list
    const existingInstructor = instructors.find(
      (inst) => inst.name.toLowerCase() === instructorName.toLowerCase()
    );

    if (existingInstructor) {
      const updatedInstructors = instructors.map((inst) =>
        inst.id === existingInstructor.id
          ? {
              ...inst,
              assignedCourseIds: Array.from(new Set([...(inst.assignedCourseIds || []), newCourse.id])),
            }
          : inst
      );
      setInstructors(updatedInstructors);
      localStorage.setItem('edusync_instructors', JSON.stringify(updatedInstructors));
    } else {
      // Auto-create new Instructor Profile!
      const newInstructor = {
        id: `inst_${Date.now()}`,
        name: instructorName,
        email: `${instructorName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@edusync.com`,
        phone: '+1 (555) 019-2831',
        experience: '5 Years',
        specialization: `${newCourse.category || 'Software Engineering'} Specialist`,
        rating: 4.8,
        bio: `Lead Faculty & Course Instructor for ${newCourse.title}.`,
        avatar: getFacultyAvatar(instructorName),
        assignedCourseIds: [newCourse.id],
        createdAt: new Date().toISOString().split('T')[0],
      };
      const updatedInstructors = [newInstructor, ...instructors];
      setInstructors(updatedInstructors);
      localStorage.setItem('edusync_instructors', JSON.stringify(updatedInstructors));
      toast.info(`New Faculty member "${instructorName}" added to Instructors directory!`);
    }

    addActivity('New Course Added', `Created course "${newCourse.title}" taught by ${instructorName}`);
    toast.success(`Course "${courseData.title}" created successfully!`);
    return newCourse;
  };

  const updateCourse = (id, updatedData) => {
    const targetCourse = courses.find((c) => c.id === id);
    const oldInstructorName = targetCourse?.instructor;
    const newInstructorName = updatedData.instructor?.trim();

    const updated = courses.map((c) => (c.id === id ? { ...c, ...updatedData } : c));
    setCourses(updated);

    if (newInstructorName && oldInstructorName !== newInstructorName) {
      let updatedInsts = instructors.map((inst) => {
        if (inst.name.toLowerCase() === oldInstructorName?.toLowerCase()) {
          return {
            ...inst,
            assignedCourseIds: (inst.assignedCourseIds || []).filter((cId) => cId !== id),
          };
        }
        return inst;
      });

      const targetInst = updatedInsts.find(
        (inst) => inst.name.toLowerCase() === newInstructorName.toLowerCase()
      );

      if (targetInst) {
        updatedInsts = updatedInsts.map((inst) =>
          inst.id === targetInst.id
            ? {
                ...inst,
                assignedCourseIds: Array.from(new Set([...(inst.assignedCourseIds || []), id])),
              }
            : inst
        );
      } else {
        const newInstructor = {
          id: `inst_${Date.now()}`,
          name: newInstructorName,
          email: `${newInstructorName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@edusync.com`,
          phone: '+1 (555) 019-2831',
          experience: '5 Years',
          specialization: `${updatedData.category || 'Software Engineering'} Specialist`,
          rating: 4.8,
          bio: `Faculty instructor for academic course modules.`,
          avatar: getFacultyAvatar(newInstructorName),
          assignedCourseIds: [id],
          createdAt: new Date().toISOString().split('T')[0],
        };
        updatedInsts = [newInstructor, ...updatedInsts];
        toast.info(`Faculty member "${newInstructorName}" added to Instructors directory!`);
      }

      setInstructors(updatedInsts);
      localStorage.setItem('edusync_instructors', JSON.stringify(updatedInsts));
    }

    addActivity('Course Updated', `Updated course details for "${updatedData.title || targetCourse?.title}"`);
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

  // Instructor CRUD Functions
  const addInstructor = (instructorData) => {
    const avatarUrl =
      instructorData.avatar && !instructorData.avatar.includes('dicebear')
        ? instructorData.avatar
        : getFacultyAvatar(instructorData.name);

    const newInst = {
      id: `inst_${Date.now()}`,
      name: instructorData.name,
      email: instructorData.email,
      phone: instructorData.phone || '+1 (555) 019-2831',
      experience: instructorData.experience || '3 Years',
      specialization: instructorData.specialization || 'Software Engineering',
      rating: Number(instructorData.rating) || 4.8,
      bio: instructorData.bio || 'Experienced academic faculty member.',
      avatar: avatarUrl,
      assignedCourseIds: instructorData.assignedCourseIds || [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newInst, ...instructors];
    setInstructors(updated);
    localStorage.setItem('edusync_instructors', JSON.stringify(updated));
    addActivity('Instructor Added', `Registered faculty member "${newInst.name}"`);
    toast.success(`Instructor "${newInst.name}" registered successfully!`);
    return newInst;
  };

  const updateInstructor = (id, updatedData) => {
    const updated = instructors.map((inst) => (inst.id === id ? { ...inst, ...updatedData } : inst));
    setInstructors(updated);
    localStorage.setItem('edusync_instructors', JSON.stringify(updated));
    addActivity('Instructor Updated', `Updated profile for "${updatedData.name || id}"`);
    toast.success('Instructor details updated successfully!');
  };

  const deleteInstructor = (id) => {
    const target = instructors.find((inst) => inst.id === id);
    const updated = instructors.filter((inst) => inst.id !== id);
    setInstructors(updated);
    localStorage.setItem('edusync_instructors', JSON.stringify(updated));
    addActivity('Instructor Deleted', `Removed faculty member "${target?.name || id}"`);
    toast.info(`Instructor "${target?.name || 'Selected Instructor'}" deleted.`);
  };

  const assignCourseToInstructor = (instructorId, courseIds) => {
    const target = instructors.find((inst) => inst.id === instructorId);
    if (!target) return;

    const updated = instructors.map((inst) =>
      inst.id === instructorId ? { ...inst, assignedCourseIds: courseIds } : inst
    );
    setInstructors(updated);
    localStorage.setItem('edusync_instructors', JSON.stringify(updated));

    // Also update the course's instructor field for any course assigned to this instructor
    const updatedCourses = courses.map((c) => {
      if (courseIds.includes(c.id)) {
        return { ...c, instructor: target.name };
      }
      return c;
    });
    setCourses(updatedCourses);
    localStorage.setItem('edusync_courses', JSON.stringify(updatedCourses));

    addActivity('Courses Assigned', `Assigned course(s) to "${target?.name}"`);
    toast.success(`Courses assigned to "${target?.name || 'Instructor'}" successfully!`);
  };

  const DEFAULT_COURSE_LESSONS = [
    { id: 'l1', title: '01. Course Overview & Environment Setup', duration: '15 mins' },
    { id: 'l2', title: '02. Core Architecture & Fundamental Concepts', duration: '25 mins' },
    { id: 'l3', title: '03. Hands-on Project Initialization & Components', duration: '40 mins' },
    { id: 'l4', title: '04. State Management, Context & Data Flow', duration: '35 mins' },
    { id: 'l5', title: '05. Production Build Deployment & Best Practices', duration: '30 mins' },
  ];

  const toggleLessonCompletion = (enrollmentId, lessonIndex) => {
    const existing = enrollments.find((e) => e.id === enrollmentId);
    if (!existing) return false;

    const initialLessons = existing.lessons || DEFAULT_COURSE_LESSONS.map((l, idx) => ({
      ...l,
      completed: idx < Math.round(((existing.progress || 0) / 100) * DEFAULT_COURSE_LESSONS.length),
    }));

    const updatedLessons = initialLessons.map((l, idx) =>
      idx === lessonIndex ? { ...l, completed: !l.completed } : l
    );

    const completedCount = updatedLessons.filter((l) => l.completed).length;
    const totalCount = updatedLessons.length;
    const newProgress = Math.round((completedCount / totalCount) * 100);
    const newStatus = newProgress === 100 ? 'Completed' : newProgress === 0 ? 'Pending' : 'Active';

    const updatedRecord = {
      ...existing,
      lessons: updatedLessons,
      progress: newProgress,
      status: newStatus,
    };

    const updated = enrollments.map((e) => (e.id === enrollmentId ? updatedRecord : e));
    setEnrollments(updated);
    localStorage.setItem('edusync_enrollments', JSON.stringify(updated));

    toast.success(`Lesson progress updated: ${completedCount}/${totalCount} completed (${newProgress}%)`);
    return true;
  };

  return (
    <LMSContext.Provider
      value={{
        courses,
        students,
        enrollments,
        instructors,
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
        toggleLessonCompletion,
        DEFAULT_COURSE_LESSONS,
        addInstructor,
        updateInstructor,
        deleteInstructor,
        assignCourseToInstructor,
        addActivity,
        stats: {
          totalCourses: courses.length,
          totalStudents: students.length,
          totalInstructors: instructors.length,
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
