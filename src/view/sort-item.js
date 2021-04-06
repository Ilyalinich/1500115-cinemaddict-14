export const creteSortItemTemplate = (name, isSelected) =>
  `<li>
    <a href="#"
      class="sort__button ${isSelected ? 'sort__button--active' : ''}">
      ${name}
    </a>
  </li>`;
