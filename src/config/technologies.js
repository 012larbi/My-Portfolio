// ===============================================================
//  TECHNOLOGY ICON REGISTRY
// ===============================================================
//  Optional visual layer for the "technologies" field of a project.
//  Technologies are stored on a project as plain strings, e.g.
//    technologies: ['React', 'Node.js', 'MongoDB']
//
//  If a name is found here (case-insensitive) the matching icon is
//  rendered on the project card. If it is NOT found, the name is
//  simply shown as a small text chip — so you can type any tech you
//  like from the Admin form without breaking anything.
//
//  To add an icon: import the asset and add one line to ICONS below.
// ===============================================================

import htmlLogo from '../assets/html-logo.svg';
import cssLogo from '../assets/css-logo.svg';
import jsLogo from '../assets/javascript-logo.svg';
import reactLogo from '../assets/react-logo.svg';
import tailwindLogo from '../assets/tailwind-css-logo.svg';
import springLogo from '../assets/springboot.svg';
import csharpLogo from '../assets/Csharp.png';
import nodeLogo from '../assets/nodejs.svg';
import javaLogo from '../assets/java.svg';
import angularLogo from '../assets/angular.svg';
import flutterLogo from '../assets/flutter.png';
import mongoLogo from '../assets/mongodb.svg';
import firebaseLogo from '../assets/firebase.png';

// key must be lower-case; aliases allowed (point to the same icon)
const ICONS = {
  html: htmlLogo,
  'html5': htmlLogo,
  css: cssLogo,
  'css3': cssLogo,
  javascript: jsLogo,
  js: jsLogo,
  react: reactLogo,
  'react.js': reactLogo,
  reactjs: reactLogo,
  tailwind: tailwindLogo,
  'tailwind css': tailwindLogo,
  tailwindcss: tailwindLogo,
  'spring boot': springLogo,
  springboot: springLogo,
  spring: springLogo,
  'c#': csharpLogo,
  csharp: csharpLogo,
  'node.js': nodeLogo,
  node: nodeLogo,
  nodejs: nodeLogo,
  java: javaLogo,
  angular: angularLogo,
  flutter: flutterLogo,
  mongodb: mongoLogo,
  mongo: mongoLogo,
  firebase: firebaseLogo,
};

/** Returns an icon URL for a tech name, or null if none is registered. */
export function techIcon(name) {
  if (!name) return null;
  return ICONS[String(name).trim().toLowerCase()] || null;
}

/** Names that have an icon — handy for form autocomplete hints. */
export const KNOWN_TECHNOLOGIES = [
  'HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS', 'Spring Boot',
  'C#', 'Node.js', 'Java', 'Angular', 'Flutter', 'MongoDB', 'Firebase',
];
