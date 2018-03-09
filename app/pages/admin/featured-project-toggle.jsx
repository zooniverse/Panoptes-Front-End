import PropTypes from 'prop-types';
import React, { Component } from 'react';
import AutoSave from '../../components/auto-save';

class FeaturedProjectToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: props.project
    };
  }

  handleChange(e) {
    const { project } = this.state;
    project.update({ featured: e.target.checked });
    this.setState(project);
  }

  render() {
    const { project } = this.state;
    return (
      <div>
        <AutoSave resource={project}>
          <h4>Featured project</h4>
          <label className="">
            <input
              type="checkbox"
              name="featured"
              checked={project.featured}
              onChange={this.handleChange.bind(this)}
            />
            {'Is the project featured?'}
          </label>
        </AutoSave>
      </div>
    );
  }
}

FeaturedProjectToggle.propTypes = {
  project: PropTypes.shape({
    featured: PropTypes.bool
  })
};

export default FeaturedProjectToggle;
