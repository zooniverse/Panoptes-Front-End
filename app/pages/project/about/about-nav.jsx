import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

counterpart.registerTranslations('en', {
  nav: {
    research: 'Research',
    results: 'Results',
    faq: 'FAQ',
    education: 'Education',
    team: 'The Team',
  }
});

const AboutNav = ({ pages, projectPath }) => (
  <span>
    {pages.map((page) => 
      <Link key={page.slug}
        to={`${projectPath}/about/${page.slug}`} 
        activeClassName="active"
        className="about-tabs">
        <Translate content={`nav.${page.slug}`} />
      </Link>
    )}
  </span>
);

AboutNav.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape({
     slug: PropTypes.string.isRequired,
   })).isRequired,
  projectPath: PropTypes.string.isRequired,
};

export default AboutNav;
