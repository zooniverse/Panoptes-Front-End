import { combineReducers } from 'redux';

import feedback from './ducks/feedback';
import interventions from './ducks/interventions';
import translations from './ducks/translations';
import userInterface from './ducks/userInterface';

export default combineReducers({
  feedback,
  interventions,
  translations,
  userInterface
});
