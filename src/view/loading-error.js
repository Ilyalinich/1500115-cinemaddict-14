import AbstractView from './abstract.js';


export default class LoadingError extends AbstractView {
  getTemplate() {
    return '<p class="loading-error-message">Sorry, the server is temporarily unavailable</p>';
  }
}
