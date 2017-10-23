import { combineReducers } from 'redux';

import feedback from './ducks/feedback';
import translations from './ducks/translations';

export default combineReducers({
  feedback,
  translations
});
