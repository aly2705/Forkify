import icons from 'url:../../img/icons.svg';
import View from './View';
import { maxFourWords } from '../helpers.js';

class PlannerView extends View {
  _parentElement = document.querySelector('.planner__grid');

  addHandlerLoadPlanner(handler) {
    window.addEventListener('load', handler);
  }

  addHandlerResetPlanner(handler) {
    document
      .querySelector('.page-options__btn--reset-calendar')
      .addEventListener('click', handler);
  }

  _generateMarkup() {
    return this._data.currentWeek
      .map((day, i) =>
        day.map((meal, j) => this._generatePlannerCell(i, j, meal)).join('')
      )
      .join('');
  }

  _generatePlannerCell(i, j, meal) {
    const id = window.location.hash;
    return `
      <div class="planner__recipe planner__recipe--${i + 1}${j + 1}">
        ${
          !meal
            ? ''
            : `
        <a class="planned__link ${
          id === meal.id ? 'planned__link--active' : ''
        }" href="${meal.id}">
            <figure class="planned__fig">
                <img src="${meal.img}" alt="${meal.title}" />
            </figure>
            <h4 class="planned__title">${maxFourWords(meal.title)}</h4>
            <div class="planned__remove-btn">
              <svg>
                <use href="${icons}#icon-bin"></use>
              </svg>
            </div>
        </a>
        `
        }   
      </div>
      `;
  }
}

export default new PlannerView();
