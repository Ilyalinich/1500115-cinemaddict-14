export const creteSortItemTemplate = (type, isSelected) =>
  `<li>
    <a href="#"
      class="sort__button ${isSelected ? 'sort__button--active' : ''}"
      data-sort-type="${type}">
      ${type}
    </a>
  </li>`;
