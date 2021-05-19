import Observer from '../util/observer.js';
import {FilterType} from '../constant.js';


export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
  }

  set(updateType, filter) {
    this._activeFilter = filter;

    this._notify(updateType, filter);
  }

  getActive() {
    return this._activeFilter;
  }
}
