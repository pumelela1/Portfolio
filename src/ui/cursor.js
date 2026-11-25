// Custom cursor: a small dot that follows the mouse and grows into "View" over projects.
// Only on devices with a real mouse (not phones/tablets).
import './cursor.css';

export function mountCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor';
  dot.innerHTML = '<span class="cursor-label"></span>';
  document.body.appendChild(dot);
  document.documentElement.classList.add('has-cursor');
  const label = dot.querySelector('.cursor-label');

  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; dot.classList.add('cursor-on'); });
  document.addEventListener('mouseleave', () => dot.classList.remove('cursor-on'));

  // Grow over anything marked data-cursor (projects say "View"), or links/buttons
  document.addEventListener('mouseover', (e) => {
    const big = e.target.closest('[data-cursor]');
    const link = e.target.closest('a, button');
    dot.classList.toggle('cursor-big', !!big);
    dot.classList.toggle('cursor-link', !big && !!link);
    label.textContent = big ? big.dataset.cursor : '';
  });

  (function loop() {
    cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;   // smooth follow
    dot.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  })();
}
