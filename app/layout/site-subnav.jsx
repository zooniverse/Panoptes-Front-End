import React from 'react';
import ExpandableMenu from './expandable-menu';

class SiteSubnav extends React.Component {

  trigger() {
    return (
      <span
        className="site-nav__link"
        activeClassName="site-nav__link--active"
        title="News"
        aria-label="News"
      >
        News
      </span>
    );
  }

  render() {
    if (this.props.isMobile) {
      return this.props.children;
    } else {
      return (
        <ExpandableMenu
          className="site-nav__modal"
          trigger={this.trigger()}
        >
          {this.props.children}
        </ExpandableMenu>
      );
    }
  }
}

SiteSubnav.propTypes = {
  isMobile: React.PropTypes.bool,
  children: React.PropTypes.node
};

export default SiteSubnav;
