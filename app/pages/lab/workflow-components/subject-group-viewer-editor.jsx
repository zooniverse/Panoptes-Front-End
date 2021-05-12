/*
Subject Group Viewer Editor
---------------------------

Used by lab/workflow.cjsx, on Workflows with the experimental tool
"subjectGroupViewer" enabled.

Example: if a workflow is configured to use the SubjectGroupViewer with a
5x5 grid (of 200px by 200px cells), its configuration should look like...

workflow.configuration: {
  subject_viewer: "subjectGroup",
  subject_viewer_config: {
    cell_height: 200,
    cell_width: 200,
    grid_columns: 5,
    grid_rows: 5,
  }
}
 */

import PropTypes from 'prop-types';
import React from 'react';
import AutoSave from '../../../components/auto-save.coffee';

export default class SubjectGroupViewerEditor extends React.Component {
  constructor (props) {
    super(props)
    
    this.state = {}
  }
  
  saveViewerConfig () {
    console.log('hello')
  }
  
  toggleSubjectViewer (event) {
    if (!event.target) return
    const enableSGViewer = event.target.checked
    
    if (enableSGViewer) {
      
      const oldConfig = this.props.workflow.configuration || {}
      const newConfig = {
        ...oldConfig,
        subject_viewer: 'subjectGroup',
        subject_viewer_config: {
          cell_height: 200,
          cell_width: 200,
          grid_columns: 5,
          grid_rows: 5,
        }
      }
      
      this.props.workflow.update({ configuration: newConfig }).save()
      
    } else {
      const oldConfig = this.props.workflow.configuration || {}
      const newConfig = { ...oldConfig }
      
      delete newConfig.subject_viewer
      delete newConfig.subject_viewer_config
      
      this.props.workflow.update({ configuration: newConfig }).save()
    }
  }

  render () {
    const props = this.props
    const configuration = props.workflow && props.workflow.configuration || {}
    const enableSGViewer = configuration.subject_viewer === 'subjectGroup'
    
    return (
      <div>
        <span class="form-label">Subject Group Viewer Configuration</span>
        <br />
        <small class="form-help">Note: the Subject Group Viewer (aka "grid drawing tool") can only be used on the FEM classifier, not the PFE classifier.</small>
        <br />
        <label>
          <input type="checkbox" checked={enableSGViewer} onChange={this.toggleSubjectViewer.bind(this)} />
          Enable Subject Group Viewer for this workflow
        </label>
        
        {enableSGViewer && (
          <div>
            <b>Viewer Configuration</b>
            <br/>
            TODO
            <br/>
            <button onClick={this.saveViewerConfig.bind(this)}>Save viewer config</button>
          </div>
        )}
      </div>
    );
  }
}

SubjectGroupViewerEditor.defaultProps = {
  workflow: {}
};

SubjectGroupViewerEditor.propTypes = {
  workflow: PropTypes.shape({
    configuration: PropTypes.object
  })
};
