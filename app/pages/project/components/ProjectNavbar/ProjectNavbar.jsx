import _ from 'lodash';
import React, { Component } from 'react';
import ProjectNavbarNarrow from './components/ProjectNavbarNarrow';
import ProjectNavbarWide, { SizeAwareProjectNavbarWide } from './components/ProjectNavbarWide';

function haveNavLinksChanged(oldProps, newProps) {
  const oldLinks = _.map(oldProps.navLinks, 'label');
  const newLinks = _.map(newProps.navLinks, 'label');
  return _.difference(oldLinks, newLinks).length > 0 ||
    oldLinks.length !== newLinks.length;
}

class ProjectNavbar extends Component {
  constructor(props) {
    super(props);
    this.setBreakpoint = this.setBreakpoint.bind(this);
    this.state = {
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
      this.setState({ useWide });
    }
  }

  render() {
    const NavBarComponent = (this.state.useWide) ? ProjectNavbarWide : ProjectNavbarNarrow;

    return (
      <div>
        <NavBarComponent {...this.props} />
        <SizeAwareProjectNavbarWide
          {...this.props}
          onSize={this.setBreakpoint}
          style={{
            visibility: 'hidden',
            position: 'absolute'
          }}
        />
      </div>
    );
  }
}

export default ProjectNavbar;
