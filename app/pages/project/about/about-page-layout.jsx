import React, { PropTypes } from 'react';
import markdownz from 'markdownz';
const Markdown = markdownz.Markdown;

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
