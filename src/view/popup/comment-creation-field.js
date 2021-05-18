import SmartView from '../smart.js';
import he from 'he';


const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];


const createPopupEmojiListTemplate = (newCommentEmotion) =>
  EMOTIONS.map((emotion) =>
    `<input
      class="film-details__emoji-item visually-hidden"
      name="comment-emoji"
      type="radio"
      id="emoji-${emotion}"
      value="${emotion}"
      ${newCommentEmotion === emotion ? 'checked' : ''}>
    <label
      class="film-details__emoji-label"
      for="emoji-${emotion}">
      <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
    </label>`).join('');


const createCommentCreationFieldTemplate = ({emotion, comment}) => {
  return `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
      ${!emotion ? '' : `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">`}
    </div>

    <label class="film-details__comment-label">
      <textarea
        class="film-details__comment-input"
        placeholder="Select reaction below and write comment here"
        name="comment"
      >${!comment ? '' : he.encode(comment)}</textarea>
    </label>

    <div class="film-details__emoji-list">
      ${createPopupEmojiListTemplate(emotion)}
    </div>
  </div>`;
};


export default class CommentCreationField extends SmartView {
  constructor() {
    super();

    this._state = {
      emotion: null,
      comment: null,
    },


    this._emotionChangeHandler = this._emotionChangeHandler.bind(this);
    this._newCommentTextInputHandler = this._newCommentTextInputHandler.bind(this);


    this._setInnerHandlers();
  }

  getTemplate() {
    return createCommentCreationFieldTemplate(this._state);
  }

  restoreViewFunctionality() {
    this._setInnerHandlers();
  }

  resetState() {
    this.updateState(
      {
        emotion: null,
        comment: null,
      },
    );
  }

  enable() {
    this.getElement()
      .querySelectorAll('input[name = comment-emoji], textarea[name = comment]')
      .forEach((interactiveElement) => interactiveElement.disabled = false);
  }

  isNewCommentValid() {
    const {emotion, comment} = this._state;

    return emotion && comment;
  }

  getNewComment() {
    const {emotion, comment} = this._state;

    this.getElement()
      .querySelectorAll('input[name = comment-emoji], textarea[name = comment]')
      .forEach((interactiveElement) => interactiveElement.disabled = true);

    return {
      emotion,
      comment,
    };
  }

  _emotionChangeHandler(evt) {
    this.updateState(
      {
        emotion: evt.target.value,
      },
    );
  }

  _newCommentTextInputHandler(evt) {
    evt.preventDefault();
    this.updateState(
      {
        comment: evt.target.value,
      },
      true,
    );
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelectorAll('input[name = comment-emoji]')
      .forEach((input) => input.addEventListener('click', this._emotionChangeHandler));
    this.getElement()
      .querySelector('textarea[name = comment]')
      .addEventListener('input', this._newCommentTextInputHandler);
  }
}
