class ThemeView {
  _parentElement = document.documentElement;
  _sliderBtn = document.querySelector('.slider');

  setTheme(theme) {
    this._parentElement.dataset.theme = theme;
    this._sliderBtn.querySelector('.slider__circle').style.left =
      theme === 'dark' ? '4.5rem' : '1rem';
  }
  addHandlerChangeTheme(handler) {
    this._sliderBtn.addEventListener('click', function () {
      const actualTheme = document.documentElement.dataset.theme;
      console.log(actualTheme);
      handler(actualTheme);
    });
  }
}

export default new ThemeView();
