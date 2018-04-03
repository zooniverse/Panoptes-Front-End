import PropTypes from 'prop-types';
import React from 'react';

function FeaturedProjectToggle({ error, handleProjectChange, project }) {
  if (project.launch_approved) {
    return (
      <div>
        <h4>Featured project</h4>
        <label className="">
          <input
            disabled={project.featured}
            checked={project.featured}
            name="featured"
            onChange={handleProjectChange}
            type="checkbox"
          />
          {'Is the project featured?'}
        </label>
        <span style={{ color: 'red' }}>{error ? error.message : null}</span>
      </div>
    );
  }
  return (
    <div>
      <h4>Featured project</h4>
      <p>{project.display_name} has not been approved for launch, so it can't be featured.</p>
    </div>
  );
}

FeaturedProjectToggle.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string
  }),
  handleProjectChange: PropTypes.func,
  project: PropTypes.shape({
    featured: PropTypes.bool
  })
};

export default FeaturedProjectToggle;
