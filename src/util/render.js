import Abstract from '../view/abstract.js';


const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTER: 'after',
  BEFORE: 'before',
};


const render = (element, insertedElement, place = RenderPosition.BEFOREEND) => {
  if (element instanceof Abstract) {
    element = element.getElement();
  }

  if (insertedElement instanceof Abstract) {
    insertedElement = insertedElement.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      element.prepend(insertedElement);
      break;
    case RenderPosition.BEFOREEND:
      element.append(insertedElement);
      break;
    case RenderPosition.AFTER:
      element.after(insertedElement);
      break;
    case RenderPosition.BEFORE:
      element.before(insertedElement);
      break;
    default:
      throw new Error('invalid value for the place parameter');
  }
};


const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};


const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};


export {render, remove, replace, createElement, RenderPosition};
