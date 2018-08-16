import apiClient from 'panoptes-client/lib/api-client';
import counterpart from 'counterpart';
import seenThisSession from '../../lib/seen-this-session';

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
  upcomingSubjects: []
};

const ADD_SUBJECTS = 'pfe/classify/ADD_SUBJECTS';
const FETCH_SUBJECTS = 'pfe/classify/FETCH_SUBJECTS';
const CREATE_CLASSIFICATION = 'pfe/classify/CREATE_CLASSIFICATION';
const RESET_CLASSIFICATION = 'pfe/classify/RESET_CLASSIFICATION';
const RESUME_CLASSIFICATION = 'pfe/classify/RESUME_CLASSIFICATION';
const RESET_SUBJECTS = 'pfe/classify/RESET_SUBJECTS';

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_SUBJECTS: {
      const { subjects } = action.payload;
      const upcomingSubjects = state.upcomingSubjects.slice();
      upcomingSubjects.push(...subjects);
      return Object.assign({}, state, { upcomingSubjects });
    }
    case CREATE_CLASSIFICATION: {
      const { project, workflow } = action.payload;
      if (state.upcomingSubjects.length > 0) {
        const subject = state.upcomingSubjects[0];
        const classification = createNewClassification(project, workflow, subject);
        return Object.assign({}, state, { classification });
      }
      return state;
    }
    case RESET_CLASSIFICATION: {
      const classification = null;
      const upcomingSubjects = state.upcomingSubjects.slice();
      upcomingSubjects.shift();
      return Object.assign({}, state, { classification, upcomingSubjects });
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
      const upcomingSubjects = state.upcomingSubjects.slice();
      upcomingSubjects.forEach(subject => subject.destroy());
      upcomingSubjects.splice(0);
      return Object.assign({}, state, { upcomingSubjects });
    }
    default:
      return state;
  }
}

export function emptySubjectQueue() {
  return { type: RESET_SUBJECTS };
}

export function fetchSubjects(subjectSet, workflow) {
  const subjectQuery = { workflow_id: workflow.id };

  if (subjectSet) {
    subjectQuery.subject_set_id = subjectSet.id;
  }

  const awaitSubjects = apiClient.get('/subjects/queued', subjectQuery)
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
  })
  .then((subjects) => {
    const filteredSubjects = subjects.filter((subject) => {
      const notSeen = !subject.already_seen &&
        !subject.retired &&
        !seenThisSession.check(workflow, subject);
      return notSeen;
    });
    const subjectsToLoad = (filteredSubjects.length > 0) ? filteredSubjects : subjects;
    return subjectsToLoad;
  });

  return (dispatch) => {
    dispatch({
      type: FETCH_SUBJECTS,
      payload: subjectQuery
    });
    return awaitSubjects
    .then(subjects => dispatch({
      type: ADD_SUBJECTS,
      payload: {
        subjects
      }
    }));
  };
}

export function createClassification(project, workflow) {
  return {
    type: CREATE_CLASSIFICATION,
    payload: { project, workflow }
  };
}

export function resetClassification() {
  return {
    type: RESET_CLASSIFICATION
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

