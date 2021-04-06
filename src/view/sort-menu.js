import {creteSortItemTemplate} from './sort-item.js';

export const createSortMenuTemplate = () => {
  const sortItemNames = ['Sort by default', 'Sort by date', 'Sort by rating'];
  const sortItemsTemplate = sortItemNames
    .map((name, index) => creteSortItemTemplate(name, index === 0))
    .join('');

  return `<ul class="sort">
    ${sortItemsTemplate}
  </ul>`;
};
