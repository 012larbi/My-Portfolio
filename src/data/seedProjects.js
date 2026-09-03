// ===============================================================
//  SEED PROJECTS
// ===============================================================
//  The 3 projects that used to live hard-coded in src/Data.jsx,
//  migrated to the new project schema. These are used to:
//    - seed the browser-storage fallback the first time it runs
//    - one-time import into Firestore when the "projects" collection
//      is still empty (so existing projects never disappear)
//
//  New project schema
//  {
//    id, title, description, image, category, technologies[],
//    githubUrl, liveUrl, featured, createdAt
//  }
// ===============================================================

import projectImg1 from '../assets/project-1.jpg';
import projectImg2 from '../assets/project-2.jpg';
import projectImg3 from '../assets/project-3.jpg';

export const SEED_PROJECTS = [
  {
    id: 'seed-sportpro',
    title: 'SportPro Ecommerce',
    description:
      'An e-commerce website specializing in sports accessories and clothing.',
    image: projectImg1,
    category: 'web',
    technologies: ['HTML', 'CSS', 'Tailwind CSS', 'JavaScript', 'Node.js', 'MongoDB'],
    githubUrl: 'https://github.com/012larbi/node-ecom',
    liveUrl: '',
    featured: true,
    createdAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: 'seed-chatapp',
    title: 'Chat App',
    description: 'Chat Messenger — Spring Boot project.',
    image: projectImg2,
    category: 'backend',
    technologies: ['HTML', 'CSS', 'Java', 'Spring Boot', 'MongoDB'],
    githubUrl:
      'https://github.com/012larbi/Chat_App_Larbi_ELAOUAD-Omar_AitAlkadi/tree/main/V_Chat_App',
    liveUrl: '',
    featured: false,
    createdAt: '2024-03-10T00:00:00.000Z',
  },
  {
    id: 'seed-smartfruit',
    title: 'SmartFruit',
    description: 'FruitAI — fruit recognition & percentage calculator.',
    image: projectImg3,
    category: 'mobile',
    technologies: ['HTML', 'CSS', 'Flutter', 'Firebase'],
    githubUrl: 'https://github.com/012larbi/SmartFruit',
    liveUrl: '',
    featured: false,
    createdAt: '2024-05-20T00:00:00.000Z',
  },
];
