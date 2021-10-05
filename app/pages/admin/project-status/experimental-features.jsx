import PropTypes from 'prop-types';
import React, { Component } from 'react';
import AutoSave from '../../../components/auto-save';

const experimentalFeatures = [
  'allow workflow query',
  'anchoredEllipse',
  'combo',
  'crop',
  'dropdown',
  'enable subject flags',
  'expert comparison summary',
  'fan',
  'freehandLine',
  'freehandSegmentLine',
  'freehandSegmentShape',
  'freehandShape',
  'general feedback',
  'Gravity Spy Gold Standard',
  'highlighter',
  'mini-course',
  'museum-role',
  'quicktalk', // Enables "QuickTalk" component in FEM Classifier, which allows users to access Talk discussions on the Classifier page.
  'shortcut',
  'sim notification',
  'slider',
  'subjectGroupViewer', // Enables Subject Group Viewer and Subject Group Comparison Task, used for grid-like cell selection tasks. SGV and SGCT can be edited in PFE, but only works on the FEM classifier.
  'temporalPoint',
  'temporalRotateRectangle',
  'transcription-task',
  'translator-role',
  'wildcam classroom', // Indicates a Project is linked to a "WildCam Lab"-type Zooniverse Classroom. Allows the classifier to select a workflow (i.e. "classroom assignment") directly via ID.
  'workflow assignment',
  'worldwide telescope'
];

class ExperimentalFeatures extends Component {
  constructor(props) {
    super(props);
    this.updateFeatures = this.updateFeatures.bind(this);
    this.isEnabled = this.isEnabled.bind(this);
    this.tools = this.tools.bind(this);
  }

  updateFeatures(feature) {
    let tools = this.tools();

    if (this.isEnabled(feature)) {
      tools.splice(tools.indexOf(feature), 1);
    } else {
      tools = tools.concat([feature]);
    }

    this.props.project.update({ experimental_tools: tools });
  }

  isEnabled(feature) {
    return this.tools().indexOf(feature) >= 0;
  }

  tools() {
    if (this.props.project) {
      return this.props.project.experimental_tools || [];
    }
    return [];
  }

  render() {
    return (
      <div className='project-status__section'>
        <h4>Experimental Features</h4>
        <AutoSave resource={this.props.project}>
          <div className='project-status__section-table'>
            {experimentalFeatures.map((feature) => (
              <label
                key={feature}
                className='project-status__section-table-row'
              >
                <input
                  type='checkbox'
                  name={feature}
                  checked={this.isEnabled(feature)}
                  onChange={this.updateFeatures.bind(this, feature)}
                />
                {feature.charAt(0).toUpperCase() + feature.slice(1)}
              </label>
            ))}
          </div>
        </AutoSave>
      </div>
    );
  }
}

ExperimentalFeatures.propTypes = {
  project: PropTypes.object.isRequired
};

ExperimentalFeatures.defaultProps = {
  project: null
};

export default ExperimentalFeatures;
