const React = require('react');
const PropTypes = require('prop-types');
const createReactClass = require('create-react-class');
const handleInputChange = require('../../lib/handle-input-change').default;
const PromiseRenderer = require('../../components/promise-renderer');
const TriggeredModalForm = require('modal-form/triggered');
const ModalFormDialog = require('modal-form/dialog');
const apiClient = require('panoptes-client/lib/api-client');
const ChangeListener = require('../../components/change-listener');
const RetirementRulesEditor = require('../../components/retirement-rules-editor');
const {Link} = require('react-router');
const MultiImageSubjectOptionsEditor = require('../../components/multi-image-subject-options-editor');
const taskComponents = require('../../classifier/tasks').default;
const AutoSave = require('../../components/auto-save');
const FileButton = require('../../components/file-button');
const WorkflowCreateForm = require('./workflow-create-form');
const workflowActions = require('./actions/workflow');
const classnames = require('classnames');
const ShortcutEditor = require('../../classifier/tasks/shortcut/editor').default;
const FeedbackSection = require('../../features/feedback/lab').default;
const MobileSection = require('./mobile').default;
const SubjectGroupViewerEditor = require('./workflow-components/subject-group-viewer-editor').default;
const SubjectSetLinker = require('./workflow-components/subject-set-linker').default;

const DEMO_SUBJECT_SET_ID = (process.env.NODE_ENV === 'production')
? '6' // Cats
:  '1166'; // Ghosts

const EditWorkflowPage = createReactClass({
  displayName: 'EditWorkflowPage',

  contextTypes: {
    router: PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {
      workflow: null,
      workflowActions
    };
  },

  getInitialState() {
    return {
      selectedTaskKey: this.props.workflow.first_task,
      forceReloader: 0,
      deletionInProgress: false,
      deletionError: null,
      workflowCreationInProgress: false,
      showTaskAddButtons: false
    };
  },

  workflowLink() {
    const [owner, name] = Array.from(this.props.project.slug.split('/'));
    const usingTranscriptionTask = Object.keys(this.props.workflow.tasks).some(taskKey => this.props.workflow.tasks[taskKey].type === 'transcription');
    if (this.canUseTask(this.props.project, "transcription-task") && usingTranscriptionTask) {
      const env = process.env.NODE_ENV;
      return `https://fe-project.zooniverse.org/projects/${owner}/${name}/classify/workflow/${this.props.workflow.id}?env=${env}`;
    } else {
      const viewQuery = {workflow: this.props.workflow.id, reload: this.state.forceReloader};
      return this.context.router.createHref({
        pathname: `/projects/${owner}/${name}/classify`,
        query: viewQuery
      });
    }
  },

  showCreateWorkflow() {
    return this.setState({workflowCreationInProgress: true});
  },

  hideCreateWorkflow() {
    return this.setState({workflowCreationInProgress: false});
  },

  handleWorkflowCreation(workflow) {
    this.hideCreateWorkflow();
    const newLocation = Object.assign({}, this.props.location, {pathname: `/lab/${this.props.project.id}/workflows/${workflow.id}`});
    this.context.router.push(newLocation);
    this.props.project.uncacheLink('workflows');
    return this.props.project.uncacheLink('subject_sets');
  }, // An "expert" subject set is automatically created with each workflow.

  canUseTask(project, task) {
    return Array.from(project.experimental_tools).includes(task);
  },

  handleTaskChange(taskKey, taskDescription) {
    const changes = {};
    changes[`tasks.${taskKey}`] = taskDescription;
    return this.props.workflow.update(changes).save();
  },

  isThereNotADefinedTask() {
    const workflowTasks = Object.keys(this.props.workflow.tasks);
    return workflowTasks.length === 0;
  },

  showTaskAddButtons() {
    return this.setState(prevState => ({ showTaskAddButtons: !prevState.showTaskAddButtons }));
  },

  render() {
    window.editingWorkflow = this.props.workflow;

    const noTasksDefined = Object.keys(this.props.workflow.tasks).length === 0;

    const stats_completeness_type = this.props.workflow.configuration.stats_completeness_type != null ? this.props.workflow.configuration.stats_completeness_type : 'retirement';

    const projectLiveWorkflowActive = this.props.project.live && this.props.workflow.active;
    const projectLiveWorkflowInactive = this.props.project.live && !this.props.workflow.active;
    const disabledIfLive = classnames({ 'disabled-section': projectLiveWorkflowActive });
    const disabledIfWorkflowInactive = classnames({ 'disabled-section': projectLiveWorkflowInactive });
    const taskEditorClasses = classnames({'column': true, 'disabled-section': projectLiveWorkflowActive});

    return "RENDER 1";
  },

  renderTutorials() {
    const projectAndWorkflowTutorials = Promise.all([
      apiClient.type('tutorials').get({project_id: this.props.project.id, page_size: 100}),
      apiClient.type('tutorials').get({workflow_id: this.props.workflow.id, page_size: 100})
    ]);
    return "RENDER 2";
  },

  renderMiniCourses() {
    const projectAndWorkflowTutorials = Promise.all([
      apiClient.type('tutorials').get({project_id: this.props.project.id, page_size: 100, kind: 'mini-course'}),
      apiClient.type('tutorials').get({workflow_id: this.props.workflow.id, page_size: 100, kind: 'mini-course'})
    ]);
    return "RENDER 3";
  },

  getNextTaskID(lastTaskNumber) {
    // The task ID could be random, but we might as well make it sorta meaningful.
    let nextTaskID;
    let nextTaskNumber = -1;
    let taskIDNumber = -1;
    const taskCount = Object.keys(this.props.workflow.tasks).length;
    // We want to allow 0 despite it being falsey
    if ((lastTaskNumber !== null) && (lastTaskNumber !== undefined)) {
      taskIDNumber = lastTaskNumber;
    }

    while ((nextTaskID == null) || nextTaskID in this.props.workflow.tasks) {
      taskIDNumber += 1;
      nextTaskNumber = taskCount + taskIDNumber;
      nextTaskID = `T${nextTaskNumber}`;
    }
    return { nextTaskID, nextTaskNumber };
  },

  getNextStepID() {
    const stepCount = this.props.workflow.steps.length;
    const lastStep = this.props.workflow.steps[stepCount - 1];
    let stepIDNumber = 0;
    if (lastStep) {
      stepIDNumber = stepCount;
    }
    return `S${stepIDNumber}`;
  },

  addNewTask(type) {
    const changes = {};
    const { nextTaskID } = this.getNextTaskID();

    if (this.canUseTask(this.props.project, "transcription-task")) {
      const nextStepID = this.getNextStepID();
      const newStep = [nextStepID, { taskKeys: [nextTaskID] }];
      // newSteps = [...@props.workflow.steps, newStep]
      changes["steps"] = newSteps;
      if ((this.props.workflow.configuration.classifier_version == null) || (this.props.workflow.configuration.classifier_version !== '2.0')) {
        changes['configuration.classifier_version'] = "2.0";
      }
    }

    changes[`tasks.${nextTaskID}`] = taskComponents[type].getDefaultTask();
    if (!this.props.workflow.first_task) {
      changes.first_task = nextTaskID;
    }

    this.props.workflow.update(changes);
    return this.setState({ selectedTaskKey: nextTaskID, showTaskAddButtons: false });
  },

  buildTranscriptionTask(transcriptionTaskID, questionTaskID) {
    const tasks = {};

    tasks[transcriptionTaskID] = {
      help: "**To underline and transcribe**: Click a dot at the start and end of a row of text to create an underline mark. Adjust the mark by clicking and dragging the dots at the start and end of the line. Delete the mark by clicking on the X. Type into the pop-up box to transcribe the text you’ve underlined.      **To interact with previous annotations**: Click on a pink underline mark to see previous transcriptions. Select a transcription from the dropdown menu to populate the text box. Submit as is, or edit the text by clicking into the text box. If you don’t agree with any of the previous options, transcribe directly into the box.",
      instruction: "Welcome to the new Transcription Task! There are two ways to transcribe, depending on whether anyone else has seen this image previously.      1. If the document has no previous volunteer-made marks: underline a single row of text by clicking at the start and end of the line (please draw your marks in the order you’re reading the text), and follow the instructions on the pop-up for transcribing the text you’ve just underlined.      2. If the document has previous annotations: click on an underline mark to view, select, edit, and/or submit previous transcriptions.",
      tools: [
        {
          color: "",
          details: [
            {
              help: "",
              instruction: "Transcribe the line of text that you've marked.",
              required: "true",
              type: "text"
            }
          ],
          label: "Single line of text",
          type: "transcriptionLine"
        }
      ],
      type: "transcription"
    };

    tasks[questionTaskID] = {
      answers: [{label: "Yes"}, {label: "No"}],
      help: "If all the volunteer-made underline marks are **grey**, that indicates that consensus (agreement) has been achieved for all lines on the page and it is now ready to be retired from the project: **click YES**. ↵↵If there are non-grey underline marks on the page, that means those lines have not yet reached consensus: **click NO**.",
      question: "Have all the volunteer-made underline marks turned grey?",
      required: "true",
      type: "single"
    };

    return tasks;
  },

  addNewTranscriptionTask() {
    const nextStepID = this.getNextStepID();
    const { nextTaskID, nextTaskNumber } = this.getNextTaskID();
    const questionTaskID = this.getNextTaskID(nextTaskNumber);
    const changes = {};

    // Steps changes
    const newStep = [nextStepID, { taskKeys: [nextTaskID, questionTaskID.nextTaskID] }];
    // newSteps = [...@props.workflow.steps, newStep]
    changes["steps"] = newSteps;

    // Tasks changes
    const tasks = this.buildTranscriptionTask(nextTaskID, questionTaskID.nextTaskID);
    changes[`tasks.${nextTaskID}`] = tasks[nextTaskID];
    changes[`tasks.${questionTaskID.nextTaskID}`] = tasks[questionTaskID.nextTaskID];

    const configuration = {};
    // Configure version 2.0 in the workflow if missing
    if ((this.props.workflow.configuration.classifier_version == null) || (this.props.workflow.configuration.classifier_version !== '2.0')) {
      changes['configuration.classifier_version'] = "2.0";
    }

    // Configure the subject viewer if missing
    if ((this.props.workflow.configuration.subject_viewer == null) || (this.props.workflow.configuration.subject_viewer !== 'multiFrame')) {
      changes['configuration.subject_viewer'] = 'multiFrame';
    }

    this.props.workflow.update(changes).save();
    return this.setState({ selectedTaskKey: nextTaskID, showTaskAddButtons: false });
  },

  handleSetPanAndZoom(e) {
    return this.props.workflow.update({
      'configuration.pan_and_zoom': e.target.checked});
  },

  handleSetHideClassificationSummaries(e) {
    return this.props.workflow.update({
      'configuration.hide_classification_summaries': e.target.checked});
  },

  handlePersistAnnotationsToggle(e) {
    return this.props.workflow.update({
      'configuration.persist_annotations': e.target.checked});
  },

  handleSetSimNotification(e) {
    return this.props.workflow.update({
      'configuration.sim_notification': e.target.checked});
  },

  handleSetInvert(e) {
    return this.props.workflow.update({
      'configuration.invert_subject': e.target.checked});
  },

  handleSetGravitySpyGoldStandard(e) {
    return this.props.workflow.update({
      'configuration.gravity_spy_gold_standard': e.target.checked});
  },

  enableSubjectFlags(e) {
    return this.props.workflow.update({
      'configuration.enable_subject_flags': e.target.checked});
  },

  handleSetWorldWideTelescope(e) {
    if (!this.props.workflow.configuration.custom_summary) {
      this.props.workflow.update({
        'configuration.custom_summary' : []});
    }
    const summary_path = this.props.workflow.configuration.custom_summary;
    if (e.target.checked) {
    summary_path.push('world_wide_telescope');
    } else {
      const index = summary_path.indexOf('world_wide_telescope');
      summary_path.splice(index, 1);
    }
    return this.props.workflow.update({
      'configuration.custom_summary' : summary_path});
  },

  telescopeValue() {
    if (this.props.workflow.configuration.custom_summary) {
      return Array.from(this.props.workflow.configuration.custom_summary).includes('world_wide_telescope');
    }
  },

  handleDefaultWorkflowToggle(e) {
    const shouldSet = e.target.checked;

    if (shouldSet) {
      this.props.project.update({'configuration.default_workflow': this.props.workflow.id});
      return this.props.project.save();
    } else {
      this.props.project.update({'configuration.default_workflow': undefined});
      return this.props.project.save();
    }
  },

  handleTutorialToggle(tutorial, workflowTutorials, e) {
    const shouldAdd = e.target.checked;

    const ensureSaved = this.props.workflow.hasUnsavedChanges() ?
      this.props.workflow.save()
    :
      Promise.resolve();

    return ensureSaved
      .then(() => {
        if (shouldAdd) {
          this.props.workflow.addLink('tutorials', [tutorial.id]);

          return (() => {
            const result = [];
            for (let workflowTutorial of Array.from(workflowTutorials)) {
              if (((workflowTutorial.kind === null) && (tutorial.kind === 'tutorial')) || ((workflowTutorial.kind === 'tutorial') && (tutorial.kind === null))) {
                if (workflowTutorial.id !== tutorial.id) { result.push(this.props.workflow.removeLink('tutorials', workflowTutorial.id)); } else {
                  result.push(undefined);
                }
              } else if (workflowTutorial.kind === tutorial.kind) {
                if (workflowTutorial.id !== tutorial.id) { result.push(this.props.workflow.removeLink('tutorials', workflowTutorial.id)); } else {
                  result.push(undefined);
                }
              } else {
                result.push(undefined);
              }
            }
            return result;
          })();
        } else {
          return this.props.workflow.removeLink('tutorials', tutorial.id);
        }
    });
  },

  removeTutorial(tutorial, workflowTutorials, e) {
    return this.props.workflow.removeLink('tutorials', tutorial.id);
  },

  handleDelete() {
    this.setState({deletionError: null});

    const confirmed = confirm('Really delete this workflow and all its tasks?');

    if (confirmed) {
      this.setState({deletionInProgress: true});

      if (this.props.workflow.id === (this.props.project.configuration != null ? this.props.project.configuration.default_workflow : undefined)) {
        this.props.project.update({'configuration.default_workflow': undefined});
        this.props.project.save();
      }

      return this.props.workflow.delete().then(() => {
        this.props.project.uncacheLink('workflows');
        return this.context.router.push(`/lab/${this.props.project.id}`);
    }).catch(error => {
        return this.setState({deletionError: error});
      }).then(() => {
        if (this.isMounted()) {
          return this.setState({deletionInProgress: false});
        }
      });
    }
  },

  handleViewClick() {
    return setTimeout(() => {
      return this.setState({forceReloader: this.state.forceReloader + 1});
    });
  },

  updateFirstTask() {
    if (!(this.props.workflow.first_task in this.props.workflow.tasks)) {
      let left;
      return this.props.workflow.update({first_task: (left = Object.keys(this.props.workflow.tasks)[0]) != null ? left : ''});
    }
  },

  prepareStepForRemoval(taskKey) {
    // steps = [...@props.workflow.steps]
    const stepIndex = this.props.workflow.steps.findIndex(step => {
      const { taskKeys } = step[1];
      return taskKeys.includes(taskKey);
    });
    // Remove the step
    steps.splice(stepIndex, 1);

    return { steps, stepIndex };
  },

  deleteStepAndTask(taskKey) {
    const changes = {};
    const { steps, stepIndex } = this.prepareStepForRemoval(taskKey);

    // Logic branch: does the Task exist in a Step?
    if (stepIndex >= 0) {
      // If the Task exists in a Step, then delete ALL the Tasks in that Step
      this.props.workflow.steps[stepIndex][1].taskKeys.forEach(taskKey2 => {
        if (this.props.workflow.tasks[taskKey2]) {
          return changes[`tasks.${taskKey2}`] = undefined;
        }
      });

      // Now remove the Step
      changes.steps = steps;

    } else {
      // If the Task doesn't exist in a Step, just delete it from the Tasks list
      changes[`tasks.${taskKey}`] = undefined;
    }

    if ((changes.steps != null ? changes.steps.length : undefined) === 0) {
      // If no more steps, remove the classifier version 2.0 designation
      changes["configuration.classifier_version"] = undefined;
    }

    return this.props.workflow.update(changes);
  },

  handleTaskDelete(taskKey, e) {
    const shortcut = this.props.workflow.tasks[taskKey].unlinkedTask;
    if (e.shiftKey || confirm('Really delete this task?')) {
      if (this.canUseTask(this.props.project, "transcription-task")) {
        this.deleteStepAndTask(taskKey);
      } else {
        const changes = {};
        if (shortcut) {
          changes[`tasks.${shortcut}`] = undefined;
        }
        changes[`tasks.${taskKey}`] = undefined;
        this.props.workflow.update(changes);
      }

      return this.updateFirstTask();
    }
  }
});

module.exports = createReactClass({
  displayName: 'EditWorkflowPageWrapper',

  getDefaultProps() {
    return {
      params: {
        workflowID: ''
      }
    };
  },

  render() {
    return (
      <PromiseRenderer promise={apiClient.type('workflows').get(this.props.params.workflowID, {})}>{(workflow) =>
        <ChangeListener target={workflow}>{()=>
          <EditWorkflowPage {...this.props} workflow={workflow} />
        }</ChangeListener>
      }</PromiseRenderer>
    );
  }
});
