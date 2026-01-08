import { FaHome, FaUser, FaFolderOpen, FaEnvelopeOpen } from 'react-icons/fa';
import { RiBriefcase4Fill, RiGraduationCapFill } from 'react-icons/ri';


import skillsImg1 from './assets/html-logo.svg';
import skillsImg2 from './assets/css-logo.svg';
import skillsImg3 from './assets/javascript-logo.svg';
import skillsImg4 from './assets/react-logo.svg';
import skillsImg5 from './assets/tailwind-css-logo.svg';

import skillsImg6 from './assets/springboot.svg';
import skillsImg7 from './assets/Csharp.png';
import skillsImg8 from './assets/nodejs.svg';
import skillsImg9 from './assets/java.svg';
import skillsImg10 from './assets/angular.svg';
import skillsImg11 from './assets/flutter.png';
import skillsImg12 from './assets/mongodb.svg';
import skillsImg13 from './assets/firebase.png';





import projectImg1 from './assets/project-1.jpg';
import projectImg2 from './assets/project-2.jpg';
import projectImg3 from './assets/project-3.jpg';
import projectImg4 from './assets/project-4.jpg';
import projectImg5 from './assets/project-5.jpg';

export const links = [
  {
    name: 'Home',
    icon: <FaHome className='nav-icon' />,
    path: '/',
  },

  {
    name: 'About',
    icon: <FaUser className='nav-icon' />,
    path: '/about',
  },

  {
    name: 'Portfolio',
    icon: <FaFolderOpen className='nav-icon' />,
    path: '/portfolio',
  },

  {
    name: 'Contact',
    icon: <FaEnvelopeOpen className='nav-icon' />,
    path: '/contact',
  },
];


export const personalInfo = [
  {
    title: 'First Name : ',
    description: 'Larbi',
  },

  {
    title: 'Last Name : ',
    description: 'El Aouad',
  },

  {
    title: 'Age : ',
    description: '23 Years',
  },

  {
    title: 'Nationality : ',
    description: 'Moroccan',
  },

  {
    title: 'Freelance : ',
    description: 'Available',
  },

  {
    title: 'Address : ',
    description: 'Casablanca',
  },

  {
    title: 'Phone : ',
    description: '+212 669171969',
  },

  {
    title: 'Email : ',
    description: 'Larbi.louad.el@mail.com',
  },

  {
    title: 'Linkedin : ',
    description: 'https://www.linkedin.com/in/larbielaouad/',
  },

  {
    title: 'Langages : ',
    description: 'French, English',
  },

];


export const stats = [
  {
    no: '5+',
    title: 'Years of <br /> Formation',
  },

  {
    no: '10+',
    title: 'Completed <br /> Projects',
  },

  {
    no: '5+',
    title: 'Happy <br /> Customers',
  },

  {
    no: '8+',
    title: ' Awards <br /> Won',
  },
];




export const skill = [
  {
    id: 1,
    img: skillsImg1,
    title: 'HTML',
    level: 'Advanced',
    category: 'Frontend',
  },

  {
    id: 2,
    img: skillsImg2,
    title: 'CSS',
    level: 'Advanced',
    category: 'Frontend',
  },

  {
    id: 3,
    img: skillsImg3,
    title: 'JavaScript',
    level: 'Intermediate',
    category: 'Frontend',
  },

  {
    id: 4,
    img: skillsImg4,
    title: 'React',
    level: 'Intermediate',
    category: 'Frontend',
  },

  {
    id: 5,
    img: skillsImg5,
    title: 'Tailwind',
    level: 'Intermediate',
    category: 'Frontend',
  },

  {
    id: 6,
    img: skillsImg6,
    title: 'SpringBoot',
    level: 'Intermediate',
    category: 'Backend',
  },

  {
    id: 7,
    img: skillsImg7,
    title: 'C#',
    level: 'Intermediate',
    category: 'Backend',
  },

  {
    id: 8,
    img: skillsImg8,
    title: 'Node js',
    level: 'Intermediate',
    category: 'Backend',
  },

  {
    id: 9,
    img: skillsImg9,
    title: 'Java',
    level: 'Intermediate',
    category: 'Backend',
  },

  {
    id: 10,
    img: skillsImg10,
    title: 'angular',
    level: 'Basic',
    category: 'Frontend',
  },

  {
    id: 11,
    img: skillsImg11,
    title: 'Flutter',
    level: 'basic',
    category: 'Backend',
  },
  {
    id: 12,
    img: skillsImg12,
    title: 'MongoDb',
    level: 'Intermediate',
    category: 'Backend',
  },


];



export const resume = [
  {
    id: 1,
    category: 'experience',
    icon: <RiGraduationCapFill />,
    year: '2023 - 2026',
    title: 'Software Engineering <span> Full Stack Web Development  EMSI - Casablanca</span>',
    desc: ' Specialized in modern web technologies, cloud architecture, and agile methodologies',
  },

  {
    id: 2,
    category: 'education',
    icon: <RiGraduationCapFill />,
    year: '2023 - 2024',
    title: 'Professional Degree <span> Computer Science & Network Engineering </span>',
    desc: 'EMSI - Focus on network infrastructure, system administration, and IT security fundamentals',
  },

  {
    id: 3,
    category: 'experience',
    icon: <RiBriefcase4Fill />,
    year: '2023',
    title: 'Website Store Sales Agent',
    desc: 'Selling complete online store websites with payment integration and inventory management.'
  },

  {
    id: 4,
    category: 'education',
    icon: <RiGraduationCapFill />,
    year: '2020-2023',
    title: "Bachelor's Degree in Physics <span> Faculty of Sciences Ben M'Sik - Casablanca </span>",
    desc: 'Specialized in physical sciences with focus on analytical methods, experimental physics, and scientific research methodologies.',
  },

  {
    id: 5,
    category: 'experience',
    icon: <RiGraduationCapFill />,
    year: '2022',
    title: "Associate Degree in Physics & Chemistry <span> Ben M'Sik University Hassan II - Casablanca </span>",
    desc: 'Comprehensive foundation in physical sciences including thermodynamics, quantum mechanics, organic chemistry, and laboratory techniques.',
  },

  {
    id: 6,
    category: 'education',
    icon: <RiGraduationCapFill />,
    year: '2020',
    title: 'Baccalaureate in Life and Earth Sciences <span> Life Sciences Track - Casablanca </span>',
    desc: 'Biology and Earth Sciences specialization with honors in mathematics and experimental sciences.',
  },
];






export const portfolio = [
  {
    id: 1,
    img: projectImg1,
    title: 'SportPro Ecommerce',
    description:
      'An e-commerce website specializing in sports accessories and clothing',
    skills: [skillsImg1, skillsImg2, skillsImg5, skillsImg3, skillsImg8, skillsImg12],
    link: 'https://github.com/012larbi/node-ecom',
  },

  {
    id: 2,
    img: projectImg2,
    title: 'Chat App',
    description:
      'Chat Messenger - Spring Boot Project.',
    skills: [skillsImg1, skillsImg2, skillsImg9, skillsImg6, skillsImg12],
    link: 'https://github.com/012larbi/Chat_App_Larbi_ELAOUAD-Omar_AitAlkadi/tree/main/V_Chat_App',
  },

  {
    id: 3,
    img: projectImg3,
    title: 'SmartFruit',
    description:
      'FruitAI - Fruit Recognition & Percentage Calculator.',
    skills: [skillsImg1, skillsImg2, skillsImg11, skillsImg13],
    link: 'https://github.com/012larbi/SmartFruit',
  },
  /*
    {
      id: 4,
      img: projectImg4,
      title: 'Barbershop Website',
      description:
        'Short description of the project that was carried out in this portfolio.',
      skills: [skillsImg4, skillsImg5],
      link: '',
    },
  
    {
      id: 5,
      img: projectImg5,
      title: 'Construction Landing Page',
      description:
        'Short description of the project that was carried out in this portfolio.',
      skills: [skillsImg1, skillsImg2, skillsImg3],
      link: '',
    },*/
];
