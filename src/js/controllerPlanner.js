import * as model from './model.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// console.log(window.location.pathname);

//test view
document
  .querySelector('.container')
  .insertAdjacentHTML(
    'beforeend',
    `<a href="#" class="link-test">Click to render recipe</a>`
  );
document.addEventListener('click', function (e) {
  if (!e.target.closest('.link-test')) return;
  window.location.hash = '607037fa5bf80000177575a7';
  window.location.pathname = 'index.html';
});
