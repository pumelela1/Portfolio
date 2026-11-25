// ASK ME ANYTHING. Questions/answers come from src/data/ama.json
// Click a question to show its answer.
import './ama.css';
import data from '../../data/ama.json';

export function mountAma(el) {
  el.classList.add('section', 'ama');
  el.innerHTML = `
    <p class="section-label">Ask me anything</p>
    <h2>Ask me <em>anything</em></h2>
    <div class="ama-questions">
      ${data.questions.map((item, i) => `<button class="ama-q" type="button" data-i="${i}">${item.q}</button>`).join('')}
    </div>
    <div class="ama-answer" aria-live="polite"></div>
    <p class="todo">To fill in: your questions and answers (ama.json).</p>
  `;

  const answer = el.querySelector('.ama-answer');
  const buttons = el.querySelectorAll('.ama-q');
  function show(i) {
    buttons.forEach((b) => b.classList.toggle('ama-q-active', Number(b.dataset.i) === i));
    answer.innerHTML = `<p class="ama-asked">${data.questions[i].q}</p><p class="ama-reply">${data.questions[i].a}</p>`;
  }
  buttons.forEach((b) => b.addEventListener('click', () => show(Number(b.dataset.i))));
  if (data.questions.length) show(0);
}
