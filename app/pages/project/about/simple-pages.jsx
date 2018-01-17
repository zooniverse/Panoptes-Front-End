import PropTypes from 'prop-types';
import React from 'react';
import AboutPageLayout from './about-page-layout';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

counterpart.registerTranslations('en', {
  aboutPages: {
    missingContent: {
      education: 'This project has no educational resources yet.',
      faq: 'This project has no frequently asked questions yet.',
      research: 'This project has no science case yet.',
      results: 'This project has no results to report yet.',
    }
  }
});

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
    noContent={counterpart('aboutPages.missingContent.education')}
  />
);

const AboutProjectFAQ = (props) => (
  <SimplePageRenderer {...props}
    pageSlug="faq"
    noContent={counterpart('aboutPages.missingContent.faq')}
  />
);

const AboutProjectResearch = (props) => (
  <SimplePageRenderer {...props}
    pageSlug="research"
    noContent={counterpart('aboutPages.missingContent.research')}
  />
);

const AboutProjectResults = (props) => (
  <SimplePageRenderer {...props}
    pageSlug="results"
    noContent={counterpart('aboutPages.missingContent.results')}
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