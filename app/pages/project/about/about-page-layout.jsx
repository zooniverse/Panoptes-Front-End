import PropTypes from 'prop-types';
import React from 'react';
import { Markdown } from 'markdownz';

const AboutPageLayout = ({ project, mainContent, aside }) => (
  <div className="columns-container">
    <Markdown project={project} className="column">
      {mainContent}
    </Markdown>
    {(aside) ? <hr /> : null}
    {(aside) ? <aside>{aside}</aside> : null}
  </div>
);

AboutPageLayout.propTypes = {
  project: PropTypes.object,
  mainContent: PropTypes.string,
  aside: PropTypes.element,
};

export default AboutPageLayout;