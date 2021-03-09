import apiClient from 'panoptes-client/lib/api-client';
import { sugarClient } from 'panoptes-client/lib/sugar';

import { emptySubjectQueue } from './ducks/classify';
import { processIntervention } from './ducks/interventions';
import configureStore from './store';

function onSubjectSetChange(store) {
  store.dispatch(emptySubjectQueue());
}

function onInterventionMessage(store, message) {
  store.dispatch(processIntervention(message));
}

export default function initStore() {
  const store = configureStore();
  apiClient.type('subject_sets').listen('add-or-remove', () => onSubjectSetChange(store));
  sugarClient.on('experiment', message => onInterventionMessage(store, message));
  return store;
}

