import React from 'react';
import PropTypes from 'prop-types';
import handleInputChange from '../../lib/handle-input-change';
import PromiseRenderer from '../../components/promise-renderer';
import TriggeredModalForm from 'modal-form/triggered';
import ModalFormDialog from 'modal-form/dialog';
import apiClient from 'panoptes-client/lib/api-client';
import ChangeListener from '../../components/change-listener';
import RetirementRulesEditor from '../../components/retirement-rules-editor';
import {Link} from 'react-router';
import MultiImageSubjectOptionsEditor from '../../components/multi-image-subject-options-editor';
import taskComponents from '../../classifier/tasks';
import AutoSave from '../../components/auto-save';
import FileButton from '../../components/file-button';
import WorkflowCreateForm from './workflow-create-form';
import workflowActions from './actions/workflow';
import classnames from 'classnames';
import ShortcutEditor from '../../classifier/tasks/shortcut/editor';
import FeedbackSection from '../../features/feedback/lab';
import MobileSection from './mobile';
import SubjectGroupViewerEditor from './workflow-components/subject-group-viewer-editor';
import SubjectSetLinker from './workflow-components/subject-set-linker';

const DEMO_SUBJECT_SET_ID = process.env.NODE_ENV === 'production'
? '6' // Cats
: '1166'; // Ghosts

class EditWorkflowPage extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      selectedTaskKey: props.workflow.first_task,
      forceReloader: 0,
      deletionInProgress: false,
      deletionError: null,
      workflowCreationInProgress: false,
      showTaskAddButtons: false
    };
  }

  workflowLink() {
    const [owner, name] = this.props.project.slug.split('/');
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
  }

  showCreateWorkflow() {
    return this.setState({workflowCreationInProgress: true});
  }

  hideCreateWorkflow() {
    return this.setState({workflowCreationInProgress: false});
  }

  handleWorkflowCreation(workflow) {
    this.hideCreateWorkflow();
    const newLocation = Object.assign({}, this.props.location, {pathname: `/lab/${this.props.project.id}/workflows/${workflow.id}`});
    this.context.router.push(newLocation);
    this.props.project.uncacheLink('workflows');
    return this.props.project.uncacheLink('subject_sets');
  } // An "expert" subject set is automatically created with each workflow.

  canUseTask(project, task) {
    return Array.from(project.experimental_tools).includes(task);
  }

  handleTaskChange(taskKey, taskDescription) {
    const changes = {};
    changes[`tasks.${taskKey}`] = taskDescription;
    return this.props.workflow.update(changes).save();
  }

  isThereNotADefinedTask() {
    const workflowTasks = Object.keys(this.props.workflow.tasks);
    return workflowTasks.length === 0;
  }

  showTaskAddButtons() {
    return this.setState(prevState => ({ showTaskAddButtons: !prevState.showTaskAddButtons }));
  }

  render() {
    let definition;
    window.editingWorkflow = this.props.workflow;

    const noTasksDefined = Object.keys(this.props.workflow.tasks).length === 0;

    const stats_completeness_type = this.props.workflow.configuration.stats_completeness_type != null ? this.props.workflow.configuration.stats_completeness_type : 'retirement';

    const projectLiveWorkflowActive = this.props.project.live && this.props.workflow.active;
    const projectLiveWorkflowInactive = this.props.project.live && !this.props.workflow.active;
    const disabledIfLive = classnames({ 'disabled-section': projectLiveWorkflowActive });
    const disabledIfWorkflowInactive = classnames({ 'disabled-section': projectLiveWorkflowInactive });
    const taskEditorClasses = classnames({'column': true, 'disabled-section': projectLiveWorkflowActive});

    return (
      <div className="edit-workflow-page">
        <h3>{this.props.workflow.display_name} #{this.props.workflow.id}{' '}
          <button onClick={this.showCreateWorkflow.bind(this)} disabled={this.state.workflowCreationInProgress} title="Copy workflow">
            <i className="fa fa-copy"/>
          </button>
        </h3>
        {this.state.workflowCreationInProgress ?
          <ModalFormDialog tag="div">
            <WorkflowCreateForm onSubmit={this.props.workflowActions.copyWorkflowForProject} onCancel={this.hideCreateWorkflow.bind(this)} onSuccess={this.handleWorkflowCreation.bind(this)}  project={this.props.project} workflowToClone={this.props.workflow} workflowActiveStatus={!this.props.project.live} />
          </ModalFormDialog> : undefined}
        <p className="form-help">A workflow is the sequence of tasks that you’re asking volunteers to perform. For example, you might want to ask volunteers to answer questions about your images, or to mark features in your images, or both.</p>
        {this.props.project.live && this.props.workflow.active ?
          <p className="form-help warning">
            <strong>
              You cannot edit tasks for an active workflow on a live project, all the task fields below will be inactive.
              <br />
              To edit these fields, deactivate your workflow on the <Link to={`/lab/${this.props.project.id}/workflows`}>workflows page</Link> - do not change your project to development.
            </strong>
          </p> : undefined}
        <div className="columns-container">
          <div className="column">
            <div>
              <AutoSave tag="label" resource={this.props.workflow}>
                <label className="form-label" for="displayName">Workflow title</label>
                <br />
                <input type="text" id="displayName" name="display_name" value={this.props.workflow.display_name} className="standard-input full" onChange={handleInputChange.bind(this.props.workflow)} />
              </AutoSave>
              <small className="form-help">If you let your volunteers choose which workflow to attempt, this text will appear as an option on the project front page.</small>

              <br />

              <div className={disabledIfLive}>
                <div className="nav-list standalone">
                  <span className="nav-list-header">Tasks</span>
                  <br />
                  {noTasksDefined ?
                    <div className="nav-list-item">
                      <small className="form-help">(No tasks yet)</small>
                    </div>
                  :
                    (() => {
                      const result = [];
                      for (let key in this.props.workflow.tasks) {
                        definition = this.props.workflow.tasks[key];
                        if (definition.type !== 'shortcut') {
                          const classNames = ['secret-button', 'nav-list-item'];
                          const taskDefinition = taskComponents[definition.type]?.getTaskText(definition);
                          if (key === this.state.selectedTaskKey) {
                            classNames.push('active');
                          }
                          result.push(<div key={key}>
                            <button
                              type="button"
                              className={classNames.join(' ')}
                              onClick={this.setState.bind(this, {selectedTaskKey: key}, null)}
                            >
                              {(() => { switch (definition.type) {
                                case 'single': return <i className="fa fa-dot-circle-o fa-fw"></i>;
                                case 'multiple': return <i className="fa fa-check-square-o fa-fw"></i>;
                                case 'drawing': return <i className="fa fa-pencil fa-fw"></i>;
                                case 'survey': return <i className="fa fa-binoculars fa-fw"></i>;
                                case 'flexibleSurvey': return <i className="fa fa-binoculars fa-fw"></i>;
                                case 'crop': return <i className="fa fa-crop fa-fw"></i>;
                                case 'text': return <i className="fa fa-file-text-o fa-fw"></i>;
                                case 'dropdown': return <i className="fa fa-list fa-fw"></i>;
                                case 'combo': return <i className="fa fa-cubes fa-fw"></i>;
                                case 'slider': return <i className="fa fa-sliders fa-fw"></i>;
                                case 'highlighter': return <i className="fa fa-i-cursor"></i>;
                                case 'transcription': return <i className="fa fa-font fa-fw"></i>;
                              } })()}
                              {' '}
                              {taskDefinition || 'Task editor is unavailable'}
                              {key === this.props.workflow.first_task ?
                                <small> <em>(first)</em></small> : undefined}
                              <small style={{float: 'right'}}>{key}</small>
                            </button>
                          </div>);
                        } else {
                          result.push(undefined);
                        }
                      }
                      return result;
                    })()}
                </div>

                <div className="edit-workflow-page__section">
                  <button type="button" className="standard-button" onClick={this.showTaskAddButtons.bind(this)}>
                    <i className="fa fa-plus-circle"></i>{' '}
                    Add a task
                  </button>
                  {this.state.showTaskAddButtons ?
                    <div className="edit-workflow-page__section edit-workflow-page__task-add-buttons">
                      <AutoSave resource={this.props.workflow}>
                        <button type="button" className="minor-button" onClick={this.addNewTask.bind(this, 'single')} title="Question tasks: the volunteer chooses from among a list of answers but does not mark or draw on the image(s).">
                          <i className="fa fa-question-circle fa-2x"></i>
                          <br />
                          <small><strong>Question</strong></small>
                        </button>
                      </AutoSave>{' '}
                      <AutoSave resource={this.props.workflow}>
                        <button type="button" className="minor-button" onClick={this.addNewTask.bind(this, 'drawing')} title="Marking tasks: the volunteer marks or draws directly on the image(s) using tools that you specify. They can also give sub-classifications for each mark.">
                          <i className="fa fa-pencil fa-2x"></i>
                          <br />
                          <small><strong>Drawing</strong></small>
                        </button>
                      </AutoSave>{' '}
                      <AutoSave resource={this.props.workflow}>
                        <button type="button" className="minor-button" onClick={this.addNewTask.bind(this, 'text')} title="Text tasks: the volunteer writes free-form text into a dialog box.">
                          <i className="fa fa-file-text-o fa-2x"></i>
                          <br />
                          <small><strong>Text</strong></small>
                        </button>
                      </AutoSave>{' '}
                      <AutoSave resource={this.props.workflow}>
                        <button type="button" className="minor-button" onClick={this.addNewTask.bind(this, 'survey')} title="Survey tasks: the volunteer identifies objects (usually animals) in the image(s) by filtering by their visible charactaristics, then answers questions about them.">
                          <i className="fa fa-binoculars fa-2x"></i>
                          <br />
                          <small><strong>Survey</strong></small>
                        </button>
                      </AutoSave>{' '}
                      {this.canUseTask(this.props.project, "highlighter") ?
                        <AutoSave resource={this.props.workflow}>
                          <button type="button" className="minor-button" onClick={this.addNewTask.bind(this, 'highlighter')} title="Highlighter: The volunteer can highlight piece of text.">
                            <i className="fa fa-i-cursor fa-2x"></i>
                            <br />
                            <small><strong>Highlighter</strong></small>
                          </button>
                        </AutoSave> : undefined}{' '}
                      {this.canUseTask(this.props.project, "crop") ?
                        <AutoSave resource={this.props.workflow}>
                          <button type="button" className="minor-button" onClick={this.addNewTask.bind(this, 'crop')} title="Crop tasks: the volunteer draws a rectangle around an area of interest, and the view of the subject is approximately cropped to that area.">
                            <i className="fa fa-crop fa-2x"></i>
                            <br />
                            <small><strong>Crop</strong></small>
                          </button>
                        </AutoSave> : undefined}{' '}
                      {this.canUseTask(this.props.project, "dropdown") ?
                          <AutoSave resource={this.props.workflow}>
                            <button type="button" className="minor-button" onClick={this.addNewTask.bind(this, 'dropdown')} title="Dropdown tasks: the volunteer selects an option from a list. Conditional dropdowns can be created, and if a research team enables the feature, a volunteer can enter text if the answer they'd like to provide is not an option available.">
                              <i className="fa fa-list fa-2x"></i>
                              <br />
                              <small><strong>Dropdown</strong></small>
                            </button>
                          </AutoSave> : undefined}{' '}
                      {this.canUseTask(this.props.project, "combo") ?
                        <AutoSave resource={this.props.workflow}>
                          <button type="button" className="minor-button" onClick={this.addNewTask.bind(this, 'combo')} title="Combo tasks: show a bunch of tasks at the same time.">
                            <i className="fa fa-cubes fa-2x"></i>
                            <br />
                            <small><strong>Combo</strong></small>
                          </button>
                        </AutoSave> : undefined}{' '}
                      {this.canUseTask(this.props.project, "slider") ?
                        <AutoSave resource={this.props.workflow}>
                          <button type="button" className="minor-button" onClick={this.addNewTask.bind(this, 'slider')} title="Slider tasks: the volunteer uses a slider to select a numeric value.">
                            <i className="fa fa-sliders fa-2x"></i>
                            <br />
                            <small><strong>Slider</strong></small>
                          </button>
                        </AutoSave> : undefined}{' '}
                      {this.canUseTask(this.props.project, "transcription-task") ?
                        <AutoSave resource={this.props.workflow}>
                          <button type="submit" className="minor-button" onClick={this.addNewTranscriptionTask.bind(this)} title="Transcription tasks: the volunteer marks a line under text and transcribes the text into a text box. If caesar is configured, then text suggestions if available from other volunteers are options.">
                            <i className="fa fa-font fa-2x"></i>
                            <br />
                            <small><strong>Transcription</strong></small>
                          </button>
                        </AutoSave> : undefined}{' '}
                      {this.canUseTask(this.props.project, "subjectGroupViewer") ?
                        <AutoSave resource={this.props.workflow}>
                          <button type="button" className="minor-button" onClick={this.addNewTask.bind(this, 'subjectGroupComparison')} title="Subject Group Comparison Task: the volunteer looks at a grid of images, and selects the cells that look different. Be sure to enable the 'Subject Group Viewer' configuration for the workflow">
                            <i className="fa fa-th fa-2x"></i>
                            <br />
                            <small><strong>Subject Group Comparison (aka "Grid")</strong></small>
                          </button>
                        </AutoSave> : undefined}{' '}
                      </div> : undefined}
                </div>

                <AutoSave tag="div" resource={this.props.workflow}>
                  <small>First task</small>{' '}
                  <select name="first_task" value={this.props.workflow.first_task} disabled={noTasksDefined} onChange={handleInputChange.bind(this.props.workflow)}>
                    {noTasksDefined ?
                      <option>(No tasks yet)</option>
                    :
                      (() => {
                        const result1 = [];
                        for (let taskKey in this.props.workflow.tasks) {
                          definition = this.props.workflow.tasks[taskKey];
                          if (definition.type !== 'shortcut') {
                            result1.push(<option key={taskKey} value={taskKey}>{taskComponents[definition.type]?.getTaskText(definition)}</option>);
                          } else {
                            result1.push(undefined);
                          }
                        }
                        return result1;
                      })()}
                  </select>
                </AutoSave>
              </div>

              <p className="form-help"><small>A task is a unit of work you are asking volunteers to do. You can ask them to answer a question or mark an image. Add a task by clicking the question or marking buttons below.</small></p>

              <hr />

              <p>
                <small className="form-help">Version {this.props.workflow.version} - Status: <span className={this.props.workflow.active ? "color-label green" : "color-label red"}>{this.props.workflow.active ? "Active" : "Inactive"}</span></small>
              </p>
              <p className="form-help"><small>Version indicates which version of the workflow you are on. Every time you save changes to a workflow, you create a new version. Big changes, like adding or deleting questions, will change the version by a whole number: 1.0 to 2.0, etc. Smaller changes, like modifying the help text, will change the version by a decimal, e.g. 2.0 to 2.1. The version is tracked with each classification in case you need it when analyzing your data.</small></p>
              <p className="form-help"><small>Status indicates whether a workflow is active or inactive. Active workflows are available to volunteers and classifications count toward subject retirement. Workflow status can be managed under the Visibility section within the Project Builder.</small></p>
            </div>

            <hr />

            <div>
              <span className="form-label">Associated subject sets</span><br />
              <small className="form-help">Choose the set of subjects you want to use for this workflow.</small>
              <SubjectSetLinker
                project={this.props.project}
                workflow={this.props.workflow}
              />
            </div>

            <hr />

            <div>
              <AutoSave resource={this.props.workflow}>
              <span className="form-label">Set annotation persistence</span><br />
              <small className="form-help">Save the annotation of the task you are on when the back button is clicked.</small>
              <br />
              <label>
                <input ref="persistAnnotation" type="checkbox" checked={this.props.workflow.configuration.persist_annotations} onChange={this.handlePersistAnnotationsToggle.bind(this)} />
                Persist annotations
              </label>
              </AutoSave>
              <hr />
            </div>

            <div className={disabledIfWorkflowInactive}>
              <AutoSave resource={this.props.project}>
                <span className="form-label">Set as default</span><br />
                <small className="form-help">If you have more than one workflow, you can set which should be default. Only one can be default.</small>
                {projectLiveWorkflowInactive ? <span><br /><small className="form-help">Inactive workflows on live projects cannot be made default.</small></span> : undefined}
                <br />
                <label>
                  <input ref="defaultWorkflow" type="checkbox" disabled={projectLiveWorkflowInactive} checked={this.props.project.configuration?.default_workflow === this.props.workflow.id} onChange={this.handleDefaultWorkflowToggle.bind(this)} />
                  Default workflow
                </label>
              </AutoSave>
            </div>

            <hr />

            <div ref="link-tutorials-section">
              <span className="form-label">Associated tutorial {Array.from(this.props.project.experimental_tools).includes('mini-course') ? "and/or mini-course" : undefined}</span><br />
              <small className="form-help">Choose the tutorial {Array.from(this.props.project.experimental_tools).includes('mini-course') ? "and/or mini-course" : undefined} you want to use for this workflow.</small><br />
              <small className="form-help">Only one can be associated with a workflow at a time.</small>
              <div>
                {this.renderTutorials()}
                {Array.from(this.props.project.experimental_tools).includes('mini-course') ? this.renderMiniCourses() : undefined}
              </div>
            </div>

            <hr />

            <div>
              <div>
                <AutoSave resource={this.props.workflow}>
                  <span className="form-label">Classification summaries</span><br />
                  <small className="form-help">Classification summaries show the user how they have answered/marked for each task once the classification is complete</small>
                  <br />
                  <label>
                    <input ref="hideClassificationSummaries" type="checkbox" checked={this.props.workflow.configuration.hide_classification_summaries} onChange={this.handleSetHideClassificationSummaries.bind(this)} />
                    Hide classification summaries
                  </label>
                </AutoSave>
              </div>

              <hr />
            </div>

            {Array.from(this.props.project.experimental_tools).includes('sim notification') ?
              <div>
                <div>
                  <AutoSave resource={this.props.workflow}>
                    <span className="form-label">Simulation subject notification</span><br />
                    <small className="form-help">Simulation subject notification will display a small message in the classification summary that lets the volunteer know the subject is a simulation.</small><br /><br />
                    <small className="form-help">For this feature to work, it requires hidden subject metadata with the column label <code>{'#sim'}</code> and the value set to <code>true</code> or <code>false.</code></small>
                    <br />
                    <label>
                      <input type="checkbox" checked={this.props.workflow.configuration.sim_notification} onChange={this.handleSetSimNotification.bind(this)} />
                      Simluation subject notification
                    </label>
                  </AutoSave>
                </div>

                <hr />
              </div> : undefined}

            {Array.from(this.props.project.experimental_tools).includes('Gravity Spy Gold Standard') ?
              <div>
                <div>
                  <AutoSave resource={this.props.workflow}>
                    <span className="form-label">Gravity Spy Gold Standard</span><br />
                    <small className="form-help">Notify a user how they&apos;ve classified a Gold Standard subject.</small>
                    <br />
                    <label>
                      <input type="checkbox" onChange={this.handleSetGravitySpyGoldStandard.bind(this)} checked={this.props.workflow.configuration.gravity_spy_gold_standard}/>
                      Gravity Spy Gold Standard
                    </label>
                  </AutoSave>
                </div>

                <hr />

              </div> : undefined}

            {Array.from(this.props.project.experimental_tools).includes('subjectGroupViewer') ?
              <div>
                <SubjectGroupViewerEditor
                  workflow={this.props.workflow}
                />
                <hr />
              </div> : undefined}

            <div>
              <div>
                <AutoSave resource={this.props.workflow}>
                  <span className="form-label">Pan and zoom</span><br />
                  <small className="form-help">Pan and zoom allows the user to zoom in and out and pan image subjects in the classification interface.</small>
                  <br />
                  <label>
                    <input ref="panAndZoomToggle" type="checkbox" checked={this.props.workflow.configuration.pan_and_zoom} onChange={this.handleSetPanAndZoom.bind(this)} />
                    Pan and Zoom
                  </label>
                </AutoSave>
              </div>

              <hr />
            </div>

            <AutoSave tag="div" resource={this.props.workflow}>
              <span className="form-label">Multi-image options</span><br />
              <small className="form-help">Choose how to display multiple images</small>
              <MultiImageSubjectOptionsEditor workflow={this.props.workflow} />
            </AutoSave>

            <hr />

            {Array.from(this.props.project.experimental_tools).includes('enable subject flags') ?
              <div>
                <div>
                  <AutoSave resource={this.props.workflow}>
                    <span className="form-label">Subject Flags</span><br />
                    <small className="form-help">Flags allow volunteers to mark subjects as inappropriate.</small>
                    <br />
                    <label>
                      <input type="checkbox" onChange={this.enableSubjectFlags.bind(this)} checked={this.props.workflow.configuration.enable_subject_flags}/>
                      Enable Subject Flags
                    </label>
                  </AutoSave>
                </div>

                <hr />

              </div> : undefined}

            <div>
              <AutoSave tag="label" resource={this.props.workflow}>
                <input type="checkbox" name="invert_subject" checked={this.props.workflow.configuration.invert_subject} onChange={this.handleSetInvert.bind(this)} />
                Allow Users To Flip Image Color
              </AutoSave>

              <hr />
            </div>

            <p>
              <AutoSave resource={this.props.workflow}>
                Subject retirement <RetirementRulesEditor workflow={this.props.workflow} />
              </AutoSave>
              <br />
              <small className="form-help">How many people should classify each subject before it is “done”? Once a subject has reached the retirement limit it will no longer be shown to any volunteers.</small>
              <br />
              <br />
              <small className="form-help">If you&apos;d like more complex retirement rules, please get in touch via the <a href='/about/contact'>Contact Us</a> page.</small>
            </p>

            <hr />

            {Array.from(this.props.project.experimental_tools).includes('worldwide telescope') ?
              <div>
                <div>
                  <AutoSave resource={this.props.workflow}>
                    <span className="form-label">Use World Wide Telescope API</span><br />
                    <small className="form-help">Allow user to view subject in the WWT after classifying.</small>
                    <br />
                    <label htmlFor="world_wide_telescope_summary">
                      <input type="checkbox" onChange={this.handleSetWorldWideTelescope.bind(this)} checked={this.telescopeValue()}/>
                      WorldWide Telescope
                    </label>
                  </AutoSave>
                </div>

                <hr />

              </div> : undefined}

            <div className={this.isThereNotADefinedTask() ? 'disabled-section' : ''}>
              {!this.isThereNotADefinedTask() ?
                <a
                  href={this.workflowLink()}
                  className="standard-button"
                  target="from-lab"
                  onClick={this.handleViewClick.bind(this)}
                >
                  Test this workflow
                </a> : undefined}
              {this.isThereNotADefinedTask() ?
                <div>
                  <span className="standard-button">Test this workflow</span>
                  <p>You need to add a task and content to be able to test this workflow.</p>
                </div> : undefined}
            </div>

            <hr />

            <div className={disabledIfLive}>
              <small>
                <button type="button" className="minor-button" disabled={this.state.deletionInProgress} data-busy={this.state.deletionInProgress || null} onClick={this.handleDelete.bind(this)}>
                  Delete this workflow
                </button>
              </small>{' '}
              {(this.state.deletionError != null) ?
                <span className="form-help error">{this.state.deletionError.message}</span> : undefined}
            </div>
          </div>

          <div className={taskEditorClasses}>
            {(() => {
            if ((this.state.selectedTaskKey != null) && (this.props.workflow.tasks[this.state.selectedTaskKey] != null)) {
              const task = this.props.workflow.tasks[this.state.selectedTaskKey];
              if (task.required === 'true') {
                task.required = true;
              }
              if (task.required === 'false') {
                task.required = false;
              }
              const TaskEditorComponent = taskComponents[task.type]?.Editor;
              const taskWithDefaults = {
                required: false,
                ...task
              };
              return <div>
                {Array.from(this.props.project.experimental_tools).includes('shortcut') ?
                  <ShortcutEditor workflow={this.props.workflow} task={taskWithDefaults}>
                    <TaskEditorComponent
                      workflow={this.props.workflow}
                      task={taskWithDefaults}
                      taskPrefix={`tasks.${this.state.selectedTaskKey}`}
                      project={this.props.project}
                      onChange={this.handleTaskChange.bind(this, this.state.selectedTaskKey)}
                    />
                  </ShortcutEditor>
                : TaskEditorComponent ?
                  <TaskEditorComponent
                    workflow={this.props.workflow}
                    task={taskWithDefaults}
                    taskPrefix={`tasks.${this.state.selectedTaskKey}`}
                    project={this.props.project}
                    onChange={this.handleTaskChange.bind(this, this.state.selectedTaskKey)}
                  />
                :
                  <div>Editor is not available.</div>
                }
                <hr />
                <br />

                {Array.from(this.props.project.experimental_tools).includes('general feedback') ?
                  <FeedbackSection
                    task={this.props.workflow.tasks[this.state.selectedTaskKey]}
                    saveFn={this.handleTaskChange.bind(this, this.state.selectedTaskKey)}
                  /> : undefined}
                <hr />
                <br />

                <MobileSection
                  project={this.props.project}
                  workflow={this.props.workflow}
                  task={this.props.workflow.tasks[this.state.selectedTaskKey]}
                />

                <AutoSave resource={this.props.workflow}>
                  <small>
                    <button type="button" className="minor-button" onClick={this.handleTaskDelete.bind(this, this.state.selectedTaskKey)}>Delete this task</button>
                  </small>
                </AutoSave>
              </div>;
            } else {
              return <div className="form-help">
                <p>Choose a task to edit. The configuration for that task will appear here.</p>
              </div>;
            }
          })()
            }
          </div>
        </div>
      </div>
    );
  }

  renderTutorials() {
    const projectAndWorkflowTutorials = Promise.all([
      apiClient.type('tutorials').get({project_id: this.props.project.id, page_size: 100}),
      apiClient.type('tutorials').get({workflow_id: this.props.workflow.id, page_size: 100})
    ]);
    return (
      <PromiseRenderer promise={projectAndWorkflowTutorials}>{([projectTutorials, workflowTutorials]) => {
        // Backwards compatibility with tutorials with null kind values
        const tutorials = projectTutorials.filter(function(value){ if ((value.kind === 'tutorial') || (value.kind === null)) { return value; } });
        const workflowTutorial = tutorials.filter(function(value) { if (Array.from(workflowTutorials).includes(value)) { return value; } })[0];
        if (tutorials.length > 0) {
          return (
            <form className="workflow-link-tutorials-form">
              <span className="form-label">Tutorials</span>
              <label>
                <input name="tutorial" type="radio" value="" checked={!workflowTutorial} onChange={this.removeTutorial.bind(this, workflowTutorial, workflowTutorials)} />
                No tutorial
              </label>
              {(() => {
              const result = [];
              for (let tutorial of Array.from(tutorials)) {
                const assignedTutorial = tutorial === workflowTutorial;
                const toggleTutorial = this.handleTutorialToggle.bind(this, tutorial, workflowTutorials);
                result.push(<label key={tutorial.id}>
                  <input name="tutorial" type="radio" checked={assignedTutorial} value={tutorial.id} onChange={toggleTutorial} />
                  Tutorial #{tutorial.id} {tutorial.display_name ? ` - ${tutorial.display_name}` : undefined}
                </label>);
              }
              return result;
            })()}
            </form>
          );
        } else {
          return <span>This project has no tutorials.</span>;
        }
      }
      }</PromiseRenderer>
    );
  }

  renderMiniCourses() {
    const projectAndWorkflowTutorials = Promise.all([
      apiClient.type('tutorials').get({project_id: this.props.project.id, page_size: 100, kind: 'mini-course'}),
      apiClient.type('tutorials').get({workflow_id: this.props.workflow.id, page_size: 100, kind: 'mini-course'})
    ]);
    return (
      <PromiseRenderer promise={projectAndWorkflowTutorials}>{([projectTutorials, workflowTutorials]) => {
        const workflowMiniCourse = projectTutorials.filter(function(value) { if (Array.from(workflowTutorials).includes(value)) { return value; } })[0];
        if (projectTutorials.length > 0) {
          return (
            <form className="workflow-link-tutorials-form">
              <span className="form-label">Mini-Courses</span>
              <label>
                <input name="minicourse" type="radio" value="" checked={!workflowMiniCourse} onChange={this.removeTutorial.bind(this, workflowMiniCourse, workflowTutorials)} />
                No mini-course
              </label>
              {(() => {
              const result = [];
              for (let tutorial of Array.from(projectTutorials)) {
                const assignedTutorial = tutorial === workflowMiniCourse;
                const toggleTutorial = this.handleTutorialToggle.bind(this, tutorial, workflowTutorials);
                result.push(<label key={tutorial.id}>
                  <input name="minicourse" type="radio" checked={assignedTutorial} onChange={toggleTutorial} />
                  Mini-Course #{tutorial.id} {tutorial.display_name ? ` - ${tutorial.display_name}` : undefined}
                </label>);
              }
              return result;
            })()}
            </form>
          );
        } else {
          return <span>This project has no mini-courses.</span>;
        }
      }
      }</PromiseRenderer>
    );
  }

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
  }

  getNextStepID() {
    const stepCount = this.props.workflow.steps.length;
    const lastStep = this.props.workflow.steps[stepCount - 1];
    let stepIDNumber = 0;
    if (lastStep) {
      stepIDNumber = stepCount;
    }
    return `S${stepIDNumber}`;
  }

  addNewTask(type) {
    const changes = {};
    const { nextTaskID } = this.getNextTaskID();

    if (this.canUseTask(this.props.project, "transcription-task")) {
      const nextStepID = this.getNextStepID();
      const newStep = [nextStepID, { taskKeys: [nextTaskID] }];
      const newSteps = [...this.props.workflow.steps, newStep];
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
  }

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
  }

  addNewTranscriptionTask() {
    const nextStepID = this.getNextStepID();
    const { nextTaskID, nextTaskNumber } = this.getNextTaskID();
    const questionTaskID = this.getNextTaskID(nextTaskNumber);
    const changes = {};

    // Steps changes
    const newStep = [nextStepID, { taskKeys: [nextTaskID, questionTaskID.nextTaskID] }];
    const newSteps = [...this.props.workflow.steps, newStep];
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
  }

  handleSetPanAndZoom(e) {
    return this.props.workflow.update({
      'configuration.pan_and_zoom': e.target.checked});
  }

  handleSetHideClassificationSummaries(e) {
    return this.props.workflow.update({
      'configuration.hide_classification_summaries': e.target.checked});
  }

  handlePersistAnnotationsToggle(e) {
    return this.props.workflow.update({
      'configuration.persist_annotations': e.target.checked});
  }

  handleSetSimNotification(e) {
    return this.props.workflow.update({
      'configuration.sim_notification': e.target.checked});
  }

  handleSetInvert(e) {
    return this.props.workflow.update({
      'configuration.invert_subject': e.target.checked});
  }

  handleSetGravitySpyGoldStandard(e) {
    return this.props.workflow.update({
      'configuration.gravity_spy_gold_standard': e.target.checked});
  }

  enableSubjectFlags(e) {
    return this.props.workflow.update({
      'configuration.enable_subject_flags': e.target.checked});
  }

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
  }

  telescopeValue() {
    if (this.props.workflow.configuration.custom_summary) {
      return Array.from(this.props.workflow.configuration.custom_summary).includes('world_wide_telescope');
    }
  }

  handleDefaultWorkflowToggle(e) {
    const shouldSet = e.target.checked;

    if (shouldSet) {
      this.props.project.update({'configuration.default_workflow': this.props.workflow.id});
      return this.props.project.save();
    } else {
      this.props.project.update({'configuration.default_workflow': undefined});
      return this.props.project.save();
    }
  }

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
  }

  removeTutorial(tutorial, workflowTutorials, e) {
    return this.props.workflow.removeLink('tutorials', tutorial.id);
  }

  handleDelete() {
    this.setState({deletionError: null});

    const confirmed = confirm('Really delete this workflow and all its tasks?');

    if (confirmed) {
      this.setState({deletionInProgress: true});

      if (this.props.workflow.id === this.props.project.configuration?.default_workflow) {
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
  }

  handleViewClick() {
    return setTimeout(() => {
      return this.setState({forceReloader: this.state.forceReloader + 1});
    });
  }

  updateFirstTask() {
    if (!(this.props.workflow.first_task in this.props.workflow.tasks)) {
      let left;
      return this.props.workflow.update({first_task: (left = Object.keys(this.props.workflow.tasks)[0]) != null ? left : ''});
    }
  }

  prepareStepForRemoval(taskKey) {
    const steps = [...this.props.workflow.steps];
    const stepIndex = this.props.workflow.steps.findIndex(step => {
      const { taskKeys } = step[1];
      return taskKeys.includes(taskKey);
    });
    // Remove the step
    steps.splice(stepIndex, 1);

    return { steps, stepIndex };
  }

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

    if (changes.steps?.length === 0) {
      // If no more steps, remove the classifier version 2.0 designation
      changes["configuration.classifier_version"] = undefined;
    }

    return this.props.workflow.update(changes);
  }

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
}

EditWorkflowPage.contextTypes = {
  router: PropTypes.object.isRequired
};

EditWorkflowPage.defaultProps = {
  workflow: null,
  workflowActions: workflowActions
};

export default function EditWorkflowPageWrapper (props) {
  const params = props.params || {
    workflowID: ''
  }

  return <PromiseRenderer promise={apiClient.type('workflows').get(params.workflowID, {})}>{workflow => {
    return <ChangeListener target={workflow}>{() => {
      return <EditWorkflowPage {...props} workflow={workflow} />;
    }
    }</ChangeListener>;
  }
  }</PromiseRenderer>;
}
