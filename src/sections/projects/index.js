// PROJECTS: Coursework, Off the syllabus, Certificates.
// All text/links/images come from src/data/projects.json and certificates.json
import './projects.css';
import data from '../../data/projects.json';
import certData from '../../data/certificates.json';

const BASE = import.meta.env.BASE_URL; // "/Portfolio/"
const LINK_LABELS = { report: 'Read the report', github: 'GitHub', docs: 'Documentation', youtube: 'YouTube', live: 'Live site', certificate: 'Certificate' };

function imageSlot(p) {
  if (p.image) {
    return `<img class="proj-img" src="${BASE}images/projects/${p.image}" alt="${p.imageAlt || p.title}" loading="lazy">`;
  }
  return `<div class="proj-img proj-img-empty">image coming<br><small>${p.id}.webp</small></div>`;
}

function links(p) {
  return Object.entries(p.links)
    .map(([k, url]) => url
      ? `<a href="${url}" target="_blank" rel="noopener">${LINK_LABELS[k] || k}</a>`
      : `<span class="proj-link-empty">${LINK_LABELS[k] || k}</span>`)
    .join('');
}

function card(p) {
  return `
    <article class="proj-card" id="project-${p.id}" data-cursor="View">
      ${imageSlot(p)}
      <h4>${p.title}</h4>
      <p class="proj-meta">${p.meta}</p>
      <p class="proj-desc">${p.description}</p>
      <p><b>What:</b> ${p.what}</p>
      <p><b>How:</b> ${p.how}</p>
      ${p.result ? `<p><b>Result:</b> ${p.result}</p>` : ''}
      ${p.certificates ? `<p class="proj-meta"><b>Certificates:</b> ${p.certificates.join(' · ')}</p>` : ''}
      <div class="proj-links">${links(p)}</div>
      ${p.note ? `<p class="proj-note">${p.note}</p>` : ''}
    </article>`;
}

export function mountProjects(el) {
  const course = data.projects.filter((p) => p.group === 'coursework');
  const off = data.projects.filter((p) => p.group === 'offsyllabus');

  el.classList.add('section', 'projects');
  el.innerHTML = `
    <p class="section-label">Projects</p>
    <h2>Projects</h2>

    <h3 class="proj-group">Coursework</h3>
    <div class="proj-grid">${course.map(card).join('')}</div>

    <h3 class="proj-group">Off the <em>syllabus</em></h3>
    <div class="proj-grid">${off.map(card).join('')}</div>

    <h3 class="proj-group">Certificates</h3>
    <ul class="proj-certs">
      ${certData.certificates.map((c) => `
        <li>${c.title} <span class="proj-meta">· ${c.issuer}</span>
          ${c.image ? `<a href="${BASE}certificates/${c.image}" target="_blank" rel="noopener">View</a>` : '<span class="proj-link-empty">View</span>'}
          ${c.verify ? `<a href="${c.verify}" target="_blank" rel="noopener">Verify</a>` : ''}
        </li>`).join('')}
    </ul>
  `;
}
