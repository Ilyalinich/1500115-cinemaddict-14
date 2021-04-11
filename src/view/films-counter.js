import {createElement} from '../util.js';


const createFilmsCounterTemplate = (films) => `<p>${films.length.toLocaleString()} movies inside</p>`;

export default class FilmsCounter {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createFilmsCounterTemplate(this._films);
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
