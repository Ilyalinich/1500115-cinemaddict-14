import AbstractView from './abstract.js';


export default class FilmsCounter extends AbstractView {
  constructor(count) {
    super();
    this._count = count;
  }

  getTemplate() {
    return `<p>${this._count.toLocaleString()} movies inside</p>`;
  }

  update(count) {
    this.getElement().textContent = `${count} movies inside`;
  }
}
