import {createElement} from '../util.js';


const createContentContainerTemplate = () => '<section class="films"></section>';


export default class ContentContainer {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createContentContainerTemplate();
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
