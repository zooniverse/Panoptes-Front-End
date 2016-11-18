import React, { PropTypes } from 'react';
import AboutPageLayout from './about-page-layout';

const SimplePageRenderer = ({ pageSlug, noContent, pages, project }) => {
  const matchingPage = pages.find(page => page.slug === pageSlug);
  const mainContent = (matchingPage && matchingPage.content && matchingPage.content !== '') 
      ? matchingPage.content 
      : noContent;
      
  return <AboutPageLayout project={project} mainContent={mainContent} />;
}

SimplePageRenderer.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string.isRequired,
    content: PropTypes.string,
  })),
  project: PropTypes.object,
  pageSlug: PropTypes.string,
  noContent: PropTypes.string,
};

const AboutProjectEducation = (props) => (
  <SimplePageRenderer {...props}
    pageSlug="education"
    noContent="This project has no educational resources yet."
  />
);

const AboutProjectFAQ = (props) => (
  <SimplePageRenderer {...props}
    pageSlug="faq"
    noContent="'This project has no frequently asked questions yet.'"
  />
);

const AboutProjectResearch = (props) => (
  <SimplePageRenderer {...props}
    pageSlug="research"
    noContent="This project has no science case yet."
  />
);

const AboutProjectResults = (props) => (
  <SimplePageRenderer {...props}
    pageSlug="results"
    noContent="This project has no results to report yet."
  />
);

const SimplePagePropTypes = {
  pages: PropTypes.array,
  project: PropTypes.object,
};

AboutProjectEducation.propTypes = SimplePagePropTypes;
AboutProjectFAQ.propTypes = SimplePagePropTypes;
AboutProjectResearch.propTypes = SimplePagePropTypes;
AboutProjectResults.propTypes = SimplePagePropTypes;

export {
  AboutProjectEducation,
  AboutProjectFAQ,
  AboutProjectResearch,
  AboutProjectResults,
};
