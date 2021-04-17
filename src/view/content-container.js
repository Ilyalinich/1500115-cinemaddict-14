import AbstractView from './abstract.js';


export default class ContentContainer extends AbstractView{
  getTemplate() {
    return '<section class="films"></section>';
  }
}
