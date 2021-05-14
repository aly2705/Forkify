import View from './View.js';
import icons from 'url:../../img/icons.svg';

class UserListsView extends View {
  _parentElement = document.querySelector('.user__lists-container');

  addList(markup) {
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }

  _generateMarkup() {
    const currentList = this._data[this._data.length - 1];
    return `
    <div class="user__list  id="${currentList.id}">
        <div class="user__list-img user__list-img--${
          this._data.length % 8
        }">&nbsp;</div>
        <h3 class="list__title"><span>${currentList.title}</span></h3>
        <div class="list__list-container">
          <ul class="user__shopping-list " id="download-${currentList.id}">
          ${currentList.items
            .map(listItem => this._generateMarkupLI(listItem))
            .join('')}
          </ul>
        </div>
        <div class="user__options">
          <button class="btn--user user__btn-edit">
            <svg class="user__icon">
              <use href="${icons}#icon-edit-pencil"></use>
            </svg>
          </button>
          <button class="btn--user user__btn-delete">
            <svg class="user__icon">
              <use href="${icons}#icon-bin"></use>
            </svg>
          </button>
          <button class="btn--user user__btn-download">
            <svg class="user__icon">
              <use href="${icons}#icon-download"></use>
            </svg>
          </button>
        </div>
      </div>
        `;
  }

  _generateMarkupLI(listItem) {
    return `
      <li class="list__item">
              <div class="list__ing">${listItem}</div>
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

export default new UserListsView();
