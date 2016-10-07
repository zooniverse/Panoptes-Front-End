import React from 'react';
import TriggeredModalForm from 'modal-form/triggered';

const SiteSubnav = React.createClass({
  propTypes: {
    isMobile: React.PropTypes.bool,
    children: React.PropTypes.node
  },

  trigger() {
    return(
      <span className="site-nav__link"
        activeClassName="site-nav__link--active"
        title="News"
        aria-label="News">News</span>
    );
  },

  render() {
    if(this.props.isMobile) {
      return this.props.children;
    } else {
      return(
        <TriggeredModalForm className="site-nav__modal" trigger={this.trigger()}>
          {this.props.children}
        </TriggeredModalForm>
      );
    }
  }
});

export default SiteSubnav;
