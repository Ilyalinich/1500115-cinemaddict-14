import AbstractView from './abstract.js';


export default class UserRank extends AbstractView {
  constructor(userRank) {
    super();
    this._userRank = userRank;
  }

  getTemplate() {
    return `<section class="header__profile profile">
    <p class="profile__rating">${this._userRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
  }
}
