import View from './View.js';
import icons from 'url:../../img/icons.svg';

class ListView extends View {
  _parentElement = document.querySelector('.list__shopping-list');
  _message =
    'Choose a recipe and start adding some ingredients to your shopping list!';

  addHandlerRenderList(handler) {
    window.addEventListener('load', handler);
    this.renderMessage();
  }

  addHandlerListAction(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--tiny');
      if (!btn) return;
      const ingredient = e.target
        .closest('.list__item')
        .querySelector('.list__ing').innerText;
      handler(ingredient);
    });
  }

  _generateMarkup() {
    return ` ${this._data.map(this._generateMarkupItem).join('')}`;
  }
  _generateMarkupItem(item) {
    return `
    <li class="list__item">
    <div class="list__ing">${item}</div>
    <div class="list__item-buttons">
      <button class="btn--tiny btn--discard">
        <svg>
          <title>Discard</title>
          <use href="${icons}#icon-minus"></use>
        </svg>
      </button>
      <button class="btn--tiny btn--increase-servings btn--check">
        <svg>
          <title>Check</title>
          <use href="${icons}#icon-checkmark"></use>
        </svg>
      </button>
    </div>
  </li>
    `;
  }
}

export default new ListView();
