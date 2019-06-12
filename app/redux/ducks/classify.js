import apiClient from 'panoptes-client/lib/api-client';
import counterpart from 'counterpart';
import GridTool from '../../classifier/drawing-tools/grid';
import { getSessionID } from '../../lib/session';
import seenThisSession from '../../lib/seen-this-session';
import tasks from '../../classifier/tasks';
import * as translations from './translations';

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

function awaitWorkflow(workflowId) {
  // pass an empty query object to bypass the API client's internal cache.
  return apiClient.type('workflows').get(workflowId, {})
    .then((workflow) => {
      if (!workflow) {
        const error = new Error(`workflow ${workflowId}: empty response from Panoptes.`);
        throw error;
      }
      return workflow;
    });
}

function createNewClassification(project, workflow, subject, goldStandardMode, lastInterventionUUID) {
  // Record whether this subject was received from Sugar or from the Panoptes API.
  const source = subject.metadata.intervention ? 'sugar' : 'api';
  // Delete the metadata key because we don't want volunteers to see it.
  subject.update({ 'metadata.intervention': undefined });
  let newMetadata = {
    workflow_version: workflow.version,
    started_at: (new Date()).toISOString(),
    user_agent: navigator.userAgent,
    user_language: counterpart.getLocale(),
    utc_offset: ((new Date()).getTimezoneOffset() * 60).toString(), // In seconds
    subject_dimensions: (subject.locations.map(() => null)),
    source
  }
  // record if this classification had an intervention payload directly before it
  if (lastInterventionUUID) {
    newMetadata.interventions = newMetadata.interventions || {};
    newMetadata.interventions.uuid = lastInterventionUUID
  }
  const classification = apiClient.type('classifications').create({
    annotations: [],
    metadata: newMetadata,
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

function destroySubjects(subjects) {
  subjects.forEach(subject => subject.destroy());
  subjects.splice(0);
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
  intervention: null,
  lastInterventionUUID: null,
  upcomingSubjects: [],
  workflow: null
};

const ADD_INTERVENTION = 'pfe/classify/ADD_INTERVENTION';
const CLEAR_INTERVENTION = 'pfe/classify/CLEAR_INTERVENTION';
const STORE_INTERVENTION_UUID = 'pfe/classify/STORE_INTERVENTION_UUID';
const APPEND_SUBJECTS = 'pfe/classify/APPEND_SUBJECTS';
const FETCH_SUBJECTS = 'pfe/classify/FETCH_SUBJECTS';
const PREPEND_SUBJECTS = 'pfe/classify/PREPEND_SUBJECTS';
const COMPLETE_CLASSIFICATION = 'pfe/classify/COMPLETE_CLASSIFICATION';
const CREATE_CLASSIFICATION = 'pfe/classify/CREATE_CLASSIFICATION';
const UPDATE_METADATA = 'pfe/classify/UPDATE_METADATA';
const NEXT_SUBJECT = 'pfe/classify/NEXT_SUBJECT';
const RESUME_CLASSIFICATION = 'pfe/classify/RESUME_CLASSIFICATION';
const RESET_SUBJECTS = 'pfe/classify/RESET_SUBJECTS';
const SAVE_ANNOTATIONS = 'pfe/classify/SAVE_ANNOTATIONS';
const FETCH_WORKFLOW = 'pfe/classify/FETCH_WORKFLOW';
const RESET = 'pfe/classify/RESET';
const SET_WORKFLOW = 'pfe/classify/SET_WORKFLOW';
const TOGGLE_GOLD_STANDARD = 'pfe/classify/TOGGLE_GOLD_STANDARD';

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_INTERVENTION: {
      // this action payload is the json intervention object from sugar
      const intervention = action.payload;
      const { classification } = state;
      const existingIntervention = state.intervention;
      if (!classification || existingIntervention) {
        return state;
      }
      const { project, workflow } = classification && classification.links;
      const matchesProject = project === intervention.project_id.toString();
      // only test workflow matches known state if the incoming payload has this property
      // to allow project level as well as targetted workflow messages
      let matchesWorkflow = true;
      if (intervention && intervention.workflow_id) {
        matchesWorkflow = workflow === intervention.workflow_id.toString();
      }
      if (matchesProject && matchesWorkflow ) {
        return Object.assign({}, state, { intervention });
      }
      return state;
    }
    case STORE_INTERVENTION_UUID: {
      const { intervention } = state;
      let lastInterventionUUID = null
      if (intervention && intervention.uuid) {
        lastInterventionUUID = intervention.uuid;
      }
      return Object.assign({}, state, { lastInterventionUUID });
    }
    case CLEAR_INTERVENTION: {
      const intervention = null;
      return Object.assign({}, state, { intervention });
    }
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
      const { workflow, subjects } = classification.links;
      seenThisSession.add(workflow, subjects);
      return Object.assign({}, state, { classification });
    }
    case CREATE_CLASSIFICATION: {
      const { goldStandardMode } = state;
      const { project } = action.payload;
      const { workflow } = state;
      let { lastInterventionUUID} = state;
      if (state.upcomingSubjects.length > 0) {
        const subject = state.upcomingSubjects[0];
        const classification = createNewClassification(
          project,
          workflow,
          subject,
          goldStandardMode,
          lastInterventionUUID
        );
        // clear any intervention UUID after we've stored it on the metadata
        lastInterventionUUID = null;
        return Object.assign({}, state, { classification, lastInterventionUUID });
      }
      return state;
    }
    case UPDATE_METADATA: {
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
    case RESET: {
      const upcomingSubjects = state.upcomingSubjects.slice();
      destroySubjects(upcomingSubjects);
      return Object.assign({}, initialState);
    }
    case RESET_SUBJECTS: {
      const classification = null;
      const upcomingSubjects = state.upcomingSubjects.slice();
      destroySubjects(upcomingSubjects);
      return Object.assign({}, state, { classification, upcomingSubjects });
    }
    case SAVE_ANNOTATIONS: {
      const { annotations } = action.payload;
      const classification = state.classification && state.classification.update({ annotations });
      return Object.assign({}, state, { classification });
    }
    case SET_WORKFLOW: {
      const { workflow } = action.payload;
      return Object.assign({}, initialState, { workflow });
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

export function addIntervention(data) {
  return {
    type: ADD_INTERVENTION,
    payload: data
  };
}

export function clearIntervention() {
  return (dispatch) => {
    dispatch({type: STORE_INTERVENTION_UUID});
    dispatch({type: CLEAR_INTERVENTION});
  };
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

export function updateMetadata(metadata) {
  return {
    type: UPDATE_METADATA,
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

export function loadWorkflow(workflowId, locale, preferences) {
  return (dispatch) => {
    if (preferences) {
      preferences.update({ 'preferences.selected_workflow': workflowId });
    }
    dispatch({
      type: FETCH_WORKFLOW,
      payload: {
        workflowId,
        locale
      }
    });
    const awaitTranslation = dispatch(translations.load('workflow', workflowId, locale));
    return Promise.all([awaitWorkflow(workflowId), awaitTranslation])
    .then(([workflow]) => setWorkflow(workflow))
    .catch((error) => {
      const errorType = error.status && parseInt(error.status / 100, 10);
      if (errorType === 4) {
        // Clear all stored preferences if this workflow doesn't exist for this user.
        if (preferences) {
          preferences.update({ 'preferences.selected_workflow': undefined });
          if (preferences.settings && preferences.settings.workflow_id === workflowId) {
            preferences.update({ 'settings.workflow_id': undefined });
          }
        }
      }
      return setWorkflow(null);
    })
    .then((action) => {
      if (preferences) {
        preferences.save();
      }
      return dispatch(action);
    });
  };
}

export function reset() {
  return {
    type: RESET
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
