export default class FeedbackContext {
  constructor() {
    this._feedback = [];
  }

  get items() {
    return this._feedback;
  }

  set items(newFeedback) {
    if (newFeedback) {
      this._feedback = [].concat(newFeedback);
    }
  }
}
