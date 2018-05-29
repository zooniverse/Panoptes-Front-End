import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProjectNavbarNarrow from './components/ProjectNavbarNarrow';
import ProjectNavbarWide, { SizeAwareProjectNavbarWide } from './components/ProjectNavbarWide';

function haveNavLinksChanged(oldProps, newProps) {
  const oldLinks = oldProps.navLinks.map(link => link.label);
  const newLinks = newProps.navLinks.map(link => link.label);

  // returns an array of values not included in the other using SameValueZero for equality comparison
  return _.difference(oldLinks, newLinks).length > 0 ||
    oldLinks.length !== newLinks.length;
}

class ProjectNavbar extends Component {
  constructor(props) {
    super(props);
    this.setBreakpoint = this.setBreakpoint.bind(this);
    this.state = {
      loading: true,
      useWide: false
    };
  }

  componentDidUpdate(prevProps) {
    if (haveNavLinksChanged(prevProps, this.props)) {
      this.setBreakpoint();
    }
  }

  setBreakpoint(size) {
    // `size` is undefined when the component is first mounted, as there hasn't
    // been time for the callback to fire.
    
    if (size) {
      const useWide = size.width < document.body.clientWidth;
      const newState = (this.state.loading) ? { useWide, loading: false } : { useWide };
      this.setState(newState);
    }
  }

  render() {
    const NavBarComponent = (this.state.useWide) ? ProjectNavbarWide : ProjectNavbarNarrow;

    return (
      <React.Fragment>
        {!this.state.loading &&
          <NavBarComponent {...this.props} />}
        <SizeAwareProjectNavbarWide
          {...this.props}
          onSize={this.setBreakpoint}
          style={{
            visibility: 'hidden',
            position: 'absolute'
          }}
        />
      </React.Fragment>
    );
  }
}

ProjectNavbar.defaultProps = {
  avatarSrc: '',
  backgroundSrc: '',
  launched: false,
  navLinks: [],
  projectLink: '',
  projectTitle: '',
  redirect: '',
  underReview: false
};

ProjectNavbar.propTypes = {
  avatarSrc: PropTypes.string,
  backgroundSrc: PropTypes.string,
  launched: PropTypes.bool,
  navLinks: PropTypes.arrayOf(PropTypes.object),
  projectTitle: PropTypes.string,
  projectLink: PropTypes.string,
  redirect: PropTypes.string,
  underReview: PropTypes.bool
};

export default ProjectNavbar;
