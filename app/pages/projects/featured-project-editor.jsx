import apiClient from 'panoptes-client/lib/api-client';
import React, { cloneElement, Component } from 'react';
import ProjectsSearchSelector from './projects-search-selector';
import isAdmin from '../../lib/is-admin';


export default class FeaturedProjectEditor extends Component {
  constructor(props) {
    super(props)
    this.disableEditor = this.disableEditor.bind(this);
    this.enableEditor = this.enableEditor.bind(this);
    this.selectProject = this.selectProject.bind(this);
    this.state = {
      editing: false,
      project: props.project
    };
  }

  disableEditor() {
    this.setState({ editing: false });
  }

  enableEditor() {
    this.setState({ editing: true });
  }

  selectProject(project) {
    if (project.launch_approved) {
      this.props.project.update({ featured: false }).save();
      project.update({ featured: true }).save();
      this.setState({ editing: false, project });
    }
  }

  render() {
    const { children } = this.props;
    const { editing, project } = this.state;
    const canEdit = isAdmin();
    if (canEdit) {
      return (
        <div className="project-card-editor">
          {cloneElement(children, { project })}
          <div className="controls">
            {!editing && <button className="outlined-button" onClick={this.enableEditor}>edit</button>}
            {editing && 
              <>
                <button autoFocus className="outlined-button" onClick={this.disableEditor}>cancel</button>
                <ProjectsSearchSelector launchApproved onChange={this.selectProject} />
              </>
            }
          </div>
        </div>
      );
    } else {
      return children;
    }
  }
}