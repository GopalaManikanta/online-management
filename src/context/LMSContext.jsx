import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCoursesFromAPI, fetchStudentsFromAPI, INITIAL_COURSES, FACULTY_AVATARS, getFacultyAvatar } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

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

const DEFAULT_ASSIGNMENTS = [
  {
    id: 'asg_1',
    courseId: 'c1',
    courseTitle: 'React JS Masterclass',
    title: 'Custom Hooks & State Management Project',
    instructions: 'Build a custom React hook useFetchWithCache and implement a dashboard component using React Context and useReducer. Submit your GitHub repository URL along with a live demo link.',
    solutionText: 'Official Reference Solution:\n1. Implement custom useFetchWithCache hook with cache Map & error state.\n2. Create React Context Provider supplying state & dispatch.\n3. Use useReducer to handle ACTIONS: FETCH_START, FETCH_SUCCESS, FETCH_ERROR.',
    solutionLink: 'https://github.com/edusync-official/react-custom-hooks-solution',
    dueDate: '2026-09-25',
    totalMarks: 100,
    status: 'Pending',
    submittedAt: null,
    submissionText: '',
    submissionLink: '',
    obtainedMarks: null,
    gradePercentage: null,
    feedback: '',
    createdAt: '2026-09-01',
  },
  {
    id: 'asg_2',
    courseId: 'c2',
    courseTitle: 'JavaScript Essentials',
    title: 'Async/Await & Fetch API Weather Dashboard',
    instructions: 'Create an interactive Weather Application utilizing OpenWeatherMap API with Async/Await, Promises, and ES6 Modules. Must handle network timeout errors and display dynamic forecast cards.',
    solutionText: 'Official Reference Solution:\n1. Async/await fetch calls with try...catch error boundaries.\n2. ES6 modular architecture separating API service from DOM renderer.\n3. Dynamic forecast card templates generated via Array.map().',
    solutionLink: 'https://github.com/edusync-official/js-weather-dashboard-solution',
    dueDate: '2026-09-28',
    totalMarks: 100,
    status: 'Pending',
    submittedAt: null,
    submissionText: '',
    submissionLink: '',
    obtainedMarks: null,
    gradePercentage: null,
    feedback: '',
    createdAt: '2026-09-05',
  },
  {
    id: 'asg_3',
    courseId: 'c3',
    courseTitle: 'Node.js Development',
    title: 'RESTful API with JWT Auth & Express Middleware',
    instructions: 'Develop a secure Node.js REST API using Express.js and MongoDB. Include user registration, password hashing with bcrypt, JWT authentication middleware, and input validation.',
    solutionText: 'Official Reference Solution:\n1. Express middleware auth.js parsing Bearer JWT tokens.\n2. Password hashing with bcryptjs (salt rounds: 10).\n3. Express validator middleware validating email format & minimum password length.',
    solutionLink: 'https://github.com/edusync-official/node-express-jwt-solution',
    dueDate: '2026-09-17',
    totalMarks: 100,
    status: 'Pending',
    submittedAt: null,
    submissionText: '',
    submissionLink: '',
    obtainedMarks: null,
    gradePercentage: null,
    feedback: '',
    createdAt: '2026-09-08',
  },
  {
    id: 'asg_4',
    courseId: 'c4',
    courseTitle: 'UI/UX Design',
    title: 'Mobile Banking App High-Fidelity Prototype',
    studentId: 's6',
    studentName: 'Olivia Garcia',
    studentEmail: 'olivia.garcia@edusync.com',
    instructions: 'Design a responsive mobile banking user interface in Figma with auto-layout, interactive transitions, dark/light theme tokens, and accessibility testing guidelines.',
    solutionText: 'Official Reference Solution:\n1. Figma Auto-Layout frames with 8px grid baseline.\n2. Design token color palette (Primary Sky #0284c7, Slate #0f172a).\n3. Smart Animate prototype transitions for send money flows.',
    solutionLink: 'https://figma.com/file/edusync-official-banking-solution',
    dueDate: '2026-09-10',
    totalMarks: 100,
    status: 'Graded',
    submittedAt: '2026-09-09 18:45',
    submissionText: 'Figma prototype link attached with full component library tokens.',
    submissionLink: 'https://figma.com/file/sample-banking-ui',
    obtainedMarks: 98,
    gradePercentage: 98,
    feedback: 'Outstanding UI design system! Micro-interactions and typography scale are top-notch.',
    createdAt: '2026-08-25',
  },
  {
    id: 'asg_5',
    courseId: 'c5',
    courseTitle: 'Python Programming',
    title: 'Data Cleaning & Exploratory Data Analysis (EDA)',
    instructions: 'Analyze the provided sales dataset using Pandas and NumPy. Generate distribution plots using Seaborn/Matplotlib and summarize key statistical insights in a Jupyter Notebook.',
    solutionText: 'Official Reference Solution:\n1. df.dropna() & df.fillna() handling null values.\n2. Seaborn distplot & heatmap visualization of sales correlation.\n3. Exporting clean statistical summary dataframe to CSV.',
    solutionLink: 'https://github.com/edusync-official/python-eda-solution',
    dueDate: '2026-10-05',
    totalMarks: 100,
    status: 'Pending',
    submittedAt: null,
    submissionText: '',
    submissionLink: '',
    obtainedMarks: null,
    gradePercentage: null,
    feedback: '',
    createdAt: '2026-09-12',
  },
  {
    id: 'asg_6',
    courseId: 'c6',
    courseTitle: 'Data Science',
    title: 'Machine Learning Customer Churn Classifier',
    instructions: 'Build a Python classification pipeline using Scikit-Learn to predict customer churn. Submit your code repo & model accuracy metrics report.',
    solutionText: 'Official Reference Solution:\n1. StandardScaler() feature normalization pipeline.\n2. RandomForestClassifier(n_estimators=100) training.\n3. Classification report evaluation achieving >88% test accuracy.',
    solutionLink: 'https://github.com/edusync-official/ml-churn-classifier-solution',
    dueDate: '2026-10-10',
    totalMarks: 100,
    status: 'Pending',
    submittedAt: null,
    submissionText: '',
    submissionLink: '',
    obtainedMarks: null,
    gradePercentage: null,
    feedback: '',
    createdAt: '2026-09-14',
  },
  {
    id: 'asg_7',
    courseId: 'c2',
    courseTitle: 'Full Stack Web Development',
    title: 'E-Commerce Full Stack Web Application Capstone',
    studentId: 's2',
    studentName: 'Michael Williams',
    studentEmail: 'michael.williams@edusync.com',
    instructions: 'Build a full stack MERN app featuring product catalog, shopping cart state, JWT authentication, and checkout simulation.',
    solutionText: 'Official Reference Solution:\n1. MERN architecture with Express API & React Context frontend.\n2. Redux / Context cart state persistence.\n3. Stripe API payment intent webhook simulation.',
    solutionLink: 'https://github.com/edusync-official/fullstack-mern-ecommerce-solution',
    dueDate: '2026-10-15',
    totalMarks: 100,
    status: 'Submitted',
    submittedAt: '2026-09-18 10:15',
    submissionText: 'Full stack MERN e-commerce application repo with Stripe checkout simulation submitted.',
    submissionLink: 'https://github.com/michael/fullstack-mern-ecommerce',
    obtainedMarks: 91,
    gradePercentage: 91,
    feedback: 'Great MERN stack architecture! Clean database models and JWT middleware.',
    createdAt: '2026-09-14',
  },
  {
    id: 'asg_8',
    courseId: 'c8',
    courseTitle: 'Tailwind CSS & Responsive Design',
    title: 'Responsive SaaS Analytics Dashboard UI',
    instructions: 'Design a fully responsive dashboard using Tailwind CSS utility classes, flexbox/grid, and dark mode toggling.',
    solutionText: 'Official Reference Solution:\n1. Tailwind CSS grid-cols-1 md:grid-cols-4 layout grid.\n2. Dark mode toggling using `dark:` variant classes.\n3. Responsive collapsible mobile navigation drawer.',
    solutionLink: 'https://github.com/edusync-official/tailwind-saas-dashboard-solution',
    dueDate: '2026-10-08',
    totalMarks: 100,
    status: 'Pending',
    submittedAt: null,
    submissionText: '',
    submissionLink: '',
    obtainedMarks: null,
    gradePercentage: null,
    feedback: '',
    createdAt: '2026-09-14',
  },
];

const DEFAULT_QUIZZES = [
  {
    id: 'quiz_1',
    courseId: 'c1',
    courseTitle: 'React JS Masterclass',
    title: 'React Fundamentals & Virtual DOM Quiz',
    instructions: 'Answer all 5 multiple choice questions within 10 minutes. Ensure a minimum score of 70% to pass this module assessment.',
    durationMinutes: 10,
    totalMarks: 50,
    passMarks: 35,
    dueDate: '2026-09-30',
    status: 'Completed',
    userAttempt: {
      attemptedAt: '2026-09-14 11:20',
      score: 45,
      maxScore: 50,
      percentage: 90,
      passed: true,
      userAnswers: { 0: 1, 1: 0, 2: 2, 3: 1, 4: 0 },
    },
    questions: [
      {
        id: 'q1',
        question: 'Which Hook is used to perform side effects in React function components?',
        options: ['useSideEffect', 'useEffect', 'useState', 'useRef'],
        correctAnswer: 1,
        explanation: '`useEffect` lets you synchronize a component with external systems and run side effects after rendering.',
      },
      {
        id: 'q2',
        question: 'What is the key purpose of React Virtual DOM?',
        options: [
          'To directly manipulate browser DOM nodes faster',
          'To minimize real DOM manipulation by computing UI diffs in memory',
          'To replace HTML CSS stylesheets in modern web browsers',
          'To compile JavaScript directly into C++ code',
        ],
        correctAnswer: 1,
        explanation: 'Virtual DOM keeps a lightweight representation of the UI in memory and batches updates to real DOM efficiently.',
      },
      {
        id: 'q3',
        question: 'In React, what happens when a component state changes via setState?',
        options: [
          'The browser page reloads completely',
          'Only the CSS styles are updated automatically',
          'The component and its children schedule a re-render',
          'The parent component is deleted from memory',
        ],
        correctAnswer: 2,
        explanation: 'State changes trigger a re-render cycle for that component tree.',
      },
      {
        id: 'q4',
        question: 'What prop must be provided when rendering lists of elements in React?',
        options: ['id', 'key', 'index', 'ref'],
        correctAnswer: 1,
        explanation: 'Unique `key` props help React identify which items have changed, been added, or removed.',
      },
      {
        id: 'q5',
        question: 'Which built-in hook allows passing data down component tree without prop drilling?',
        options: ['useContext', 'useProp', 'useTree', 'useStore'],
        correctAnswer: 0,
        explanation: '`useContext` subscribes to React Context values provided by parent Context.Provider.',
      },
    ],
    createdAt: '2026-09-01',
  },
  {
    id: 'quiz_2',
    courseId: 'c2',
    courseTitle: 'JavaScript Essentials',
    title: 'ES6+ Features & Promises Assessment',
    instructions: '15-minute timed quiz covering ES6 destructuring, arrow functions, promises, and async/await syntax.',
    durationMinutes: 15,
    totalMarks: 50,
    passMarks: 35,
    dueDate: '2026-09-24',
    status: 'Available',
    userAttempt: null,
    questions: [
      {
        id: 'q1',
        question: 'Which keyword declares a block-scoped variable that cannot be re-assigned?',
        options: ['var', 'let', 'const', 'global'],
        correctAnswer: 2,
        explanation: '`const` variables are block-scoped and cannot be reassigned once defined.',
      },
      {
        id: 'q2',
        question: 'What will `Promise.all([p1, p2])` do if one promise rejects?',
        options: [
          'It immediately rejects with the error of that promise',
          'It waits for all promises to settle regardless of errors',
          'It retries the rejected promise 3 times automatically',
          'It converts the rejected error into a string null',
        ],
        correctAnswer: 0,
        explanation: '`Promise.all` fails fast and rejects immediately upon the first rejected promise.',
      },
      {
        id: 'q3',
        question: 'What is the output of `typeof NaN` in JavaScript?',
        options: ['"nan"', '"undefined"', '"number"', '"object"'],
        correctAnswer: 2,
        explanation: 'In JavaScript, `NaN` (Not-a-Number) is technically of type `"number"`.',
      },
      {
        id: 'q4',
        question: 'Which method creates a new array populated with the results of calling a function on every element?',
        options: ['forEach()', 'map()', 'filter()', 'reduce()'],
        correctAnswer: 1,
        explanation: '`Array.prototype.map()` creates a new array with transformer function outputs.',
      },
      {
        id: 'q5',
        question: 'What does the spread syntax (`...`) do when passed to an array literal?',
        options: [
          'Deletes duplicate elements in array',
          'Expands array elements into individual elements',
          'Converts array into a JSON string',
          'Reverses array order',
        ],
        correctAnswer: 1,
        explanation: 'Spread operator expands iterable elements in place.',
      },
    ],
    createdAt: '2026-09-05',
  },
  {
    id: 'quiz_3',
    courseId: 'c3',
    courseTitle: 'Node.js Development',
    title: 'Express Routing & Middleware Knowledge Check',
    instructions: 'Test your understanding of Express middleware chain, status codes, and HTTP request object params.',
    durationMinutes: 10,
    totalMarks: 50,
    passMarks: 35,
    dueDate: '2026-09-22',
    status: 'Available',
    userAttempt: null,
    questions: [
      {
        id: 'q1',
        question: 'What parameter must be called inside Express middleware to pass control to the next handler?',
        options: ['continue()', 'next()', 'send()', 'forward()'],
        correctAnswer: 1,
        explanation: 'Calling `next()` passes control to the next middleware function in the stack.',
      },
      {
        id: 'q2',
        question: 'Which HTTP status code indicates a successful resource creation (e.g., POST request)?',
        options: ['200 OK', '201 Created', '204 No Content', '304 Not Modified'],
        correctAnswer: 1,
        explanation: 'HTTP 201 Created indicates the request succeeded and led to creation of a resource.',
      },
      {
        id: 'q3',
        question: 'How do you extract URL route parameters like `/users/:id` in Express?',
        options: ['req.query.id', 'req.params.id', 'req.body.id', 'req.headers.id'],
        correctAnswer: 1,
        explanation: '`req.params` contains route parameters defined in path segments.',
      },
      {
        id: 'q4',
        question: 'Which built-in Express middleware parses incoming JSON payloads?',
        options: ['express.json()', 'express.parse()', 'express.body()', 'express.urlencoded()'],
        correctAnswer: 0,
        explanation: '`express.json()` parses incoming JSON payload requests into `req.body`.',
      },
      {
        id: 'q5',
        question: 'What is Node.js Event Loop primarily responsible for?',
        options: [
          'Executing synchronous multi-threaded C++ tasks in parallel',
          'Handling non-blocking asynchronous I/O operations on a single thread',
          'Compiling HTML templates before sending to browser',
          'Managing CSS grid layouts',
        ],
        correctAnswer: 1,
        explanation: 'The Event Loop handles asynchronous non-blocking I/O callbacks efficiently.',
      },
    ],
    createdAt: '2026-09-10',
  },
  {
    id: 'quiz_4',
    courseId: 'c4',
    courseTitle: 'UI/UX Design',
    title: 'UI Design Principles & Figma Prototyping Quiz',
    instructions: '10-minute quiz on visual hierarchy, typography scales, Figma components, and accessibility color contrast.',
    durationMinutes: 10,
    totalMarks: 50,
    passMarks: 35,
    dueDate: '2026-09-25',
    status: 'Available',
    userAttempt: null,
    questions: [
      {
        id: 'q1',
        question: 'What is the recommended minimum contrast ratio for normal text according to WCAG 2.1 AA guidelines?',
        options: ['2:1', '3:1', '4.5:1', '7:1'],
        correctAnswer: 2,
        explanation: 'WCAG AA requires at least 4.5:1 contrast for standard text.',
      },
      {
        id: 'q2',
        question: 'In Figma, what feature creates dynamic responsive frames that adjust spacing automatically?',
        options: ['Smart Animate', 'Auto Layout', 'Component Sets', 'Variants'],
        correctAnswer: 1,
        explanation: 'Auto Layout allows elements to adjust size and padding dynamically based on content.',
      },
      {
        id: 'q3',
        question: 'What is the primary goal of wireframing in UI/UX design?',
        options: ['Adding high-res images', 'Establishing structural layout and information architecture', 'Creating final CSS styles', 'Writing backend API routes'],
        correctAnswer: 1,
        explanation: 'Wireframes define layout structure before visual polish.',
      },
      {
        id: 'q4',
        question: 'Which visual hierarchy principle uses whitespace to separate or group elements?',
        options: ['Proximity', 'Symmetry', 'Saturating', 'Gradient'],
        correctAnswer: 0,
        explanation: 'The Law of Proximity states objects close to each other tend to be perceived as a group.',
      },
      {
        id: 'q5',
        question: 'What does a Design System token represent?',
        options: ['A database primary key', 'A re-usable design value such as color, typography, or spacing', 'A paid subscription token', 'A user session cookie'],
        correctAnswer: 1,
        explanation: 'Design tokens store design decisions like hex colors and font sizes.',
      },
    ],
    createdAt: '2026-09-11',
  },
  {
    id: 'quiz_5',
    courseId: 'c5',
    courseTitle: 'Python Programming',
    title: 'Python OOP & Data Structures Quiz',
    instructions: 'Test your understanding of Python lists, dictionaries, classes, methods, and decorators.',
    durationMinutes: 10,
    totalMarks: 50,
    passMarks: 35,
    dueDate: '2026-09-28',
    status: 'Available',
    userAttempt: null,
    questions: [
      {
        id: 'q1',
        question: 'Which method is the constructor in Python class definitions?',
        options: ['__create__()', '__init__()', 'construct()', 'main()'],
        correctAnswer: 1,
        explanation: '`__init__` acts as the initializer/constructor method for Python classes.',
      },
      {
        id: 'q2',
        question: 'Which Python data structure is immutable (cannot be modified after creation)?',
        options: ['List', 'Dictionary', 'Tuple', 'Set'],
        correctAnswer: 2,
        explanation: 'Tuples are immutable sequence types in Python.',
      },
      {
        id: 'q3',
        question: 'What will `len({"a": 1, "b": 2})` return in Python?',
        options: ['1', '2', '4', '0'],
        correctAnswer: 1,
        explanation: '`len()` on a dictionary returns the total number of key-value pairs.',
      },
      {
        id: 'q4',
        question: 'What keyword handles exceptions in Python try blocks?',
        options: ['catch', 'except', 'error', 'handle'],
        correctAnswer: 1,
        explanation: 'Python uses `try ... except` blocks for exception handling.',
      },
      {
        id: 'q5',
        question: 'What does list comprehension `[x*2 for x in range(3)]` generate?',
        options: ['[0, 2, 4]', '[1, 2, 3]', '[2, 4, 6]', '[0, 1, 2]'],
        correctAnswer: 0,
        explanation: '`range(3)` produces `0, 1, 2`. Doubling yields `[0, 2, 4]`.',
      },
    ],
    createdAt: '2026-09-12',
  },
  {
    id: 'quiz_6',
    courseId: 'c6',
    courseTitle: 'Data Science',
    title: 'Data Science & Analytics Quiz',
    instructions: '10-minute quiz on Pandas DataFrame, NumPy matrix operations, Matplotlib, and Scikit-Learn.',
    durationMinutes: 10,
    totalMarks: 50,
    passMarks: 35,
    dueDate: '2026-09-29',
    status: 'Available',
    userAttempt: null,
    questions: [
      {
        id: 'q1',
        question: 'Which library is primarily used for tabular data manipulation in Python?',
        options: ['Pandas', 'Flask', 'Django', 'PyGame'],
        correctAnswer: 0,
        explanation: 'Pandas provides high-performance DataFrame data structures.',
      },
      {
        id: 'q2',
        question: 'What does Scikit-Learn function `train_test_split()` do?',
        options: ['Merges two CSV files', 'Splits dataset into training and testing subsets', 'Removes null values', 'Plots a bar chart'],
        correctAnswer: 1,
        explanation: '`train_test_split` partitions data to evaluate model generalization.',
      },
      {
        id: 'q3',
        question: 'Which metric measures the percentage of correct predictions in a classification model?',
        options: ['Mean Squared Error', 'Accuracy', 'R-Squared', 'Variance'],
        correctAnswer: 1,
        explanation: 'Accuracy measures correctly predicted samples over total samples.',
      },
      {
        id: 'q4',
        question: 'In NumPy, what is the output of `np.zeros((2, 3))`?',
        options: ['A 2x3 matrix filled with 0s', 'A 3x2 matrix filled with 1s', 'A 1D array of 6 ones', 'An empty tuple'],
        correctAnswer: 0,
        explanation: '`np.zeros((rows, cols))` creates a zero-filled array of shape (2,3).',
      },
      {
        id: 'q5',
        question: 'Which Machine Learning algorithm is supervised and used for classification?',
        options: ['K-Means Clustering', 'Random Forest Classifier', 'DBSCAN', 'PCA'],
        correctAnswer: 1,
        explanation: 'Random Forest is an ensemble supervised classification algorithm.',
      },
    ],
    createdAt: '2026-09-13',
  },
  {
    id: 'quiz_7',
    courseId: 'c7',
    courseTitle: 'Full Stack Web Development',
    title: 'Full Stack Architecture & Cloud Deployment Quiz',
    instructions: 'Assessment on full stack integration, RESTful endpoints, environment variables, and web security.',
    durationMinutes: 10,
    totalMarks: 50,
    passMarks: 35,
    dueDate: '2026-09-30',
    status: 'Available',
    userAttempt: null,
    questions: [
      {
        id: 'q1',
        question: 'What header is typically used to send JWT tokens in HTTP API calls?',
        options: ['Authorization: Bearer <token>', 'Token: <token>', 'Cookie: <token>', 'Content-Type: token'],
        correctAnswer: 0,
        explanation: 'Standard Bearer authentication uses `Authorization: Bearer <token>`.',
      },
      {
        id: 'q2',
        question: 'What is CORS in web application development?',
        options: ['Cross-Origin Resource Sharing security mechanism', 'Compiled Object Reference System', 'Cloud Operations Routing Server', 'Central Database Protocol'],
        correctAnswer: 0,
        explanation: 'CORS allows browsers to restrict or grant cross-domain HTTP requests.',
      },
      {
        id: 'q3',
        question: 'Which HTTP method is idempotent and used to completely replace an existing resource?',
        options: ['POST', 'PUT', 'PATCH', 'DELETE'],
        correctAnswer: 1,
        explanation: '`PUT` requests are idempotent and update/replace target resource state completely.',
      },
      {
        id: 'q4',
        question: 'Where should sensitive secret keys like database URIs be stored in production?',
        options: ['In public Git repositories', 'In environment variables (.env)', 'Hardcoded in client HTML', 'In browser localStorage'],
        correctAnswer: 1,
        explanation: 'Environment variables keep secret credentials out of codebase history.',
      },
      {
        id: 'q5',
        question: 'What component sits between client browser requests and backend service instances to distribute load?',
        options: ['Load Balancer', 'Database Index', 'Linter', 'Transpiler'],
        correctAnswer: 0,
        explanation: 'Load balancers distribute traffic across multiple app instances.',
      },
    ],
    createdAt: '2026-09-14',
  },
  {
    id: 'quiz_8',
    courseId: 'c8',
    courseTitle: 'Tailwind CSS & Responsive Design',
    title: 'Tailwind Utility Classes & Responsive Breakpoints Quiz',
    instructions: 'Quiz covering Tailwind CSS layout utilities, flexbox, CSS grid, and responsive modifiers.',
    durationMinutes: 10,
    totalMarks: 50,
    passMarks: 35,
    dueDate: '2026-09-30',
    status: 'Available',
    userAttempt: null,
    questions: [
      {
        id: 'q1',
        question: 'Which Tailwind breakpoint modifier applies styles at screen width 768px and above?',
        options: ['sm:', 'md:', 'lg:', 'xl:'],
        correctAnswer: 1,
        explanation: '`md:` corresponds to `min-width: 768px` in default Tailwind CSS configuration.',
      },
      {
        id: 'q2',
        question: 'How do you create a flex container with items centered vertically in Tailwind?',
        options: ['flex items-center', 'flex justify-center', 'flex content-center', 'block align-center'],
        correctAnswer: 0,
        explanation: '`flex items-center` sets `display: flex; align-items: center;`.',
      },
      {
        id: 'q3',
        question: 'Which class applies rounded corners of 1.5rem (24px) in Tailwind CSS?',
        options: ['rounded-sm', 'rounded-lg', 'rounded-3xl', 'rounded-full'],
        correctAnswer: 2,
        explanation: '`rounded-3xl` sets `border-radius: 1.5rem`.',
      },
      {
        id: 'q4',
        question: 'How do you add a drop shadow effect to a button in Tailwind?',
        options: ['shadow-md', 'elevation-5', 'border-shadow', 'box-glow'],
        correctAnswer: 0,
        explanation: 'Tailwind provides shadow utilities like `shadow-xs`, `shadow-md`, `shadow-xl`.',
      },
      {
        id: 'q5',
        question: 'What prefix enables dark mode styling in Tailwind CSS?',
        options: ['dark:', 'theme-dark:', 'night:', 'black:'],
        correctAnswer: 0,
        explanation: '`dark:` variant applies styles when dark mode is enabled.',
      },
    ],
    createdAt: '2026-09-14',
  },
];

const DEFAULT_LIVE_CLASSES = [
  {
    id: 'lc_1',
    courseId: 'c1',
    courseTitle: 'React JS Masterclass',
    topic: 'React 19 Server Components & Concurrent Features',
    instructor: 'Dr. Sarah Johnson',
    date: 'Today',
    time: '04:00 PM - 05:30 PM',
    durationMinutes: 90,
    status: 'Live Now',
    joinUrl: 'https://meet.google.com/edusync-react-live',
    platform: 'Google Meet',
    attendeesCount: 28,
  },
  {
    id: 'lc_2',
    courseId: 'c3',
    courseTitle: 'Node.js Development',
    topic: 'Building Scalable Microservices with Express & Redis Caching',
    instructor: 'Prof. Mike Davis',
    date: 'Tomorrow',
    time: '10:00 AM - 11:30 AM',
    durationMinutes: 90,
    status: 'Upcoming',
    joinUrl: 'https://zoom.us/j/edusync-node-microservices',
    platform: 'Zoom Video',
    attendeesCount: 35,
  },
  {
    id: 'lc_3',
    courseId: 'c4',
    courseTitle: 'UI/UX Design',
    topic: 'Figma Enterprise Design Systems & Token Migration',
    instructor: 'Emily Carter',
    date: 'Sep 24, 2026',
    time: '02:00 PM - 03:30 PM',
    durationMinutes: 90,
    status: 'Upcoming',
    joinUrl: 'https://meet.google.com/edusync-figma-live',
    platform: 'Google Meet',
    attendeesCount: 22,
  },
  {
    id: 'lc_4',
    courseId: 'c6',
    courseTitle: 'Data Science',
    topic: 'Python Scikit-Learn Model Deployment & API Pipelines',
    instructor: 'Alex Turner',
    date: 'Sep 25, 2026',
    time: '05:00 PM - 06:30 PM',
    durationMinutes: 90,
    status: 'Upcoming',
    joinUrl: 'https://zoom.us/j/edusync-ml-live',
    platform: 'Zoom Video',
    attendeesCount: 40,
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
  const { user } = useAuth();
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

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('edusync_assignments');
    let list = DEFAULT_ASSIGNMENTS;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed;
        }
      } catch (e) {
        console.error('Error parsing assignments from local storage', e);
      }
    }
    const missing = DEFAULT_ASSIGNMENTS.filter(
      (d) => !list.some((a) => a.courseId === d.courseId || a.id === d.id)
    );
    const merged = [...list, ...missing].map((asg) => {
      if (asg.id === 'asg_7') {
        return {
          ...asg,
          studentId: 's2',
          studentName: 'Michael Williams',
          studentEmail: 'michael.williams@edusync.com',
          status: 'Submitted',
          submittedAt: asg.submittedAt || '2026-09-18 10:15',
          submissionText: asg.submissionText || 'Full stack MERN e-commerce application repo with Stripe checkout simulation submitted.',
          submissionLink: asg.submissionLink || 'https://github.com/michael/fullstack-mern-ecommerce',
          obtainedMarks: asg.obtainedMarks || 91,
          gradePercentage: asg.gradePercentage || 91,
        };
      }
      return asg;
    });
    localStorage.setItem('edusync_assignments', JSON.stringify(merged));
    return merged;
  });

  const [quizzes, setQuizzes] = useState(() => {
    const saved = localStorage.getItem('edusync_quizzes');
    let list = DEFAULT_QUIZZES;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed;
        }
      } catch (e) {
        console.error('Error parsing quizzes from local storage', e);
      }
    }
    const missing = DEFAULT_QUIZZES.filter(
      (d) => !list.some((q) => q.courseId === d.courseId || q.id === d.id)
    );
    const merged = [...list, ...missing];
    localStorage.setItem('edusync_quizzes', JSON.stringify(merged));
    return merged;
  });

  const [liveClasses, setLiveClasses] = useState(() => {
    const saved = localStorage.getItem('edusync_live_classes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error parsing live classes from local storage', e);
      }
    }
    localStorage.setItem('edusync_live_classes', JSON.stringify(DEFAULT_LIVE_CLASSES));
    return DEFAULT_LIVE_CLASSES;
  });

  useEffect(() => {
    localStorage.setItem('edusync_live_classes', JSON.stringify(liveClasses));
  }, [liveClasses]);

  const scheduleLiveClass = (newClass) => {
    const created = {
      id: `lc_${Date.now()}`,
      status: 'Upcoming',
      attendeesCount: 0,
      joinUrl: newClass.joinUrl || 'https://meet.google.com/edusync-live-session',
      platform: newClass.platform || 'Google Meet',
      date: newClass.date || 'Today',
      time: newClass.time || '06:00 PM - 07:00 PM',
      durationMinutes: newClass.durationMinutes || 60,
      ...newClass,
    };
    setLiveClasses((prev) => [created, ...prev]);
    toast.success(`Live class "${created.topic}" scheduled successfully!`);
    return created;
  };

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

  useEffect(() => {
    if (assignments.length > 0) {
      localStorage.setItem('edusync_assignments', JSON.stringify(assignments));
    }
  }, [assignments]);

  useEffect(() => {
    if (quizzes.length > 0) {
      localStorage.setItem('edusync_quizzes', JSON.stringify(quizzes));
    }
  }, [quizzes]);

  // Assignment Handlers
  const submitAssignment = (assignmentId, submissionData, studentInfo = null) => {
    const exists = assignments.some((a) => a.id === assignmentId);
    let updated;
    if (exists) {
      updated = assignments.map((asg) => {
        if (asg.id === assignmentId) {
          return {
            ...asg,
            status: 'Submitted',
            submittedAt: new Date().toLocaleString(),
            submissionText: submissionData.submissionText || '',
            submissionLink: submissionData.submissionLink || '',
            studentId: studentInfo?.id || asg.studentId || 's_student',
            studentName: studentInfo?.name || submissionData?.studentName || asg.studentName || 'Student',
            studentEmail: studentInfo?.email || submissionData?.studentEmail || asg.studentEmail || '',
          };
        }
        return asg;
      });
    } else {
      const newAsg = {
        id: assignmentId,
        courseId: submissionData?.courseId || 'c1',
        courseTitle: submissionData?.courseTitle || 'Course Project',
        title: submissionData?.title || 'Course Practical Project',
        instructions: submissionData?.instructions || 'Build and submit course project.',
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        totalMarks: 100,
        status: 'Submitted',
        submittedAt: new Date().toLocaleString(),
        submissionText: submissionData?.submissionText || '',
        submissionLink: submissionData?.submissionLink || '',
        studentId: studentInfo?.id || 's_student',
        studentName: studentInfo?.name || 'Student',
        studentEmail: studentInfo?.email || '',
        solutionText: 'Official Reference Solution:\n1. Implement modular architecture and core logic.\n2. Handle async data flow and component lifecycle.\n3. Deploy to production environment.',
        solutionLink: 'https://github.com/edusync-official/solution-repo',
      };
      updated = [newAsg, ...assignments];
    }
    setAssignments(updated);
    localStorage.setItem('edusync_assignments', JSON.stringify(updated));

    const targetCourseId = submissionData?.courseId || assignments.find((a) => a.id === assignmentId)?.courseId;
    if (targetCourseId) {
      const updatedEnrollments = enrollments.map((enr) => {
        if (enr.courseId === targetCourseId) {
          const isLessonsDone = (enr.progress || 0) === 100;
          const courseQz = quizzes.find((q) => q.courseId === targetCourseId || q.courseTitle?.toLowerCase() === enr.courseTitle?.toLowerCase());
          const isQuizPassed = Boolean(courseQz && courseQz.userAttempt?.passed === true);

          if (isLessonsDone && isQuizPassed) {
            return { ...enr, status: 'Completed', progress: 100 };
          }
        }
        return enr;
      });
      setEnrollments(updatedEnrollments);
      localStorage.setItem('edusync_enrollments', JSON.stringify(updatedEnrollments));
    }

    toast.success('Assignment submitted successfully!');
    addActivity('Assignment Submitted', `Submitted solution for assignment ID: ${assignmentId} by ${studentInfo?.name || 'Student'}`);
  };

  const gradeSubmission = (assignmentId, obtainedMarks, feedback) => {
    const updated = assignments.map((asg) => {
      if (asg.id === assignmentId) {
        const percentage = Math.round((obtainedMarks / asg.totalMarks) * 100);
        return {
          ...asg,
          status: 'Graded',
          obtainedMarks: Number(obtainedMarks),
          gradePercentage: percentage,
          feedback: feedback || 'Graded by instructor.',
        };
      }
      return asg;
    });
    setAssignments(updated);
    localStorage.setItem('edusync_assignments', JSON.stringify(updated));
    toast.success('Submission graded successfully!');
    addActivity('Assignment Graded', `Graded assignment ID: ${assignmentId} with ${obtainedMarks} marks`);
  };

  const addAssignment = (asgData) => {
    const newAsg = {
      id: `asg_${Date.now()}`,
      courseId: asgData.courseId || 'c1',
      courseTitle: asgData.courseTitle || 'React JS Masterclass',
      title: asgData.title,
      instructions: asgData.instructions || 'Complete assignment according to instructions.',
      dueDate: asgData.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      totalMarks: Number(asgData.totalMarks) || 100,
      status: 'Pending',
      submittedAt: null,
      submissionText: '',
      submissionLink: '',
      obtainedMarks: null,
      gradePercentage: null,
      feedback: '',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newAsg, ...assignments];
    setAssignments(updated);
    localStorage.setItem('edusync_assignments', JSON.stringify(updated));
    toast.success('New assignment created successfully!');
    addActivity('Assignment Created', `Created assignment: ${newAsg.title}`);
  };

  const updateAssignmentSolution = (assignmentId, solutionText, solutionLink) => {
    const updated = assignments.map((asg) => {
      if (asg.id === assignmentId) {
        return {
          ...asg,
          solutionText: solutionText || '',
          solutionLink: solutionLink || '',
        };
      }
      return asg;
    });
    setAssignments(updated);
    localStorage.setItem('edusync_assignments', JSON.stringify(updated));
    toast.success('Official Reference Solution Key updated successfully!');
    addActivity('Solution Key Updated', `Updated solution key for assignment ID: ${assignmentId}`);
  };

  const deleteAssignment = (id) => {
    const updated = assignments.filter((a) => a.id !== id);
    setAssignments(updated);
    localStorage.setItem('edusync_assignments', JSON.stringify(updated));
    toast.success('Assignment deleted');
    addActivity('Assignment Deleted', `Deleted assignment ID: ${id}`);
  };

  // Quiz Handlers
  const submitQuizAttempt = (quizId, userAnswers, score, percentage, passed, studentInfo = null) => {
    const exists = quizzes.some((q) => q.id === quizId);
    let updatedQuizzes;
    if (exists) {
      updatedQuizzes = quizzes.map((q) => {
        if (q.id === quizId) {
          return {
            ...q,
            status: 'Completed',
            userAttempt: {
              attemptedAt: new Date().toLocaleString(),
              score,
              maxScore: q.totalMarks || 50,
              percentage,
              passed,
              userAnswers,
              studentId: studentInfo?.id || 's_student',
              studentName: studentInfo?.name || 'Student',
              studentEmail: studentInfo?.email || '',
            },
          };
        }
        return q;
      });
    } else {
      const newQuiz = {
        id: quizId,
        courseId: studentInfo?.courseId || 'c1',
        courseTitle: studentInfo?.courseTitle || 'Assessment Quiz',
        title: 'Timed Assessment Quiz',
        instructions: 'Answer all multiple choice questions within 5 minutes.',
        durationMinutes: 5,
        totalMarks: 50,
        passMarks: 35,
        status: 'Completed',
        userAttempt: {
          attemptedAt: new Date().toLocaleString(),
          score,
          maxScore: 50,
          percentage,
          passed,
          userAnswers,
          studentId: studentInfo?.id || 's_student',
          studentName: studentInfo?.name || 'Student',
          studentEmail: studentInfo?.email || '',
        },
      };
      updatedQuizzes = [newQuiz, ...quizzes];
    }
    setQuizzes(updatedQuizzes);
    localStorage.setItem('edusync_quizzes', JSON.stringify(updatedQuizzes));

    const targetCourseId = studentInfo?.courseId || quizzes.find((q) => q.id === quizId)?.courseId;
    if (targetCourseId) {
      const updatedEnrollments = enrollments.map((enr) => {
        if (enr.courseId === targetCourseId) {
          const isLessonsDone = (enr.progress || 0) === 100;
          const courseAsg = assignments.find((a) => a.courseId === targetCourseId || a.courseTitle?.toLowerCase() === enr.courseTitle?.toLowerCase());
          const isAsgDone = Boolean(courseAsg && (courseAsg.status === 'Submitted' || courseAsg.status === 'Graded'));

          if (passed && isLessonsDone && isAsgDone) {
            return { ...enr, status: 'Completed', progress: 100 };
          }
        }
        return enr;
      });
      setEnrollments(updatedEnrollments);
      localStorage.setItem('edusync_enrollments', JSON.stringify(updatedEnrollments));
    }

    toast.success(passed ? '🎉 Quiz passed successfully! Official Certificate of Completion is UNLOCKED.' : 'Quiz submitted.');
    addActivity('Quiz Completed', `Scored ${score} (${percentage}%) on quiz ID: ${quizId}`);
  };

  const addQuiz = (quizData) => {
    const newQuiz = {
      id: `quiz_${Date.now()}`,
      courseId: quizData.courseId || 'c1',
      courseTitle: quizData.courseTitle || 'React JS Masterclass',
      title: quizData.title,
      instructions: quizData.instructions || 'Timed multiple choice quiz.',
      durationMinutes: Number(quizData.durationMinutes) || 15,
      totalMarks: Number(quizData.totalMarks) || 50,
      passMarks: Number(quizData.passMarks) || 35,
      dueDate: quizData.dueDate || new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      status: 'Available',
      userAttempt: null,
      questions: quizData.questions || [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newQuiz, ...quizzes];
    setQuizzes(updated);
    localStorage.setItem('edusync_quizzes', JSON.stringify(updated));
    toast.success('New quiz created successfully!');
    addActivity('Quiz Created', `Created quiz: ${newQuiz.title}`);
  };

  const deleteQuiz = (id) => {
    const updated = quizzes.filter((q) => q.id !== id);
    setQuizzes(updated);
    localStorage.setItem('edusync_quizzes', JSON.stringify(updated));
    toast.success('Quiz deleted');
    addActivity('Quiz Deleted', `Deleted quiz ID: ${id}`);
  };

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

    // Auto-create matching Assignment & Quiz for the newly created course!
    const newAssignment = {
      id: `asg_${newCourse.id}`,
      courseId: newCourse.id,
      courseTitle: newCourse.title,
      title: `${newCourse.title} Capstone Project`,
      instructions: `Complete the practical project assignment for ${newCourse.title} and submit your solution link below.`,
      dueDate: '2026-10-30',
      totalMarks: 100,
      status: 'Pending',
      submittedAt: null,
      submissionText: '',
      submissionLink: '',
      obtainedMarks: null,
      gradePercentage: null,
      feedback: '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const newQuiz = {
      id: `quiz_${newCourse.id}`,
      courseId: newCourse.id,
      courseTitle: newCourse.title,
      title: `${newCourse.title} Assessment Quiz`,
      instructions: 'Answer all 5 questions to pass this module quiz.',
      durationMinutes: 10,
      totalMarks: 50,
      passMarks: 35,
      dueDate: '2026-10-30',
      status: 'Available',
      userAttempt: null,
      questions: [
        { id: 'q1', question: `What is the primary core objective of ${newCourse.title}?`, options: ['Core Application Engineering', 'Hardware Repair', 'Database Purging', 'Basic Styling Only'], correctAnswer: 0, explanation: `Focuses on core engineering principles in ${newCourse.title}.` },
        { id: 'q2', question: 'Which design pattern promotes clean modular component architecture?', options: ['Monolithic Coupling', 'Separation of Concerns', 'Global State Mutation', 'Hardcoded Scripting'], correctAnswer: 1, explanation: 'Separation of concerns enhances maintainability and testability.' },
        { id: 'q3', question: 'What is the standard HTTP status code for successful API requests?', options: ['404 Not Found', '500 Server Error', '200 OK', '403 Forbidden'], correctAnswer: 2, explanation: 'HTTP 200 OK signals request success.' },
        { id: 'q4', question: 'Why are automated unit tests critical in modern software development?', options: ['To slow down release pipelines', 'To catch regressions early and ensure code stability', 'To inflate bundle size', 'To bypass code reviews'], correctAnswer: 1, explanation: 'Automated tests ensure reliability.' },
        { id: 'q5', question: 'Which tool is widely used for version control in enterprise software engineering?', options: ['Git & GitHub', 'MS Paint', 'Notepad', 'Excel Sheet'], correctAnswer: 0, explanation: 'Git is the industry standard version control system.' },
      ],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setAssignments((prev) => [newAssignment, ...prev]);
    setQuizzes((prev) => [newQuiz, ...prev]);

    addActivity('New Course Added', `Created course "${newCourse.title}" taught by ${instructorName}`);
    toast.success(`Course "${courseData.title}" created successfully with linked Assignment & Quiz!`);
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

  const addEnrollment = ({ studentId, studentEmail, courseId, enrollmentDate, status = 'Active', progress = 10, studentName }) => {
    // Active user resolution with double fallback
    const activeUser = user || (() => {
      try {
        const savedSession = localStorage.getItem('edusync_session');
        return savedSession ? JSON.parse(savedSession) : null;
      } catch {
        return null;
      }
    })();

    // Robust student lookup with fallbacks
    let student = students.find(
      (s) =>
        (studentId && s.id === studentId) ||
        (studentEmail && s.email?.toLowerCase() === studentEmail.toLowerCase()) ||
        (activeUser?.email && s.email?.toLowerCase() === activeUser.email.toLowerCase())
    );

    // Fallback to logged-in user or dynamic student object if missing
    if (!student) {
      if (activeUser || studentName || studentEmail) {
        student = {
          id: studentId || activeUser?.id || `s_${Date.now()}`,
          name: studentName || activeUser?.name || 'Enrolled Student',
          email: studentEmail || activeUser?.email || 'student@edusync.com',
          phone: activeUser?.phone || '+91 98765 43210',
          qualification: activeUser?.qualification || 'B.Tech CS',
        };
        setStudents((prev) => [student, ...prev]);
      } else {
        student = MANIKANTA_STUDENT;
      }
    }

    // Robust course lookup
    const course = courses.find(
      (c) => c.id === courseId || c.title?.toLowerCase() === courseId?.toLowerCase()
    );

    if (!course) {
      toast.error('Selected course was not found in catalog.');
      return false;
    }

    // Check duplicate enrollment
    const isAlready = enrollments.some(
      (e) =>
        (e.studentId === student.id || e.studentEmail?.toLowerCase() === student.email?.toLowerCase()) &&
        e.courseId === course.id &&
        e.status === 'Active'
    );

    if (isAlready) {
      toast.warning(`You are already enrolled in "${course.title}"!`);
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
      progress: status === 'Completed' ? 100 : Number(progress) || 10,
    };

    const updated = [newEnrollment, ...enrollments];
    setEnrollments(updated);
    localStorage.setItem('edusync_enrollments', JSON.stringify(updated));
    addActivity('Student Enrolled', `Enrolled "${student.name}" into "${course.title}"`);
    toast.success(`Successfully enrolled into "${course.title}"!`);
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

    const courseAsg = assignments.find((a) => a.courseId === existing.courseId || a.courseTitle?.toLowerCase() === existing.courseTitle?.toLowerCase());
    const isAsgDone = Boolean(courseAsg && (courseAsg.status === 'Submitted' || courseAsg.status === 'Graded'));
    const courseQz = quizzes.find((q) => q.courseId === existing.courseId || q.courseTitle?.toLowerCase() === existing.courseTitle?.toLowerCase());
    const isQuizPassed = Boolean(courseQz && courseQz.userAttempt?.passed === true);

    // Course status is 'Completed' ONLY IF 100% lessons + assignment submitted + quiz passed!
    const newStatus = (newProgress === 100 && isAsgDone && isQuizPassed)
      ? 'Completed'
      : (newProgress === 0 ? 'Pending' : 'Active');

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
        assignments,
        quizzes,
        liveClasses,
        scheduleLiveClass,
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
        submitAssignment,
        gradeSubmission,
        addAssignment,
        updateAssignmentSolution,
        deleteAssignment,
        submitQuizAttempt,
        addQuiz,
        deleteQuiz,
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
