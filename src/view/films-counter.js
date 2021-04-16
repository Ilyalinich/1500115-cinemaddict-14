import {createElement} from '../util.js';


export default class FilmsCounter {
  constructor(filmsCount) {
    this._filmsCount = filmsCount;
    this._element = null;
  }

  getTemplate() {
    return `<p>${this._filmsCount.toLocaleString()} movies inside</p>`;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this.element = null;
  }
}
