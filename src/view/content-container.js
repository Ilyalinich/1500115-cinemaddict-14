import {createElement} from '../util.js';


export default class ContentContainer {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return '<section class="films"></section>';
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
