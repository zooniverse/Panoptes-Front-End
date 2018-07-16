import { sugarClient } from 'panoptes-client/lib/sugar';

const ADD_NOTIFICATION = 'pfe/interventions/ADD_NOTIFICATION';
const SUBSCRIBE = 'pfe/interventions/SUBSCRIBE';
const UNSUBSCRIBE = 'pfe/interventions/UNSUBSCRIBE';

const initialState = {
  notifications: []
};

export default function reducer(state = initialState, action = {}) {
  const { notifications } = state;
  switch (action.type) {
    case ADD_NOTIFICATION:
      notifications.push(action.payload);
      return Object.assign({}, state, { notifications });
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

export function notify(message) {
  // Do something with notifications
  return { type: ADD_NOTIFICATION, payload: message };
}

export function injectSubjects() {
  // Get new subjects and add them to the subject queue
}

sugarClient.on('notification', notify);
sugarClient.on('subject-queue', injectSubjects);

