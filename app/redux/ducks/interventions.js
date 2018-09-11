import apiClient from 'panoptes-client/lib/api-client';
import { sugarClient } from 'panoptes-client/lib/sugar';
import { prependSubjects } from './classify';

const ADD_NOTIFICATION = 'pfe/interventions/ADD_NOTIFICATION';
const DISMISS_NOTIFICATION = 'pfe/interventions/DISMISS_NOTIFICATION';
const ERROR = 'pfe/interventions/ERROR';
const FETCH_SUBJECTS = 'pfe/interventions/FETCH_SUBJECTS';
const SUBSCRIBE = 'pfe/interventions/SUBSCRIBE';
const UNSUBSCRIBE = 'pfe/interventions/UNSUBSCRIBE';

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

export function notify(notification) {
  const { message } = notification.data;
  const { type } = message;
  if (type === 'subject_queue') {
    const subjectIDs = message.subject_ids;
    const workflowID = message.workflow_id;
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
  } else {
    return { type: ADD_NOTIFICATION, payload: notification };
  }
}

export function dismiss() {
  return { type: DISMISS_NOTIFICATION };
}

export function injectSubjects() {
  // Get new subjects and add them to the subject queue
}

