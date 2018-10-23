import apiClient from 'panoptes-client/lib/api-client';
import counterpart from 'counterpart';
import GridTool from '../../classifier/drawing-tools/grid';
import { getSessionID } from '../../lib/session';
import seenThisSession from '../../lib/seen-this-session';
import tasks from '../../classifier/tasks';

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

function createNewClassification(project, workflow, subject, goldStandardMode) {
  const source = subject.metadata.intervention ? 'sugar' : 'api';
  const classification = apiClient.type('classifications').create({
    annotations: [],
    metadata: {
      workflow_version: workflow.version,
      started_at: (new Date()).toISOString(),
      user_agent: navigator.userAgent,
      user_language: counterpart.getLocale(),
      utc_offset: ((new Date()).getTimezoneOffset() * 60).toString(), // In seconds
      subject_dimensions: (subject.locations.map(() => null)),
      source
    },
    links: {
      project: project.id,
      workflow: workflow.id,
      subjects: [subject.id]
    }
  });

  if (goldStandardMode) {
    classification.gold_standard = true;
  }

  return classification;
}

function completeAnnotations(workflow, annotations) {
  // take care of any task-specific processing of the annotations array before submitting a classification
  const currentAnnotation = annotations[annotations.length - 1];
  const currentTask = workflow.tasks[currentAnnotation.task];

  if (currentTask && currentTask.tools) {
    currentTask.tools.map((tool) => {
      if (tool.type === 'grid') {
        GridTool.mapCells(annotations);
      }
    });
  }

  if (currentAnnotation.shortcut) {
    const unlinkedTask = workflow.tasks[currentTask.unlinkedTask];
    const unlinkedAnnotation = tasks[unlinkedTask.type].getDefaultAnnotation(unlinkedTask, workflow, tasks);
    unlinkedAnnotation.task = currentTask.unlinkedTask;
    unlinkedAnnotation.value = currentAnnotation.shortcut.value.slice();
    delete currentAnnotation.shortcut;
    annotations.push(unlinkedAnnotation);
  }
  return annotations;
}

function finishClassification(workflow, classification, annotations) {
  return classification.update({
    annotations: completeAnnotations(workflow, annotations),
    'metadata.session': getSessionID(),
    'metadata.finished_at': (new Date()).toISOString(),
    completed: true
  });
}

const initialState = {
  classification: null,
  goldStandardMode: false,
  upcomingSubjects: [],
  workflow: null
};

const APPEND_SUBJECTS = 'pfe/classify/APPEND_SUBJECTS';
const FETCH_SUBJECTS = 'pfe/classify/FETCH_SUBJECTS';
const PREPEND_SUBJECTS = 'pfe/classify/PREPEND_SUBJECTS';
const COMPLETE_CLASSIFICATION = 'pfe/classify/COMPLETE_CLASSIFICATION';
const CREATE_CLASSIFICATION = 'pfe/classify/CREATE_CLASSIFICATION';
const UPDATE_CLASSIFICATION = 'pfe/classify/UPDATE_CLASSIFICATION';
const NEXT_SUBJECT = 'pfe/classify/NEXT_SUBJECT';
const RESUME_CLASSIFICATION = 'pfe/classify/RESUME_CLASSIFICATION';
const RESET_SUBJECTS = 'pfe/classify/RESET_SUBJECTS';
const SAVE_ANNOTATIONS = 'pfe/classify/SAVE_ANNOTATIONS';
const SET_WORKFLOW = 'pfe/classify/SET_WORKFLOW';
const TOGGLE_GOLD_STANDARD = 'pfe/classify/TOGGLE_GOLD_STANDARD';

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
    case COMPLETE_CLASSIFICATION: {
      const { annotations } = action.payload;
      const classification = finishClassification(state.workflow, state.classification, annotations);
      return Object.assign({}, state, { classification });
    }
    case CREATE_CLASSIFICATION: {
      const { goldStandardMode } = state;
      const { project } = action.payload;
      const { workflow } = state;
      if (state.upcomingSubjects.length > 0) {
        const subject = state.upcomingSubjects[0];
        const classification = createNewClassification(project, workflow, subject, goldStandardMode);
        return Object.assign({}, state, { classification });
      }
      return state;
    }
    case UPDATE_CLASSIFICATION: {
      const metadata = Object.assign({}, state.classification.metadata, action.payload.metadata);
      const classification = state.classification.update({ metadata });
      return Object.assign({}, state, { classification });
    }
    case NEXT_SUBJECT: {
      const { goldStandardMode } = state;
      const { project } = action.payload;
      const { workflow } = state;
      const upcomingSubjects = state.upcomingSubjects.slice();
      upcomingSubjects.shift();
      const subject = upcomingSubjects[0];
      if (subject) {
        const classification = createNewClassification(project, workflow, subject, goldStandardMode);
        return Object.assign({}, state, { classification, upcomingSubjects });
      }
      return Object.assign({}, state, {
        classification: null,
        upcomingSubjects: []
      });
    }
    case PREPEND_SUBJECTS: {
      const { subjects, workflowID } = action.payload;
      const { workflow } = state;
      if (workflow && workflow.id === workflowID) {
        const subjectQueue = state.upcomingSubjects.slice();
        const currentSubject = subjectQueue.shift();
        subjectQueue.unshift(currentSubject, ...subjects);
        const upcomingSubjects = subjectQueue.filter(Boolean);
        return Object.assign({}, state, { upcomingSubjects });
      }
      return state;
    }
    case RESUME_CLASSIFICATION: {
      const { classification, subject } = action.payload;
      const isCurrentSubject = state.upcomingSubjects[0] &&
        subject.id === state.upcomingSubjects[0].id;
      if (!isCurrentSubject) {
        const upcomingSubjects = state.upcomingSubjects.slice();
        upcomingSubjects.unshift(subject);
        return Object.assign({}, state, { classification, upcomingSubjects });
      }
      return Object.assign({}, state, { classification });
    }
    case RESET_SUBJECTS: {
      const classification = null;
      const upcomingSubjects = state.upcomingSubjects.slice();
      upcomingSubjects.forEach(subject => subject.destroy());
      upcomingSubjects.splice(0);
      return Object.assign({}, state, { classification, upcomingSubjects });
    }
    case SAVE_ANNOTATIONS: {
      const { annotations } = action.payload;
      const classification = state.classification.update({ annotations });
      return Object.assign({}, state, { classification });
    }
    case SET_WORKFLOW: {
      const { workflow } = action.payload;
      return Object.assign({}, state, { workflow });
    }
    case TOGGLE_GOLD_STANDARD: {
      const { goldStandard } = action.payload;
      const { classification } = state;
      classification.update({ gold_standard: goldStandard });
      return Object.assign({}, state, { classification, goldStandardMode: goldStandard });
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

export function completeClassification(annotations) {
  return {
    type: COMPLETE_CLASSIFICATION,
    payload: { annotations }
  };
}

export function updateClassification(metadata) {
  return {
    type: UPDATE_CLASSIFICATION,
    payload: { metadata }
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
        payload: {
          classification,
          subject
        }
      });
    });
  };
}

export function saveAnnotations(annotations) {
  return {
    type: SAVE_ANNOTATIONS,
    payload: { annotations }
  };
}

export function setWorkflow(workflow) {
  return {
    type: SET_WORKFLOW,
    payload: { workflow }
  };
}

export function toggleGoldStandard(goldStandard) {
  return {
    type: TOGGLE_GOLD_STANDARD,
    payload: { goldStandard }
  };
}
