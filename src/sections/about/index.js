// ABOUT + SKILLS. Text comes from src/data/site.json
import './about.css';
import site from '../../data/site.json';

export function mountAbout(el) {
  el.classList.add('section', 'about');
  el.innerHTML = `
    <p class="section-label">About</p>
    <h2>About <em>me</em></h2>
    ${site.about.map((p) => `<p>${p}</p>`).join('')}
    <p class="todo">To fill in: a few lines about you, in your own words (site.json → "about").</p>

    <h3 class="about-sub">Skills</h3>
    <div class="about-skills">
      ${Object.entries(site.skills).map(([k, v]) => `<p><b>${k}:</b> ${v}</p>`).join('')}
    </div>
  `;
}
