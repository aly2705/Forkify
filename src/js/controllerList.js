import * as model from './model.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import listView from './views/listView.js';
import listBtnsView from './views/listBtnsView.js';
import formView from './views/formView.js';
import userListsView from './views/userListsView.js';

const controlFlipToBack = function () {
  listBtnsView.flipToBack();
};
const controlFlipToFront = function () {
  listBtnsView.flipToFront();
};
const controlDownload = function () {
  const opt = {
    margin: 5,
    filename: 'shoppingList.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 1 },
  };
  html2pdf().set(opt).from(listBtnsView.listToDownload).save();
};

const controlList = function () {
  if (!model.state.ingredientsList[0]) return;
  listView.render(model.state.ingredientsList);
};

const controlClearList = function () {
  if (!model.state.ingredientsList[0]) return;
  model.clearIngredients();
  listView.renderMessage();
  listBtnsView.flipToFront();
};

const controlActionButtons = function (ingredient) {
  console.log(ingredient);
  model.removeIngredient(ingredient);

  if (!model.state.ingredientsList[0]) {
    listView.renderMessage();
    return;
  }
  listView.render(model.state.ingredientsList);
};

const controlListForm = function () {
  formView.renderForm(model.state.userLists);
  formView.scrollToSection();
};

const controlSubmitForm = function (formData) {
  model.addUserList(formData);
  formView.clearForm();
  const list = userListsView.render(model.state.userLists, false);
  console.log(list);
  userListsView.addList(list);
};
const controlAddItem = function () {
  formView.addListItem();
};

const init = function () {
  listView.addHandlerRenderList(controlList);
  listView.addHandlerListAction(controlActionButtons);
  listBtnsView.addHandlerFliptoBack(controlFlipToBack);
  listBtnsView.addHandlerFlipToFront(controlFlipToFront);
  listBtnsView.addHandlerDownload(controlDownload);
  listBtnsView.addHandlerClear(controlClearList);

  formView.addHandlerCreateList(controlListForm);
  formView.addHandlerSubmit(controlSubmitForm);
  formView.addHandlerAddItem(controlAddItem);
};
init();
