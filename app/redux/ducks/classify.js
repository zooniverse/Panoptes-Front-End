import apiClient from 'panoptes-client/lib/api-client';
import seenThisSession from '../../lib/seen-this-session';

const initialState = {
  subject: null,
  upcomingSubjects: {
    forWorkflow: {}
  }
};

const ADD_SUBJECTS = 'pfe/classify/ADD_SUBJECTS';
const FETCH_SUBJECTS = 'pfe/classify/FETCH_SUBJECTS';
const NEXT_SUBJECT = 'pfe/classify/NEXT_SUBJECT';
const RESET_SUBJECTS = 'pfe/classify/RESET_SUBJECTS';

export default function reducer(state = initialState, action = {}) {
  const { upcomingSubjects } = state;
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
      const { workflow_id } = action.payload;
      if (upcomingSubjects.forWorkflow[workflow_id] && upcomingSubjects.forWorkflow[workflow_id].length > 0) {
        const subject = upcomingSubjects.forWorkflow[workflow_id].shift();
        return Object.assign({}, state, { upcomingSubjects, subject });
      }
      return state;
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

export function fetchSubjects(subjectSet, workflow, subjectToLoad) {
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
    const nonLoadedSubjects = subjects.filter(newSubject => newSubject !== subjectToLoad);
    const filteredSubjects = nonLoadedSubjects.filter((nonLoadedSubject) => {
      const notSeen = !nonLoadedSubject.already_seen &&
        !nonLoadedSubject.retired &&
        !seenThisSession.check(workflow, nonLoadedSubject);
      return notSeen;
    });
    const subjectsToLoad = (filteredSubjects.length > 0) ? filteredSubjects : nonLoadedSubjects;
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

export function nextSubject(workflow_id) {
  return {
    type: NEXT_SUBJECT,
    payload: { workflow_id }
  };
}
