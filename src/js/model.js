import { async } from 'regenerator-runtime';
import {
  API_URL,
  KEY,
  SPOONACULAR_API_KEY,
  SPOONACULAR_ENDPOINT,
} from './config.js';
import { RES_PER_PAGE } from './config.js';
import { SERVINGS_TO_UPLOAD } from './config.js';
import { AJAX, formatIngredientsArr } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
  ingredientsList: [],
  userLists: [
    // { id: ''
    //   title: '',
    //   items: [],
    // },
  ],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
    // does key: recipe.key if the key exists
  };
};

const getTotalNutrientAmount = function (ingredientsArr, nutrient) {
  return ingredientsArr
    .map(
      ing =>
        ing.nutrition?.nutrients.find(
          nutr => nutr.title === nutrient[0].toUpperCase() + nutrient.slice(1)
        )?.amount ?? 0
    )
    .reduce((acc, ingNutr) => acc + ingNutr, 0);
};

const createListID = function () {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    //Check for bookmarks
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;

    const ingredientList = state.recipe.ingredients
      .map(ing => `${ing.quantity ?? ''} ${ing.unit ?? ''} ${ing.description}`)
      .join('\n');

    const ingredientsData = await AJAX(
      `${SPOONACULAR_ENDPOINT}?apiKey=${SPOONACULAR_API_KEY}`,
      {
        ingredientList: ingredientList,
        servings: state.recipe.servings,
        includeNutrition: true,
      },
      'application/x-www-form-urlencoded'
    );
    const calories = getTotalNutrientAmount(ingredientsData, 'calories');
    const carbs = getTotalNutrientAmount(ingredientsData, 'carbohydrates');
    const proteins = getTotalNutrientAmount(ingredientsData, 'protein');
    const fats = getTotalNutrientAmount(ingredientsData, 'fat');
    state.recipe.calories = Math.floor(calories / state.recipe.servings);
    state.recipe.carbs = Math.floor(carbs / state.recipe.servings);
    state.recipe.proteins = Math.floor(proteins / state.recipe.servings);
    state.recipe.fats = Math.floor(fats / state.recipe.servings);

    // console.log(state.recipe);
  } catch (err) {
    if (err.message.slice(-3) === '402') {
      state.recipe.calories = undefined;
      state.recipe.carbs = undefined;
      state.recipe.proteins = undefined;
      state.recipe.proteins = undefined;
    }

    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search, (query = query);
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    state.search.page = 1;
  } catch (err) {
    console.error(`${err} ⚠⚠⚠`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  //Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //Mark current recipe as not bookmarked
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  persistBookmarks();
};

const clearBookmarks = function () {
  localStorage.removeItem('bookmarks');
};

export const uploadRecipe = async function (newRecipe) {
  try {
    //Getting the ingredients from the form
    const ingredients = formatIngredientsArr(newRecipe);

    // Preparing the recipe object for API POST request
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: SERVINGS_TO_UPLOAD,
      ingredients,
    };
    const data = await AJAX(
      `${API_URL}?key=${KEY}`,
      recipe,
      `application/json`
    );

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const persistIngredients = function () {
  localStorage.setItem('ingredients', JSON.stringify(state.ingredientsList));
};

export const clearIngredients = function () {
  localStorage.removeItem('ingredients');
};

export const addIngredient = function (ingredient) {
  state.ingredientsList.push(ingredient);
  persistIngredients();
};

export const removeIngredient = function (ingredient) {
  const ingIndex = state.ingredientsList.findIndex(
    ing => ing.trim() === ingredient.trim()
  );
  state.ingredientsList.splice(ingIndex, 1);
  persistIngredients();
};

const persistUserLists = function () {
  localStorage.setItem('userLists', JSON.stringify(state.userLists));
};
const clearUserLists = function () {
  localStorage.removeItem('userLists');
};
export const addUserList = function (listData) {
  //Compute listData
  const [title, ...itemsEntries] = listData;
  const items = itemsEntries.map(entr => entr[1]).filter(item => item != '');
  const list = { id: createListID(), title: title[1], items };

  //Add to state and to local storage
  state.userLists.push(list);
  // persistUserLists();
};

const init = function () {
  const bookmarksStorage = localStorage.getItem('bookmarks');
  const ingListStorage = localStorage.getItem('ingredients');
  const userListsStorage = localStorage.getItem('userLists');
  if (bookmarksStorage) state.bookmarks = JSON.parse(bookmarksStorage);
  if (ingListStorage) state.ingredientsList = JSON.parse(ingListStorage);
  if (userListsStorage) state.userLists = JSON.parse(userListsStorage);
};
init();
// clearUserLists();
