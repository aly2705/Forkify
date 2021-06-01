class ListBtnsView {
  _buttonFlipFront = document.querySelector('.list__button-flip--front');
  _buttonFlipBack = document.querySelector('.list__button-flip--back');
  _frontSide = document.querySelector('.list__side--front');
  _backSide = document.querySelector('.list__side--back');

  flipToBack() {
    this._frontSide.style.transform = 'rotateY(-180deg)';
    this._backSide.style.transform = 'rotateY(0)';
  }
  flipToFront() {
    this._frontSide.style.transform = 'rotateY(0)';
    this._backSide.style.transform = 'rotateY(180deg)';
  }
  addHandlerFliptoBack(handler) {
    this._buttonFlipFront.addEventListener('click', handler);
  }
  addHandlerFlipToFront(handler) {
    this._buttonFlipBack.addEventListener('click', handler);
  }
}

export default new ListBtnsView();
