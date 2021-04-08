import {creteSortItemTemplate} from './sort-item.js';

const SORT_ITEM_NAMES = ['Sort by default', 'Sort by date', 'Sort by rating'];

export const createSortMenuTemplate = () => {
  const sortItemsTemplate = SORT_ITEM_NAMES
    .map((name, index) => creteSortItemTemplate(name, index === 0))
    .join('');

  return `<ul class="sort">
    ${sortItemsTemplate}
  </ul>`;
};
