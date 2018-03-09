import PropTypes from 'prop-types';
import React from 'react';
import AutoSave from '../../components/auto-save';
import handleInputChange from '../../lib/handle-input-change';

const FeaturedProjectToggle = ({ project }) => {
  const handleChange = handleInputChange.bind(project);
  return (
    <div>
      <AutoSave resource={project}>
        <h4>Featured project</h4>
        <label>
          <input
            type="checkbox"
            name="featured"
            checked={project.featured}
            onChange={handleChange}
          />
          {'Is the project featured?'}
        </label>
      </AutoSave>
    </div>
  );
};

FeaturedProjectToggle.propTypes = {
  project: PropTypes.shape({
    featured: PropTypes.bool
  })
};

export default FeaturedProjectToggle;
