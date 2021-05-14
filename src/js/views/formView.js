import View from './View.js';
import icons from 'url:../../img/icons.svg';

class FormView extends View {
  _parentElement = document.querySelector('.user__lists-container');
  _btnNav = document.querySelector('.page-options__btn--add-list');
  _btnSection = document.querySelector('.section__create-list-btn');
  _form = document.querySelector('.form');

  addHandlerSubmit(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.user__btn-submit');

      if (!btn) return;
      const dataArr = [...new FormData(this.querySelector('.form'))];
      // const data = Object.fromEntries(dataArr);
      handler(dataArr);
    });
  }

  addHandlerAddItem(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.user__btn-add');

      if (!btn) return;

      handler();
    });
  }
  addListItem() {
    const markup = this._generateInputField();
    this._parentElement
      .querySelector('.form__list')
      .insertAdjacentHTML('beforeend', markup);
  }

  addHandlerCreateList(handler) {
    this._btnNav.addEventListener('click', handler);
    this._btnSection.addEventListener('click', function (e) {
      e.preventDefault();
      handler();
    });
  }

  scrollToSection() {
    this._parentElement
      .querySelector('.form')
      .scrollIntoView({ behavior: 'smooth' });
  }

  clearForm() {
    this._parentElement.removeChild(this._parentElement.lastElementChild);
    // this._form.remove();
  }

  renderForm(data) {
    this._data = data;
    const markup = `
      <form class="form">
        <div class="user__list-img user__list-img--${
          (this._data.length % 8) + 1
        }">&nbsp;</div>
        <div class="list__title"><input type='text' class="form__title" placeholder="List Title"  name="title" required></input></div>
        <div class="list__list-container">
          <ul class="user__shopping-list form__list">
            <li class="list__item">
              <input class="list__ing form__input" placeholder="Your item here"  name="item-0" required></input>
              <div class="list__item-buttons">
                <button class="btn--tiny btn--discard">
                  <svg>
                    <use href="${icons}#icon-minus"></use>
                  </svg>
                </button>
              </div>
            </li>

          </ul>
        </div>
        <div class="user__options form__buttons">
          <button class="btn--user">
            <svg class="user__icon user__btn-add">
              <use href="${icons}#icon-plus"></use>
            </svg>
          </button>
          <button class="btn--user user__btn-delete">
            <svg class="user__icon">
              <use href="${icons}#icon-bin"></use>
            </svg>
          </button>
          <button type="submit" class="btn--user user__btn-submit">
            <svg class="user__icon">
              <use href="${icons}#icon-checkmark"></use>
            </svg>
          </button>
        </div>
      </form>
    `;

    if (!this._data[0]) this._clear();

    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }

  _generateInputField() {
    return `
    <li class="list__item">
                  <input class="list__ing form__input" placeholder="Your item here" name="item-1"></input>
                  <div class="list__item-buttons">
                    <button class="btn--tiny btn--discard">
                      <svg>
                        <use href="${icons}#icon-minus"></use>
                      </svg>
                    </button>
                  </div>
                </li>
    `;
  }
}
export default new FormView();
