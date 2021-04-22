import AbstractView from './abstract.js';


export default class FilmsCounter extends AbstractView {
  constructor(filmsCount) {
    super();
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return `<p>${this._filmsCount.toLocaleString()} movies inside</p>`;
  }
}
