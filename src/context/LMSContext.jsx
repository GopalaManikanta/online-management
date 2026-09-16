import React, { createContext, useContext, useState } from 'react';

const LMSContext = createContext();

export const LMSProvider = ({ children }) => {
  const [courses] = useState([]);
  const [students] = useState([]);
  const [instructors] = useState([]);

  return (
    <LMSContext.Provider
      value={{
        courses: [],
        students: [],
        instructors: [],
        stats: {
          totalCourses: 0,
          totalStudents: 0,
          totalInstructors: 0,
          totalEnrollments: 0,
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
