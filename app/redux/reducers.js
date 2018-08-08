import { combineReducers } from 'redux';

import classify from './ducks/classify';
import feedback from './ducks/feedback';
import interventions from './ducks/interventions';
import translations from './ducks/translations';
import userInterface from './ducks/userInterface';

export default combineReducers({
  classify,
  feedback,
  interventions,
  translations,
  userInterface
});
