import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import ChangeListener from '../components/change-listener.cjsx';
import experimentsClient from '../lib/experiments-client.coffee';
import interventionMonitor from '../lib/intervention-monitor.coffee';
import Tutorial from '../lib/tutorial.cjsx';
import preloadSubject from '../lib/preload-subject.coffee';
import SubjectViewer from '../components/subject-viewer.cjsx';
import FrameAnnotator from './frame-annotator.cjsx';
import workflowAllowsFlipbook from '../lib/workflow-allows-flipbook.coffee';
import workflowAllowsSeparateFrames from '../lib/workflow-allows-separate-frames.coffee';
import RenderTask from './render-task';
import RenderSummary from './render-summary';
import RenderGravitySpyGoldStandard from './render-gravity-spy-gold-standard';

/* eslint no-param-reassign: ["error", { "props": false }] */

class Classifier extends React.Component {
  constructor(props) {
    super(props);
    this.disableIntervention = this.disableIntervention.bind(this);
    this.enableIntervention = this.enableIntervention.bind(this);
    this.loadSubject = this.loadSubject.bind(this);
    this.prepareToClassify = this.prepareToClassify.bind(this);
    this.getExpertClassification = this.getExpertClassification.bind(this);
    this.handleGoldStandardChange = this.handleGoldStandardChange.bind(this);
    this.handleDemoModeChange = this.handleDemoModeChange.bind(this);
    this.handleSubjectImageLoad = this.handleSubjectImageLoad.bind(this);
    this.subjectIsGravitySpyGoldStandard = this.subjectIsGravitySpyGoldStandard.bind(this);
    this.state = {
      expertClassification: null,
      selectedExpertAnnotation: -1,
      showingExpertClassification: false,
      subjectLoading: false,
      renderIntervention: false,
    };
  }

  componentWillMount() {
    interventionMonitor.setProjectSlug(this.props.project.slug);
    // moved setState here to avoid re-render on componentDidMount
    this.setState({ renderIntervention: interventionMonitor.shouldShowIntervention() });
  }

  componentDidMount() {
    experimentsClient.startOrResumeExperiment(interventionMonitor, this.context.geordi);
    interventionMonitor.on('interventionRequested', this.enableIntervention);
    interventionMonitor.on('classificationTaskRequested', this.disableIntervention);
    this.loadSubject(this.props.subject);
    this.prepareToClassify(this.props.classification);
    Tutorial.startIfNecessary({ workflow: this.props.workflow, user: this.props.user, preferences: this.props.preferences });
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps !== this.props.project) || (nextProps.user !== this.props.user)) {
      if (this.props.preferences) {
        Tutorial.startIfNecessary({ workflow: this.props.workflow, user: this.props.user, preferences: this.props.preferences });
      }
    }
    if (nextProps.subject !== this.props.subject) {
      this.loadSubject(nextProps.subject);
    }
    if (nextProps.classification !== this.props.classification) {
      this.prepareToClassify(nextProps.classification);
    }
    if (this.context.geordi) {
      if ((nextProps.subject !== this.props.subject) || (!this.context.geordi.keys.subjectID)) {
        if (nextProps.subject) {
          this.context.geordi.remember({ subjectID: nextProps.subject.id });
        }
      }
    }
  }

  componentWillUnmount() {
    interventionMonitor.removeListener('interventionRequested', this.enableIntervention);
    interventionMonitor.removeListener('classificationTaskRequested', this.disableIntervention);
    try {
      if (this.context.geordi) {
        this.context.geordi.forget(['subjectID']);
      }
    } catch (e) {
      if (console) {
        console.log(e);
      }
    }
  }

  getExpertClassification(workflow, subject) {
    const awaitExpertClassification = Promise.resolve(() => {
      apiClient.get('/classifications/gold_standard', {
        workflow_id: workflow.id,
        subject_ids: [subject.id],
      }).catch(() => {
        return [];
      }).then(([expertClassification]) => {
        return expertClassification;
      });
    });
    awaitExpertClassification.then((expertClassificationIn) => {
      let subjectExpertClassificationData;
      if (subject.expert_classification_data) {
        subjectExpertClassificationData = subject.expert_classification_data[workflow.id];
      }
      const expertClassification = expertClassificationIn || subjectExpertClassificationData;
      if ((this.props.workflow === workflow) && (this.props.subject === subject)) {
        window.expertClassification = expertClassification;
        this.setState({ expertClassification });
      }
    });
  }

  loadSubject(subject) {
    this.setState({
      expertClassification: null,
      selectedExpertAnnotation: -1,
      showingExpertClassification: false,
      subjectLoading: true,
    });
    if (this.props.project.experimental_tools.indexOf('expert comparison summary') > -1) {
      this.getExpertClassification(this.props.workflow, this.props.subject);
    }
    preloadSubject(subject).then(() => {
      // The subject could have changed while we were loading.
      if (this.props.subject === subject) {
        this.setState({ subjectLoading: false });
        if (this.props.onLoad) {
          this.props.onLoad();
        }
      }
    });
  }

  prepareToClassify(classification) {
    classification.annotations = classification.annotations || [];
    if (classification.annotations.length === 0) {
      this.addAnnotationForTask(classification, this.props.workflow.first_task);
    }
  }

  disableIntervention() {
    this.setState({ renderIntervention: false });
  }

  enableIntervention() {
    let latestFromSugar;
    if (interventionMonitor) {
      latestFromSugar = interventionMonitor.latestFromSugar;
    }
    experimentsClient.logExperimentState(this.context.geordi, latestFromSugar, 'interventionDetected');
    this.setState({ renderIntervention: true });
  }

  subjectIsGravitySpyGoldStandard() {
    let isGold = false;
    if (this.props.workflow.configuration && this.props.subject.metadata) {
      if (this.props.workflow.configuration.gravity_spy_gold_standard && (this.props.subject.metadata['#Type'] === 'Gold')) {
        isGold = true;
      }
    }
    return isGold;
  }

  handleAnnotationChange(classification, newAnnotation) {
    classification.annotations[classification.annotations.length - 1] = newAnnotation;
    classification.update('annotations');
  }

  handleGoldStandardChange(e) {
    this.props.classification.update({ gold_standard: e.target.checked || undefined });
  }

  handleDemoModeChange(e) {
    this.props.onChangeDemoMode(e.target.checked);
  }

  handleSubjectImageLoad(e, frameIndex) {
    if (this.context.geordi) {
      if (this.props.subject) {
        this.context.geordi.remember({ subjectID: this.props.subject.id });
      }
    }
    const { naturalWidth, naturalHeight, clientWidth, clientHeight } = e.target;
    const changes = {};
    changes[`metadata.subject_dimensions.${frameIndex}`] = { naturalWidth, naturalHeight, clientWidth, clientHeight };
    this.props.classification.update(changes);
  }

  render() {
    const largeFormatImage = (this.props.workflow.configuration.image_layout) && (this.props.workflow.configuration.image_layout.indexOf('no-max-height') > -1);
    let classifierClassNames = 'classifier';
    if (largeFormatImage) {
      classifierClassNames += ' large-image';
    }
    let currentClassification = this.props.classification;
    let currentAnnotation;
    let currentTask;
    if (this.state.showingExpertClassification) {
      currentClassification = this.state.expertClassification;
    } else {
      if (!this.props.classification.completed) {
        currentAnnotation = currentClassification.annotations[currentClassification.annotations.length - 1];
        if (currentAnnotation) {
          currentTask = this.props.workflow.tasks[currentAnnotation.task];
        }
      }
    }
    let taskArea;
    let expertOptoinsProps = {
      handleGoldStandardChange: this.handleGoldStandardChange,
      handleDemoModeChange: this.handleDemoModeChange,
    };
    if (currentTask) {
      taskArea = (
        <RenderTask
          {...this.props}
          currentClassification={currentClassification}
          currentAnnotation={currentAnnotation}
          currentTask={currentTask}
          subjectLoading={this.state.subjectLoading}
          renderIntervention={this.state.renderIntervention}
          disableIntervention={this.disableIntervention}
          handleAnnotationChange={this.handleAnnotationChange}
          interventionMonitor={interventionMonitor}
          experimentsClient={experimentsClient}
          destroyCurrentAnnotation={this.destroyCurrentAnnotation}
          completeClassification={this.completeClassification}
          expertOptoinsProps={expertOptoinsProps}
        />
      );
    } else if (this.subjectIsGravitySpyGoldStandard()) {
      taskArea = (
        <RenderGravitySpyGoldStandard
          {...this.props}
          currentClassification={currentClassification}
        />
      );
    } else if (!this.props.workflow.configuration.hide_classification_summaries) {
      taskArea = (
        <RenderSummary
          {...this.props}
          currentClassification={currentClassification}
          expertOptoinsProps={expertOptoinsProps}
        />
      );
    }
    window.classification = currentClassification;
    return (
      <ChangeListener target={this.props.classification}>
        <div className={classifierClassNames}>
          <SubjectViewer
            user={this.props.user}
            project={this.props.project}
            subject={this.props.subject}
            workflow={this.props.workflow}
            preferences={this.props.preferences}
            classification={currentClassification}
            annotation={currentAnnotation}
            onLoad={this.handleSubjectImageLoad}
            frameWrapper={FrameAnnotator}
            allowFlipbook={workflowAllowsFlipbook(this.props.workflow)}
            allowSeparateFrames={workflowAllowsSeparateFrames(this.props.workflow)}
            onChange={this.handleAnnotationChange.bind(this, currentClassification)}
          />
          <div className="task-area">
            {taskArea}
          </div>
        </div>
      </ChangeListener>
    );
  }
}

Classifier.defaultProps = {
  user: null,
  workflow: null,
  subject: null,
  classification: null,
  onLoad: Function.prototype,
};

Classifier.propTypes = {
  user: React.PropTypes.object,
  workflow: React.PropTypes.object,
  subject: React.PropTypes.object,
  classification: React.PropTypes.object,
  preferences: React.PropTypes.object,
  project: React.PropTypes.object,
  onLoad: React.PropTypes.func,
  onChangeDemoMode: React.PropTypes.func,
  onClickNext: React.PropTypes.func,
};

Classifier.contextTypes = {
  geordi: React.PropTypes.object,
};

export default Classifier;
