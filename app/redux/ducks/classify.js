import apiClient from 'panoptes-client/lib/api-client';
import counterpart from 'counterpart';
import seenThisSession from '../../lib/seen-this-session';

function awaitSubjects(subjectQuery) {
  return apiClient.get('/subjects/queued', subjectQuery)
  .catch((error) => {
    if (error.message.indexOf('please try again') === -1) {
      throw error;
    } else {
      return new Promise((resolve, reject) => {
        const fetchSubjectsAgain = (() => apiClient.get('/subjects/queued', subjectQuery)
        .then(resolve)
        .catch(reject));
        setTimeout(fetchSubjectsAgain, 2000);
      });
    }
  });
}

function awaitSubjectSet(workflow) {
  if (workflow.grouped) {
    return workflow.get('subject_sets').then((subjectSets) => {
      const randomIndex = Math.floor(Math.random() * subjectSets.length);
      return subjectSets[randomIndex];
    });
  } else {
    return Promise.resolve();
  }
}

function createNewClassification(project, workflow, subject) {
  const classification = apiClient.type('classifications').create({
    annotations: [],
    metadata: {
      workflow_version: workflow.version,
      started_at: (new Date()).toISOString(),
      user_agent: navigator.userAgent,
      user_language: counterpart.getLocale(),
      utc_offset: ((new Date()).getTimezoneOffset() * 60).toString(), // In seconds
      subject_dimensions: (subject.locations.map(() => null))
    },
    links: {
      project: project.id,
      workflow: workflow.id,
      subjects: [subject.id]
    }
  });

  return classification;
}

const initialState = {
  classification: null,
  upcomingSubjects: [],
  workflow: null
};

const APPEND_SUBJECTS = 'pfe/classify/APPEND_SUBJECTS';
const FETCH_SUBJECTS = 'pfe/classify/FETCH_SUBJECTS';
const PREPEND_SUBJECTS = 'pfe/classify/PREPEND_SUBJECTS';
const CREATE_CLASSIFICATION = 'pfe/classify/CREATE_CLASSIFICATION';
const NEXT_SUBJECT = 'pfe/classify/NEXT_SUBJECT';
const RESUME_CLASSIFICATION = 'pfe/classify/RESUME_CLASSIFICATION';
const RESET_SUBJECTS = 'pfe/classify/RESET_SUBJECTS';
const SET_WORKFLOW = 'pfe/classify/SET_WORKFLOW';

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case APPEND_SUBJECTS: {
      const { subjects, workflowID } = action.payload;
      const { workflow } = state;
      if (workflow && workflow.id === workflowID) {
        const upcomingSubjects = state.upcomingSubjects.slice();
        upcomingSubjects.push(...subjects);
        return Object.assign({}, state, { upcomingSubjects });
      }
      return state;
    }
    case CREATE_CLASSIFICATION: {
      const { project } = action.payload;
      const { workflow } = state;
      if (state.upcomingSubjects.length > 0) {
        const subject = state.upcomingSubjects[0];
        const classification = createNewClassification(project, workflow, subject);
        return Object.assign({}, state, { classification });
      }
      return state;
    }
    case NEXT_SUBJECT: {
      const { project } = action.payload;
      const { workflow } = state;
      const upcomingSubjects = state.upcomingSubjects.slice();
      upcomingSubjects.shift();
      const subject = upcomingSubjects[0];
      if (subject) {
        const classification = createNewClassification(project, workflow, subject);
        return Object.assign({}, state, { classification, upcomingSubjects });
      }
      return Object.assign({}, state, { upcomingSubjects });
    }
    case PREPEND_SUBJECTS: {
      const { subjects, workflowID } = action.payload;
      const { workflow } = state;
      if (workflow && workflow.id === workflowID) {
        const upcomingSubjects = state.upcomingSubjects.slice();
        const currentSubject = upcomingSubjects.shift();
        upcomingSubjects.unshift(currentSubject, ...subjects);
        return Object.assign({}, state, { upcomingSubjects });
      }
      return state;
    }
    case RESUME_CLASSIFICATION: {
      const { subject } = action.payload;
      const isCurrentSubject = state.upcomingSubjects[0] &&
        subject.id === state.upcomingSubjects[0].id;
      if (!isCurrentSubject) {
        const upcomingSubjects = state.upcomingSubjects.slice();
        upcomingSubjects.unshift(subject);
        return Object.assign({}, state, { upcomingSubjects });
      }
      return state;
    }
    case RESET_SUBJECTS: {
      const classification = null;
      const upcomingSubjects = state.upcomingSubjects.slice();
      upcomingSubjects.forEach(subject => subject.destroy());
      upcomingSubjects.splice(0);
      return Object.assign({}, state, { classification, upcomingSubjects });
    }
    case SET_WORKFLOW: {
      const { workflow } = action.payload;
      return Object.assign({}, state, { workflow });
    }
    default:
      return state;
  }
}

export function appendSubjects(subjects, workflowID) {
  return {
    type: APPEND_SUBJECTS,
    payload: {
      subjects,
      workflowID
    }
  };
}

export function prependSubjects(subjects, workflowID) {
  return {
    type: PREPEND_SUBJECTS,
    payload: {
      subjects,
      workflowID
    }
  };
}

export function emptySubjectQueue() {
  return { type: RESET_SUBJECTS };
}

export function fetchSubjects(workflow) {
  return dispatch => awaitSubjectSet(workflow)
    .then((subjectSet) => {
      const subjectQuery = { workflow_id: workflow.id };

      if (subjectSet) {
        subjectQuery.subject_set_id = subjectSet.id;
      }
      dispatch({
        type: FETCH_SUBJECTS,
        payload: subjectQuery
      });
      return subjectQuery;
    })
    .then(awaitSubjects)
    .then((subjects) => {
      const filteredSubjects = subjects.filter((subject) => {
        const notSeen = !subject.already_seen &&
          !subject.retired &&
          !seenThisSession.check(workflow, subject);
        return notSeen;
      });
      const subjectsToLoad = (filteredSubjects.length > 0) ? filteredSubjects : subjects;
      return subjectsToLoad;
    })
    .then(subjects => dispatch({
      type: APPEND_SUBJECTS,
      payload: {
        subjects,
        workflowID: workflow.id
      }
    }));
}

export function createClassification(project) {
  return {
    type: CREATE_CLASSIFICATION,
    payload: { project }
  };
}

export function nextSubject(project) {
  return {
    type: NEXT_SUBJECT,
    payload: { project }
  };
}

export function resumeClassification(classification) {
  const awaitSubject = apiClient.type('subjects').get(classification.links.subjects);

  return (dispatch) => {
    dispatch({
      type: FETCH_SUBJECTS,
      payload: classification.links.subjects
    });
    return awaitSubject.then(([subject]) => {
      dispatch({
        type: RESUME_CLASSIFICATION,
        payload: { subject }
      });
    });
  };
}

export function setWorkflow(workflow) {
  return {
    type: SET_WORKFLOW,
    payload: { workflow }
  };
}

