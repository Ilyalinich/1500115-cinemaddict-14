export const createFilterItemTemplate = ({name, count}, isSelected) =>
  `<a href="#${name.toLowerCase()}"
    class="main-navigation__item ${isSelected ? 'main-navigation__item--active' : ''}">
    ${name === 'All' ?
    `${name} movies` :
    `${name} <span class="main-navigation__item-count">${count}</span>`}
  </a>`;
