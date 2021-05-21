const SHOW_TIME = 5000;


const isOnline = () => {
  return window.navigator.onLine;
};

const createOfflineErrorMessage = (messageContainer, message) => {
  const messageBlock = document.createElement('p');
  messageBlock.textContent = message;
  messageBlock.classList.add('offline-error-message');

  messageContainer.append(messageBlock);

  setTimeout(() => {
    messageBlock.remove();
  }, SHOW_TIME);
};

export {isOnline, createOfflineErrorMessage};
