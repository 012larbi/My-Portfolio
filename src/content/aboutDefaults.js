// ===============================================================
//  ABOUT PAGE — DEFAULT CONTENT (seed)
// ===============================================================
//  Adapted from the arrays in src/Data.jsx. This is only the default
//  seed: the About page content is managed from /admin/about and
//  stored in the backend (Firestore doc `content/about` or
//  localStorage). If the backend is empty / unreachable, the page
//  falls back to exactly these values — so nothing changes visually.
//
//  Shapes:
//    personalInfo : [{ title, description, link }]
//    stats        : [{ no, title }]        title may contain <br />
//    skills       : [{ id, title, level, category, icon }]
//                   category: 'Frontend' | 'Backend'
//                   icon: a technology name resolved via config/technologies
//    resume       : [{ id, category, iconName, year, title, desc }]
//                   category: 'experience' | 'education'
//                   iconName: 'graduation' | 'briefcase'
// ===============================================================

import {
  personalInfo as rawInfo,
  stats as rawStats,
  skill as rawSkill,
  resume as rawResume,
} from '../Data';

// title -> a key that config/technologies.js knows how to draw
const SKILL_ICON_KEY = {
  HTML: 'html',
  CSS: 'css',
  JavaScript: 'javascript',
  React: 'react',
  Tailwind: 'tailwind css',
  SpringBoot: 'spring boot',
  'C#': 'c#',
  'Node js': 'node.js',
  Java: 'java',
  angular: 'angular',
  Flutter: 'flutter',
  MongoDb: 'mongodb',
};

// resume id -> which icon it used originally
const RESUME_ICON = { 1: 'graduation', 2: 'graduation', 3: 'briefcase' };

export const ABOUT_DEFAULTS = {
  personalInfo: rawInfo.map(({ title, description, link }) => ({
    title: title || '',
    description: description || '',
    link: link || '',
  })),

  stats: rawStats.map(({ no, title }) => ({ no: no || '', title: title || '' })),

  skills: rawSkill.map(({ id, title, level, category }) => ({
    id: String(id),
    title: title || '',
    level: level || '',
    category: category || 'Frontend',
    icon: SKILL_ICON_KEY[title] || title || '',
  })),

  resume: rawResume.map(({ id, category, year, title, desc }) => ({
    id: String(id),
    category: category || 'experience',
    iconName: RESUME_ICON[id] || 'graduation',
    year: year || '',
    title: title || '',
    desc: desc || '',
  })),
};

export const RESUME_ICON_OPTIONS = ['graduation', 'briefcase'];
export const SKILL_CATEGORY_OPTIONS = ['Frontend', 'Backend'];
export const RESUME_CATEGORY_OPTIONS = ['experience', 'education'];
