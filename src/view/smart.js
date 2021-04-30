import AbstractView from './abstract.js';

export default class Smart extends AbstractView {
  constructor() {
    super();
    this._state = {};
  }

  updateState(update, justStateUpdating) {
    if (!update) {
      return;
    }

    this._state = Object.assign(
      {},
      this._state,
      update,
    );

    if (justStateUpdating) {
      return;
    }

    this.updateElement();
  }

  getScrollPosition() {
    return this.getElement().scrollTop;
  }

  setScrollPosition(position) {
    this.getElement().scrollTop = position;
  }

  updateElement() {
    const prevElement = this.getElement();
    const prevElementScrollValue = this.getScrollPosition();

    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();


    parent.replaceChild(newElement, prevElement);

    this.setScrollPosition(prevElementScrollValue);

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
