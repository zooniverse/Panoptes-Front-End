import PropTypes from 'prop-types';
import React from 'react';
import ExpandableMenu from './expandable-menu';

class SiteSubnav extends React.Component {

  render() {
    if (this.props.isMobile) {
      return this.props.children;
    } else {
      return (
        <ExpandableMenu
          className="site-nav__modal"
          trigger={
            <span className="site-nav__link">
              News
            </span>
          }
        >
          {this.props.children}
        </ExpandableMenu>
      );
    }
  }
}

SiteSubnav.propTypes = {
  isMobile: PropTypes.bool,
  children: PropTypes.node
};

export default SiteSubnav;