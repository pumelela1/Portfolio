// CONTACT. Details come from src/data/site.json
import './contact.css';
import site from '../../data/site.json';

export function mountContact(el) {
  const c = site.contact;
  el.classList.add('section', 'contact');
  el.innerHTML = `
    <p class="section-label">Contact</p>
    <h2>Get in <em>touch</em></h2>
    <p>Email: ${c.email}</p>
    <p class="contact-links">
      <a href="${c.github}" target="_blank" rel="noopener">GitHub</a>
      <a href="${c.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
      ${c.cv ? `<a href="${import.meta.env.BASE_URL}${c.cv}" target="_blank" rel="noopener">CV</a>` : '<span class="contact-empty">CV (add file)</span>'}
    </p>
  `;
}
