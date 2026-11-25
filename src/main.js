// Main page: loads the shared styles, then lets each section build itself.
// Each section only touches its own <section> element.
import './styles/theme.css';
import './styles/base.css';
import './ui/grain.css';
import './ui/invert.css';
import { mountCursor } from './ui/cursor.js';

import { mountHero } from './sections/hero/index.js';
import { mountAbout } from './sections/about/index.js';
import { mountProjects } from './sections/projects/index.js';
import { mountAma } from './sections/ama/index.js';
import { mountContact } from './sections/contact/index.js';

mountHero(document.getElementById('hero'));
mountAbout(document.getElementById('about'));
mountProjects(document.getElementById('projects'));
mountAma(document.getElementById('ask'));
mountContact(document.getElementById('contact'));
mountCursor();
