// All portfolio content lives here. Edit this file to update the site.
// Content is taken from Kushagra's resume.

export const profile = {
  name: 'Kushagra Patidar',
  role: 'Full Stack Developer',
  headline: 'Computer Science graduate',
  summary:
    'Computer Science graduate with hands-on experience in full-stack web development using React, Node.js, Express.js, Flask, and MongoDB. Experienced in developing web applications with user authentication, role-based modules, booking workflows, payment integration, and cloud-based image uploads. Familiar with REST APIs, Git, GitHub, and application deployment on Vercel and Render. Seeking an entry-level Full Stack Developer or Software Engineer role.',
  email: 'patidarkushagra4@gmail.com',
  phone: '+91 7073554489',
  github: 'https://github.com/kushagra751',
  linkedin: 'https://www.linkedin.com/in/kushagra751/',
  resume: 'Kushagra_Patidar_Resume.pdf',
}

export const education = [
  {
    period: '2022 - 2026',
    title: 'Bachelor of Technology (Computer Science & Engineering)',
    place: 'Parul University',
  },
  {
    period: '2021 - 2022',
    title: 'Higher Secondary (Class 12), Science (PCM)',
    place: 'G.S.SEC.S.CHITRI, Dungarpur',
  },
]

export const certifications = [
  'Full Stack Developer Internship - XenoTech Solutions',
  'Meta Front-End Developer Professional Certificate - Meta / Coursera (2026)',
  'Meta Back-End Developer Professional Certificate - Meta / Coursera (2026)',
  'Code Clash - Certificate of Participation | IGDTUW, Delhi | Unstop',
]

export const experience = [
  {
    role: 'Full Stack Developer Intern',
    company: 'XenoTech Solution',
    period: '15 January 2026 - 7 April 2026',
    points: [
      'Designed and launched Rent-A-Ride, a full-stack car-rental platform built with React, Node.js, Express.js, and MongoDB.',
      'Developed User, Vendor, and Admin modules with booking and vehicle management.',
      'Integrated Razorpay payments, Google login, and Cloudinary image uploads.',
      'Deployed the app on Vercel and Render.',
    ],
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Razorpay', 'Cloudinary'],
  },
]

export const projects = [
  {
    title: 'Rent-A-Ride',
    tag: 'Internship project',
    stack: ['React', 'Node.js', 'Express.js', 'MongoDB'],
    description:
      'Full-stack car-rental platform with separate User, Vendor and Admin modules, booking and vehicle management, Razorpay payments, Google login and Cloudinary image uploads.',
    features: ['User / Vendor / Admin modules', 'Razorpay payments', 'Google login', 'Cloudinary uploads'],
    links: [],
  },
  {
    title: 'Campus Connect',
    tag: 'Full stack',
    stack: ['React', 'Next.js', 'Tailwind', 'Node.js', 'MongoDB'],
    description: 'A campus community platform for students.',
    features: ['User Profiles', 'Event Management', 'Clubs & Communities', 'Messaging', 'Announcements', 'Resource Sharing'],
    links: [{ label: 'GitHub', href: 'https://github.com/kushagra751/CampusConnect' }],
  },
  {
    title: 'Online Voting & Polling System',
    tag: 'Web app',
    stack: ['Flask', 'MongoDB', 'HTML', 'CSS', 'JavaScript'],
    description: 'Create, join and vote in polls, including public polls such as "IND VS AUS".',
    features: ['Public polls', 'Profile management', 'Poll creation and joining', 'Security'],
    links: [{ label: 'Live demo', href: 'https://polling-yvoj.onrender.com/' }],
  },
  {
    title: 'AK Tower',
    tag: 'Apartments booking',
    stack: ['Flask', 'MongoDB', 'HTML', 'CSS', 'JavaScript'],
    description: 'Apartment booking platform with room booking and library seat reservation.',
    features: ['Room Booking', 'Library Seat Reservation', 'Media Gallery', 'Responsive Design'],
    links: [{ label: 'Live demo', href: 'https://ak-tower.onrender.com' }],
  },
  {
    title: 'Radio Bharat',
    tag: 'Streaming',
    stack: ['React', 'API'],
    description: 'Online platform to stream Indian radio stations.',
    features: ['Stream Indian radio stations'],
    links: [{ label: 'Live demo', href: 'https://radiobharat.vercel.app/' }],
  },
  {
    title: 'Exam Platform',
    tag: 'Web app',
    stack: [],
    description: 'Online exam platform.',
    features: [],
    links: [{ label: 'Live demo', href: 'https://exam-platform-client.vercel.app/' }],
  },
  {
    title: 'Treasure Hunt',
    tag: 'Project',
    stack: [],
    description: 'Treasure Hunt project.',
    features: [],
    links: [{ label: 'GitHub', href: 'https://github.com/kushagra751/TreasureHunt' }],
  },
]

export const skills = [
  { group: 'Programming', items: ['Python', 'Flask', 'Java', 'C'] },
  { group: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'Tailwind', 'React', 'Redux'] },
  { group: 'Backend', items: ['Node.js', 'Express.js', 'REST APIs', 'Flask', 'Django'] },
  { group: 'Database', items: ['MongoDB', 'MongoDB Atlas', 'SQL'] },
  { group: 'Tools', items: ['Git & GitHub', 'VS Code', 'Postman'] },
  { group: 'Integration', items: ['Razorpay', 'Firebase', 'Auth', 'Cloudinary'] },
  { group: 'Soft Skills', items: ['Problem Solving', 'Teamwork', 'Communication'] },
]
