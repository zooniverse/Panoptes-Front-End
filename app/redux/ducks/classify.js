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

  // If the user hasn't interacted with a classification resource before,
  // we won't know how to resolve its links, so attach these manually.
  classification._workflow = workflow;
  classification._subjects = [subject];

  return classification;
}

const initialState = {
  currentClassifications: {
    forWorkflow: {}
  },
  subject: null,
  upcomingSubjects: {
    forWorkflow: {}
  }
};

const ADD_SUBJECTS = 'pfe/classify/ADD_SUBJECTS';
const FETCH_SUBJECTS = 'pfe/classify/FETCH_SUBJECTS';
const NEXT_SUBJECT = 'pfe/classify/NEXT_SUBJECT';
const CREATE_CLASSIFICATION = 'pfe/classify/CREATE_CLASSIFICATION';
const RESET_CLASSIFICATION = 'pfe/classify/RESET_CLASSIFICATION';
const RESET_SUBJECTS = 'pfe/classify/RESET_SUBJECTS';

export default function reducer(state = initialState, action = {}) {
  const { currentClassifications, upcomingSubjects, subject } = state;
  switch (action.type) {
    case ADD_SUBJECTS: {
      const { subjects, workflow_id } = action.payload;
      if (!upcomingSubjects.forWorkflow[workflow_id]) {
        upcomingSubjects.forWorkflow[workflow_id] = [];
      }
      upcomingSubjects.forWorkflow[workflow_id].push(...subjects);
      return Object.assign({}, state, { upcomingSubjects });
    }
    case NEXT_SUBJECT: {
      const { subject } = action.payload;
      return Object.assign({}, state, { subject });
    }
    case CREATE_CLASSIFICATION: {
      const { project, workflow } = action.payload;
      if (upcomingSubjects.forWorkflow[workflow.id] && upcomingSubjects.forWorkflow[workflow.id].length > 0) {
        const subject = upcomingSubjects.forWorkflow[workflow.id].shift();
        const classification = createNewClassification(project, workflow, subject);
        const forWorkflow = Object.assign({}, currentClassifications.forWorkflow);
        forWorkflow[workflow.id] = classification;
        return Object.assign({}, state, { upcomingSubjects, subject, currentClassifications: { forWorkflow } });
      }
      return state;
    }
    case RESET_CLASSIFICATION: {
      const { workflow } = action.payload;
      currentClassifications.forWorkflow[workflow.id] = null;
      return Object.assign({}, state, { currentClassifications });
    }
    case RESET_SUBJECTS: {
      Object.keys(upcomingSubjects.forWorkflow).forEach((workflowID) => {
        const queue = upcomingSubjects.forWorkflow[workflowID];
        queue.forEach(subject => subject.destroy());
        queue.splice(0);
      });
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
    dispatch({ type: FETCH_SUBJECTS });
    return awaitSubjects
    .then(subjects => dispatch({
      type: ADD_SUBJECTS,
      payload: {
        subjects,
        workflow_id: workflow.id
      }
    }));
  };
}

export function nextSubject(subject) {
  return {
    type: NEXT_SUBJECT,
    payload: { subject }
  };
}
export function createClassification(project, workflow) {
  return {
    type: CREATE_CLASSIFICATION,
    payload: { project, workflow }
  };
}

export function resetClassification(workflow) {
  return {
    type: RESET_CLASSIFICATION,
    payload: { workflow }
  };
}

export function resumeClassification(classification) {
  const awaitSubject = classification._subjects ?
    Promise.resolve(classification._subjects) :
    apiClient.type('subjects').get(classification.links.subjects);
  
  return (dispatch) => {
    return awaitSubject.then(([subject]) => {
      dispatch({
        type: NEXT_SUBJECT,
        payload: { subject }
      })
    });
  }
}

