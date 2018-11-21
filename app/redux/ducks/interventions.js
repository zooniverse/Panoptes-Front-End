import apiClient from 'panoptes-client/lib/api-client';
import { sugarClient } from 'panoptes-client/lib/sugar';
import { prependSubjects } from './classify';

const ADD_NOTIFICATION = 'pfe/interventions/ADD_NOTIFICATION';
const DISMISS_NOTIFICATION = 'pfe/interventions/DISMISS_NOTIFICATION';
const ERROR = 'pfe/interventions/ERROR';
const FETCH_SUBJECTS = 'pfe/interventions/FETCH_SUBJECTS';
const SUBSCRIBE = 'pfe/interventions/SUBSCRIBE';
const UNSUBSCRIBE = 'pfe/interventions/UNSUBSCRIBE';
const UNKNOWN_EXPERIMENT = 'pfe/interventions/UNKNOWN_EXPERIMENT'
const MISSING_DATA = 'pfe/interventions/MISSING_DATA'
const UNKNOWN_EVENT = 'pfe/interventions/UNKNOWN_EVENT'
const UNKNOWN_TYPE = 'pfe/interventions/UNKNOWN_TYPE'

const initialState = {
  error: null,
  notifications: []
};

export default function reducer(state = initialState, action = {}) {
  const { notifications } = state;
  switch (action.type) {
    case ADD_NOTIFICATION:
      notifications.push(action.payload);
      return Object.assign({}, state, { notifications });
    case DISMISS_NOTIFICATION:
      notifications.pop();
      return Object.assign({}, state, { notifications });
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
      dispatch({
        type: ERROR,
        payload: error
      });
      return [];
    })
    .then(subjects => subjects.map((subject) => {
      subject.update({ 'metadata.intervention': true });
      return subject;
    }))
    .then((subjects) => {
      dispatch(prependSubjects(subjects, workflowID));
    });
  };
};

export function intervention(message) {
  // Example payload data from sugar
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
    return { type: UNKNOWN_EXPERIMENT };
  };

  var { data = 'missing' } = message;
  if (data === 'missing') {
    return { type: MISSING_DATA };
  };

  var { event = 'unknown' } = data;
  if (event !== 'intervention') {
    return { type: UNKNOWN_EVENT };
  };

  // If required, this is where checks for correct user
  // and other sugar channel payload checking can be added

  const { event_type } = data;

  switch(event_type) {
    case 'message':
      return { type: ADD_NOTIFICATION, payload: data };
      break;
    case 'subject_queue':
      return prependSubjectQueue(data);
      break;
    default:
      return { type: UNKNOWN_TYPE };
  }
}

export function dismiss() {
  return { type: DISMISS_NOTIFICATION };
}
