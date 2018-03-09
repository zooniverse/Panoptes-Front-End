import PropTypes from 'prop-types';
import React, { Component } from 'react';

class FeaturedProjectToggle extends Component {
  render() {
    const { handleProjectChange, project } = this.props;
    return (
      <div>
        <h4>Featured project</h4>
        <label className="">
          <input
            type="checkbox"
            name="featured"
            checked={project.featured}
            onChange={handleProjectChange.bind(this)}
          />
          {'Is the project featured?'}
        </label>
      </div>
    );
  }
}

FeaturedProjectToggle.propTypes = {
  handleProjectChange: PropTypes.func,
  project: PropTypes.shape({
    featured: PropTypes.bool
  })
};

export default FeaturedProjectToggle;
