import PropTypes from 'prop-types';
import React from 'react';

const FeaturedProjectToggle = ({ handleProjectChange, project }) => {
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
};

FeaturedProjectToggle.propTypes = {
  handleProjectChange: PropTypes.func,
  project: PropTypes.shape({
    featured: PropTypes.bool
  })
};

export default FeaturedProjectToggle;
