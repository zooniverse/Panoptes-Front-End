/*
Subject Group Viewer Editor
---------------------------

Used by lab/workflow.cjsx, on Workflows with the experimental tool
"subjectGroupViewer" enabled.

Example: if a workflow is configured to use the SubjectGroupViewer with a
5x5 grid (of 200px by 200px cells), its configuration should look like...

workflow.configuration: {
  subject_viewer: "subjectGroup",
  subject_viewer_config: {  // Used by the frontend classifier
    cell_height: 200,
    cell_width: 200,
    grid_columns: 5,
    grid_rows: 5,
  },
  subject_group: {   // Used by the backend "/subjects/grouped" endpoint
    num_columns: 5,  // this must match grid_columns
    num_rows: 5,     // this must match grid_rows
  }
}
 */

import PropTypes from 'prop-types';
import React from 'react';
import AutoSave from '../../../components/auto-save.coffee';

export default class SubjectGroupViewerEditor extends React.Component {
  constructor (props) {
    super(props)
    
    const subjectViewerConfig = props.workflow && props.workflow.configuration && props.workflow.configuration.subject_viewer_config || {}
    
    this.state = {
      stateChanged: false,
      cell_height: subjectViewerConfig.cell_height || '',
      cell_width: subjectViewerConfig.cell_width || '',
      grid_columns: subjectViewerConfig.grid_columns || '',
      grid_rows: subjectViewerConfig.grid_rows || '',
    }
  }
  
  /*
  Changes to the subject viewer config are saved to the state as a buffer.
  We're not using autosave here since a user might change a large number of
  subject viewer config items before being satisfied.
   */
  updateViewerConfig (event) {
    if (!event.target) return
    this.setState({
      stateChanged: true,
      [event.target.dataset.configkey]: event.target.value,
    })
  }
  
  /*
  Manually saves the subject viewer config changes to the Workflow resource.
   */
  saveViewerConfig () {
    const state = this.state
    const subject_viewer_config = {
      cell_height: parseInt(state.cell_height),
      cell_width: parseInt(state.cell_width),
      grid_columns: parseInt(state.grid_columns),
      grid_rows: parseInt(state.grid_rows),
    }
    
    const subject_group = {
      num_columns: parseInt(state.grid_columns),
      num_rows: parseInt(state.grid_rows),
    }
    
    // TODO: some items are optional. Setting a blank string for their values should REMOVE those items from the config.
    
    this.props.workflow.update({
      'configuration.subject_viewer_config': subject_viewer_config,
      'configuration.subject_group': subject_group,
    })
    .save()
    .then(() => {
      this.setState({
        stateChanged: false,
      })
    })
  }
  
  /*
  Enables/disables the Subject Group Viewer system for this workflow.
  When enabling, a DEFAULT set of configuration values is generated as a guideline.
   */
  toggleSubjectViewer (event) {
    if (!event.target) return
    const enableSGViewer = event.target.checked
    
    if (enableSGViewer) {
      
      // Submit the changes to the database
      const oldConfig = this.props.workflow.configuration || {}
      const newConfig = {
        ...oldConfig,
        subject_viewer: 'subjectGroup',
        subject_viewer_config: {
          cell_height: 200,
          cell_width: 200,
          grid_columns: 5,
          grid_rows: 5,
        },
        subject_group: {
          num_columns: 5,
          num_rows: 5, 
        },
      }
      this.props.workflow.update({ configuration: newConfig }).save()
      
      // Sync the React component
      this.setState({
        stateChanged: false,
        cell_height: newConfig.subject_viewer_config.cell_height,
        cell_width: newConfig.subject_viewer_config.cell_width,
        grid_columns: newConfig.subject_viewer_config.grid_columns,
        grid_rows: newConfig.subject_viewer_config.grid_rows,
      })
      
    } else {
      const oldConfig = this.props.workflow.configuration || {}
      const newConfig = { ...oldConfig }
      
      delete newConfig.subject_viewer
      delete newConfig.subject_viewer_config
      delete newConfig.subject_group
      
      this.props.workflow.update({ configuration: newConfig }).save()
      // Note: no need to setState() here; it's redundant.
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
            <small>Viewer Configuration</small>
            <br/>
            <table>
              <tbody>
                <tr>
                  <td>cell_width</td>
                  <td><input data-configkey="cell_width" value={this.state.cell_width} onChange={this.updateViewerConfig.bind(this)} /> pixels</td>
                </tr>
                <tr>
                  <td>cell_height</td>
                  <td><input data-configkey="cell_height" value={this.state.cell_height} onChange={this.updateViewerConfig.bind(this)} /> pixels</td>
                </tr>
                <tr>
                  <td>grid_columns</td>
                  <td><input data-configkey="grid_columns" value={this.state.grid_columns} onChange={this.updateViewerConfig.bind(this)} /> cells</td>
                </tr>
                <tr>
                  <td>grid_rows</td>
                  <td><input data-configkey="grid_rows" value={this.state.grid_rows} onChange={this.updateViewerConfig.bind(this)} /> cells</td>
                </tr>
              </tbody>
            </table>
            <small class="form-help">Note: as of May 2021, the maximum grid size is 25 cells.</small>
            <br/>
            <button onClick={this.saveViewerConfig.bind(this)} disabled={!this.state.stateChanged}>Save viewer config</button>
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
