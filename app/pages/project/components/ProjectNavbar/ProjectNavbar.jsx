import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LanguagePicker from '../LanguagePicker';
import ProjectNavbarNarrow from './components/ProjectNavbarNarrow';
import ProjectNavbarWide, { SizeAwareProjectNavbarWide } from './components/ProjectNavbarWide';

export const SettingsMenu = styled.div`
  text-align: right;
`;

class ProjectNavbar extends Component {
  constructor(props) {
    super(props);
    this.setBreakpoint = this.setBreakpoint.bind(this);
    this.state = {
      loading: true,
      useWide: false
    };
  }

  setBreakpoint(size) {
    // `size` is undefined when the component is first mounted, as there hasn't
    // been time for the callback to fire.
    // size.width will be 0 when the navbar begins to render, so ignore that too.
    
    if (size && size.width) {
      const useWide = size.width < document.body.clientWidth;
      const newState = (this.state.loading) ? { useWide, loading: false } : { useWide };
      this.setState(newState);
    }
  }

  render() {
    const { loading, useWide } = this.state;
    const NavBarComponent = useWide ? ProjectNavbarWide : ProjectNavbarNarrow;
    const navBar = loading ?
      (
        <SizeAwareProjectNavbarWide
          {...this.props}
          onSize={this.setBreakpoint}
          style={{
            visibility: 'hidden',
            position: 'absolute'
          }}
        />
      ) :
      (
        <NavBarComponent {...this.props}>
          <SettingsMenu>
            <LanguagePicker
              project={this.props.project}
            />
          </SettingsMenu>
        </NavBarComponent>
      )

      return navBar;
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
