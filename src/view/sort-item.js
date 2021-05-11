export const creteSortItemTemplate = (type, currentSortType) =>
  `<li>
    <a href="#"
      class="sort__button ${type === currentSortType ? 'sort__button--active' : ''}"
      data-sort-type="${type}">
      ${type}
    </a>
  </li>`;
