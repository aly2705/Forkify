import * as model from './model.js';
import recipeView from './views/recipeView.js';
import plannerView from './views/plannerView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controlRecipesPlanner = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.scrollToRecipe();
    recipeView.renderSpinner();

    // 1) Update results view to mark selected search result
    plannerView.render(model.state.planner);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(`${err.message} ⚠⚠⚠`);
    recipeView.renderError();
  }

  // rendering the recipe without the nutritional data
  if (!model.state.recipe.calories) {
    recipeView.render(model.state.recipe);
  }
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlAddToShoppingList = function (ingredient) {
  model.addIngredient(ingredient);
};

const controlPlannerUI = function () {
  plannerView.render(model.state.planner);
};

const controlResetPlanner = function () {
  model.clearPlanner();
  plannerView.render(model.state.planner);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipesPlanner);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddIngredient(controlAddToShoppingList);
  plannerView.addHandlerLoadPlanner(controlPlannerUI);
  plannerView.addHandlerResetPlanner(controlResetPlanner);
};
init();
