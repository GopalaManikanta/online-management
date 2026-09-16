import axios from 'axios';

// Third-party API service using Axios
const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch Live Student Users from Third-Party API
export const fetchLiveStudents = async () => {
  try {
    const res = await api.get('/users?limit=6');
    return res.data.users.map((u) => ({
      id: String(u.id),
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      mobile: u.phone,
      course: u.company?.department || 'React JS Masterclass',
      date: '12 Jan 2025',
      progress: Math.floor(Math.random() * 60) + 40,
      status: Math.random() > 0.3 ? 'In Progress' : 'Completed',
      avatar: u.image,
    }));
  } catch (err) {
    console.warn('Third-party API fetch fallback:', err.message);
    return [];
  }
};

// Fetch Live Course Posts from Third-Party API
export const fetchLiveCourses = async () => {
  try {
    const res = await api.get('/posts?limit=6');
    const categories = ['React', 'JavaScript', 'Node.js', 'UI/UX Design', 'Python', 'Data Science'];
    const instructors = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Emily Carter', 'David Lee', 'Rachel Green'];

    return res.data.posts.map((p, idx) => ({
      id: `c_${p.id}`,
      title: p.title.split(' ').slice(0, 4).join(' ') + ' Masterclass',
      instructor: instructors[idx % instructors.length],
      category: categories[idx % categories.length],
      rating: (4.5 + (idx % 5) * 0.1).toFixed(1),
      reviewsCount: 80 + idx * 15,
      duration: `${6 + (idx % 6)} Weeks`,
      level: idx % 3 === 0 ? 'Beginner' : idx % 3 === 1 ? 'Intermediate' : 'Advanced',
      price: `$${79 + idx * 10}`,
      progress: [75, 100, 45, 30, 90, 60][idx % 6],
      status: idx % 2 === 0 ? 'In Progress' : 'Completed',
      image: `https://images.unsplash.com/photo-${1516321318423 + idx * 1000}?w=600&auto=format&fit=crop&q=80`,
      description: p.body,
    }));
  } catch (err) {
    console.warn('Third-party API fetch fallback:', err.message);
    return [];
  }
};

export default api;
