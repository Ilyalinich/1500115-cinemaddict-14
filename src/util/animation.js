import Abstract from '../view/abstract.js';


const SHAKE_ANIMATION_TIMEOUT = 600;


export const shake = (element) => {
  if (element instanceof Abstract) {
    element = element.getElement();
  }

  element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

  setTimeout(() => {
    element.style.animation = '';
  }, SHAKE_ANIMATION_TIMEOUT);
};
