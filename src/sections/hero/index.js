// HERO (landing). Full screen: the 3D hero scene + a typed greeting. Nothing else.
import './hero.css';
import site from '../../data/site.json';

const [FIRST, ...REST] = site.name.split(' ');
const LAST = REST.join(' ');

// Types the greeting, then the first name, then the surname, one letter at a time.
function typeIntro(el) {
  const parts = [
    [el.querySelector('.hero-greet'), site.heroGreeting || "Hi, I'm"],
    [el.querySelector('.hero-first'), FIRST],
    [el.querySelector('.hero-last'), LAST],
  ];
  parts.forEach(([node]) => { node.textContent = ''; });
  el.querySelector('.hero-name').appendChild(el.querySelector('.hero-caret'));
  el.classList.remove('hero-typed-done');

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    parts.forEach(([node, text]) => { node.textContent = text; });
    el.classList.add('hero-typed-done');
    return () => {};
  }

  let part = 0, i = 0, timer;
  const caret = el.querySelector('.hero-caret');
  function step() {
    const [node, text] = parts[part];
    node.textContent = text.slice(0, ++i);
    node.appendChild(caret);              // caret follows the text being typed
    if (i >= text.length) { part++; i = 0; }
    if (part >= parts.length) { el.classList.add('hero-typed-done'); return; }
    const pause = i === 0 ? 350 : 70 + Math.random() * 60; // small pause between parts
    timer = setTimeout(step, pause);
  }
  timer = setTimeout(step, 200);
  return () => clearTimeout(timer);
}

export function mountHero(el) {
  el.classList.add('hero');
  el.innerHTML = `
    <div class="hero-canvas"></div>
    <div class="hero-text">
      <p class="hero-greet"></p>
      <h1 class="hero-name"><span class="hero-first"></span> <em class="hero-last"></em><span class="hero-caret" aria-hidden="true"></span></h1>
      <p class="hero-line">${site.heroLine}</p>
    </div>
    <span class="sr-only">${site.heroGreeting || "Hi, I'm"} ${site.name}</span>
    <button class="hero-replay" type="button">Replay</button>
    <div class="hero-scroll">scroll ↓</div>
  `;

  let stopTyping = () => {};
  const startText = () => { el.classList.add('hero-landed'); stopTyping(); stopTyping = typeIntro(el); };

  // Three.js is loaded separately so the rest of the page appears fast.
  import('./scene.js')
    .then(({ startHeroScene }) => {
      const scene = startHeroScene(el.querySelector('.hero-canvas'), startText);
      el.querySelector('.hero-replay').addEventListener('click', () => {
        stopTyping();
        el.classList.remove('hero-landed');
        scene.replay();
      });
    })
    .catch(startText); // if 3D fails, still show the greeting
}
