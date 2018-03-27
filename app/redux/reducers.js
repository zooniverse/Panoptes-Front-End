import { combineReducers } from 'redux';

import feedback from './ducks/feedback';
import translations from './ducks/translations';
import userInterface from './ducks/userInterface';

export default combineReducers({
  feedback,
  translations,
  userInterface
});
