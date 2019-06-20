import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import languageList from '../../../constants/languages';

function TranslationTools(props) {
  const { languageCode, project } = props;
  const language = languageList.filter(option => option.value === languageCode)[0] || {};
  return (
    <span>
      <Link to={`/projects/${project.slug}?language=${languageCode}`}>
        <span>
          {language.label}
        </span>
        <i className="fa fa-hand-o-right fa-fw" /> Preview
      </Link>
      <a href={`https://translations.zooniverse.org/?#/project/${project.id}?language=${languageCode}`}>
        <i className="fa fa-pencil fa-fw" /> Edit
      </a>
    </span>
  );
}

TranslationTools.propTypes = {
  languageCode: PropTypes.string.isRequired,
  project: PropTypes.shape({
    slug: PropTypes.string
  }).isRequired
};

TranslationTools.defaultProps = {
  project: {
    slug: ''
  }
};

export default TranslationTools;
