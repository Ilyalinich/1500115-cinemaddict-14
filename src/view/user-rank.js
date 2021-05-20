import AbstractView from './abstract.js';


export default class UserRank extends AbstractView {
  constructor(value) {
    super();
    this._value = value;
  }

  getTemplate() {
    return `<section class="header__profile profile">
    <p class="profile__rating">${this._value}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
  }

  update(newValue) {
    this.getElement().querySelector('.profile__rating').textContent = newValue;
  }
}
