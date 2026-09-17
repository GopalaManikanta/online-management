import axios from 'axios';

// Third-party API instance configured with Axios
const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const COURSE_IMAGES = [
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80'
];

export const FACULTY_AVATARS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
];

export const getFacultyAvatar = (nameStr = '') => {
  if (!nameStr) return FACULTY_AVATARS[0];
  let sum = 0;
  for (let i = 0; i < nameStr.length; i++) {
    sum += nameStr.charCodeAt(i);
  }
  return FACULTY_AVATARS[sum % FACULTY_AVATARS.length];
};

export const INITIAL_COURSES = [
  {
    id: 'c1',
    thumbnail: COURSE_IMAGES[0],
    title: 'React JS Masterclass',
    instructor: 'Dr. Sarah Johnson',
    category: 'React',
    duration: '6 Weeks',
    level: 'Beginner',
    price: '$99',
    description: 'Learn React.js from scratch and build dynamic, interactive web applications. Covers JSX, state, props, hooks, context API, and routing.',
    rating: 4.8,
  },
  {
    id: 'c2',
    thumbnail: COURSE_IMAGES[1],
    title: 'JavaScript Essentials',
    instructor: 'Prof. Mike Davis',
    category: 'JavaScript',
    duration: '8 Weeks',
    level: 'Intermediate',
    price: '$79',
    description: 'Master core JavaScript concepts including ES6+, async/await, closures, prototypes, DOM manipulation, and modern tooling.',
    rating: 4.6,
  },
  {
    id: 'c3',
    thumbnail: COURSE_IMAGES[2],
    title: 'Node.js Development',
    instructor: 'Prof. Mike Davis',
    category: 'Node.js',
    duration: '6 Weeks',
    level: 'Advanced',
    price: '$89',
    description: 'Build backend RESTful APIs and real-time backend services using Node.js, Express, MongoDB, and authentication protocols.',
    rating: 4.7,
  },
  {
    id: 'c4',
    thumbnail: COURSE_IMAGES[3],
    title: 'UI/UX Design',
    instructor: 'Emily Carter',
    category: 'UI/UX Design',
    duration: '5 Weeks',
    level: 'Intermediate',
    price: '$69',
    description: 'Create gorgeous user interfaces and intuitive user experiences using modern design principles, wireframing, and Figma prototyping.',
    rating: 4.5,
  },
  {
    id: 'c5',
    thumbnail: COURSE_IMAGES[4],
    title: 'Python Programming',
    instructor: 'Alex Turner',
    category: 'Python',
    duration: '10 Weeks',
    level: 'Beginner',
    price: '$109',
    description: 'Comprehensive Python programming course covering fundamentals, OOP, data automation, file handling, and scripting.',
    rating: 4.8,
  },
  {
    id: 'c6',
    thumbnail: COURSE_IMAGES[5],
    title: 'Data Science',
    instructor: 'Alex Turner',
    category: 'Data Science',
    duration: '12 Weeks',
    level: 'Advanced',
    price: '$149',
    description: 'Unlock data-driven insights using Pandas, NumPy, Matplotlib, Scikit-learn, and Machine Learning algorithms.',
    rating: 4.9,
  },
  {
    id: 'c7',
    thumbnail: COURSE_IMAGES[6],
    title: 'Full Stack Web Development',
    instructor: 'Dr. Sarah Johnson',
    category: 'React',
    duration: '14 Weeks',
    level: 'Intermediate',
    price: '$179',
    description: 'End-to-end full stack web development using modern JavaScript frameworks, databases, and cloud deployment.',
    rating: 4.9,
  },
  {
    id: 'c8',
    thumbnail: COURSE_IMAGES[7],
    title: 'Tailwind CSS & Responsive Design',
    instructor: 'Emily Carter',
    category: 'UI/UX Design',
    duration: '4 Weeks',
    level: 'Beginner',
    price: '$59',
    description: 'Learn utility-first styling with Tailwind CSS, responsive breakpoints, and modern frontend layout techniques.',
    rating: 4.7,
  }
];

// Enterprise External Course API Fetch Service
export const fetchCoursesFromAPI = async () => {
  try {
    const response = await api.get('/posts?limit=8');
    const categories = ['React', 'JavaScript', 'Node.js', 'UI/UX Design', 'Python', 'Data Science'];
    const instructors = ['Dr. Sarah Johnson', 'Prof. Mike Davis', 'Alex Turner', 'Emily Carter'];

    if (response.data && response.data.posts) {
      return response.data.posts.map((post, idx) => ({
        id: `api_${post.id}`,
        thumbnail: COURSE_IMAGES[idx % COURSE_IMAGES.length],
        title: INITIAL_COURSES[idx % INITIAL_COURSES.length].title,
        instructor: instructors[idx % instructors.length],
        category: categories[idx % categories.length],
        duration: `${6 + (idx % 6)} Weeks`,
        level: idx % 3 === 0 ? 'Beginner' : idx % 3 === 1 ? 'Intermediate' : 'Advanced',
        price: `$${69 + idx * 15}`,
        description: post.body.length > 80 ? post.body : INITIAL_COURSES[idx % INITIAL_COURSES.length].description,
        rating: Number((4.5 + (idx % 5) * 0.1).toFixed(1)),
      }));
    }
    return INITIAL_COURSES;
  } catch (error) {
    console.warn('Axios API fallback to initial courses:', error.message);
    return INITIAL_COURSES;
  }
};

// Enterprise Student Data Integration Service
export const fetchStudentsFromAPI = async () => {
  try {
    const response = await api.get('/users?limit=10');
    const qualifications = ['B.Tech / B.E.', 'MCA / M.Sc', 'Degree (B.Sc / B.Com / B.A)', 'Diploma', 'M.Tech / Ph.D'];

    if (response.data && response.data.users && response.data.users.length > 0) {
      return response.data.users.map((u, idx) => {
        const rawPhone = (u.phone || '').replace(/[^0-9]/g, '');
        const phone = rawPhone.length >= 10 ? rawPhone.slice(0, 10) : `987654321${idx % 10}`;
        const addressStr = u.address
          ? `${u.address.address}, ${u.address.city}, ${u.address.state}`
          : 'Jubilee Hills, Hyderabad, Telangana';

        return {
          id: `stu_ext_${u.id}`,
          name: `${u.firstName} ${u.lastName}`,
          email: `${u.firstName.toLowerCase()}.${u.lastName.toLowerCase()}@edusync.com`,
          phone: phone,
          address: addressStr,
          qualification: u.university || qualifications[idx % qualifications.length],
          enrollmentDate: `2026-0${(idx % 3) + 1}-15`,
          createdAt: new Date().toISOString(),
        };
      });
    }
    return [];
  } catch (error) {
    console.warn('Axios API fallback for students:', error.message);
    return [];
  }
};

export default api;
