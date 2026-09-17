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
        detail: 'Course & Student Management Modules loaded',
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

  return (
    <LMSContext.Provider
      value={{
        courses,
        students,
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
        addActivity,
        stats: {
          totalCourses: courses.length,
          totalStudents: students.length,
          totalInstructors: 0,
          totalEnrollments: students.length,
          completedCourses: 0,
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
