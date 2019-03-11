import apiClient from 'panoptes-client/lib/api-client';
import { sugarClient } from 'panoptes-client/lib/sugar';
import { addIntervention, prependSubjects } from './classify';

const ERROR = 'pfe/interventions/ERROR';
const FETCH_SUBJECTS = 'pfe/interventions/FETCH_SUBJECTS';
const SUBSCRIBE = 'pfe/interventions/SUBSCRIBE';
const UNSUBSCRIBE = 'pfe/interventions/UNSUBSCRIBE';

const initialState = {
  error: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ERROR: {
      const error = action.payload;
      return Object.assign({}, state, { error });
    }
    case SUBSCRIBE:
      sugarClient.subscribeTo(action.payload);
      return state;
    case UNSUBSCRIBE:
      sugarClient.unsubscribeFrom(action.payload);
      return state;
    default:
      return state;
  }
}

export function subscribe(channel) {
  return { type: SUBSCRIBE, payload: channel };
}

export function unsubscribe(channel) {
  return { type: UNSUBSCRIBE, payload: channel };
}

function reportError(message) {
  return { type: ERROR, payload: message };
}

function prependSubjectQueue(data) {
  const subjectIDs = data.subject_ids;
  const workflowID = data.workflow_id;
  return (dispatch) => {
    dispatch({
      type: FETCH_SUBJECTS,
      payload: subjectIDs
    });
    apiClient.type('subjects').get(subjectIDs)
    .catch((error) => {
      dispatch(reportError(error));
      return [];
    })
    .then(subjects => subjects.map((subject) => {
      /* record that this subject was added by an intervention, rather than
      queued from the API. */
      subject.update({ 'metadata.intervention': true });
      return subject;
    }))
    .then((subjects) => {
      dispatch(prependSubjects(subjects, workflowID));
    });
  };
}

export function processIntervention(message) {
  // Example message data from sugar
  // {
  //  channel: "user:27"
  //    data: {
  //      event: "intervention",
  //      event_type: "message",
  //      message: "You are a star! All of your contributions really help.",
  //      project_id: "908",
  //      type: "experiment",
  //      user_id: "27",
  //    }
  //  type: "experiment"
  // }

  // Only process known intervention experiment events from sugar.
  var { type = 'unknown' } = message;
  if (type !== "experiment") {
    return reportError("Unexpected message on user experiment channel");
  };

  var { data = 'missing' } = message;
  if (data === 'missing') {
    return reportError("Missing data object in message");
  };

  var { event = 'unknown' } = data;
  if (event !== 'intervention') {
    return reportError("Unknown intervention event message")
  };

  // If required, this is where checks for correct user
  // and other sugar channel payload checking can be added

  const { event_type } = data;

  switch(event_type) {
    case 'message':
      return addIntervention(data);
      break;
    case 'subject_queue':
      return prependSubjectQueue(data);
      break;
    default:
      return reportError("Unknown intervention event type, expected 'message' or 'subject_queue'")
  }
}

