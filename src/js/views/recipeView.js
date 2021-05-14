// import icons from '../img/icons.svg'; //Parcel 1
import icons from 'url:../../img/icons.svg'; //Parcel 2 version
import { Fraction } from 'fractional';
import View from './View.js';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find that recipe. Please try another one!';
  _message;

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');

      if (!btn) return;
      console.log(btn);
      const { updateTo } = btn.dataset;
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  addHandlerAddIngredient(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--add-ing');
      if (!btn) return;
      const ingQuantity = btn
        .closest('.recipe__ingredient')
        .querySelector('.recipe__quantity').innerText;
      const ingUnitAndDescription = btn
        .closest('.recipe__ingredient')
        .querySelector('.recipe__description').innerText;
      handler(`${ingQuantity} ${ingUnitAndDescription}`);
    });
  }

  _generateMarkup() {
    return `
    <figure class="recipe__fig">
      <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          this._data.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          this._data.servings
        }</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings - 1
          }">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings + 1
          }">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>
      <!--
      ${
        this._data.calories
          ? `<div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-bolt"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${this._data.calories}</span>
            <span class="recipe__info-text">kcal/serving</span>
        </div>`
          : ''
      } -->
      <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      <button class="btn--round btn--bookmark">
        <svg class="">
          <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
        </svg>
      </button>
    </div>

    <!-------------------------RENDER RECIPE NUTRIENTS DATA ONLY IF DATA EXISTS-------------------------->
    ${
      this._data.calories &&
      this._data.carbs &&
      this._data.proteins &&
      this._data.fats
        ? `
    <div class="recipe__nutritional-data">  
      <h2 class="heading--2">Nutritional data / serving</h2>
      <div class="recipe__nutrients">
        <div class="recipe__nutrient-field recipe__calories">
          <h3 class="heading--3">Calories</h3>
          <span class="recipe__nutrient-value">${this._data.calories} kcal</span>
        </div>
        <div class="recipe__nutrient-field recipe__carbs">
          <h3 class="heading--3">Carbs</h3>
          <span class="recipe__nutrient-value">${this._data.carbs} g</span>
        </div>
        <div class="recipe__nutrient-field recipe__proteins">
          <h3 class="heading--3">Proteins</h3>
          <span class="recipe__nutrient-value">${this._data.proteins} g</span>
        </div>
        <div class="recipe__nutrient-field recipe__proteins">
          <h3 class="heading--3">Fats</h3>
          <span class="recipe__nutrient-value">${this._data.fats} g</span>
        </div>
      </div>
    </div>
    `
        : ''
    }
    

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
      ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}

      </ul>
      <h5 class="recipe__note">Click on <span>&plus;</span>
              to add an ingredient to <a href='./pages/shoppingList.html'>your shopping list</a>
          </h5>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          this._data.publisher
        }</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href="${this._data.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
`;
  }

  _generateMarkupIngredient(ing) {
    return `
    <li class="recipe__ingredient">
      <svg class="recipe__icon btn--tiny btn--add-ing" >
      <title>Add to shopping list</title>
        <use href="${icons}#icon-plus"></use>
      </svg>
      <div class="recipe__quantity">${
        ing.quantity ? new Fraction(ing.quantity).toString() : ''
      }</div>
      <div class="recipe__description">
        <span class="recipe__unit">${ing.unit}</span>
        ${ing.description}
      </div>
    </li>
    `;
  }
}

export default new RecipeView();
