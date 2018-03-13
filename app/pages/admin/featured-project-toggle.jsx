import PropTypes from 'prop-types';
import React from 'react';

function FeaturedProjectToggle({ error, handleProjectChange, project }) {
  return (
    <div>
      <h4>Featured project</h4>
      <label className="">
        <input
          disabled={project.featured}
          checked={project.featured}
          name="featured"
          onChange={handleProjectChange.bind(this)}
          type="checkbox"
        />
        {'Is the project featured?'}
      </label>
      <span style={{ color: 'red' }}>{error ? error.message : null}</span>
    </div>
  );
};

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
