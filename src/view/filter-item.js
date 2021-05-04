export const createFilterItemTemplate = ({type, count}, currentFilterType) =>
  `<a href="#${type.toLowerCase()}"
    class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
    data-filter-type="${type}">
    ${type === 'All'
    ? `${type} movies`
    : `${type} <span class="main-navigation__item-count">${count}</span>`}
  </a>`;
