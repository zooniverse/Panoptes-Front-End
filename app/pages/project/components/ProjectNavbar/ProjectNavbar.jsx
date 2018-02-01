import _ from 'lodash';
import getRenderedSize from 'react-rendered-size';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withSizes from 'react-sizes';
import ProjectNavbarNarrow from './components/ProjectNavbarNarrow';
import ProjectNavbarWide from './components/ProjectNavbarWide';

function haveNavLinksChanged(oldProps, newProps) {
  const oldNavLinks = _.map(oldProps.navLinks, 'label');
  const newNavLinks = _.map(newProps.navLinks, 'label');
  return _.difference(newNavLinks, oldNavLinks).length > 0 || oldNavLinks.length !== newNavLinks.length;
}

function hasTitleChanged(oldProps, newProps) {
  return oldProps.projectTitle !== newProps.projectTitle;
}

export class ProjectNavbar extends Component {
  constructor(props) {
    super(props);
    this.setBreakpoint = this.setBreakpoint.bind(this);
    this.state = {
      breakpoint: 0
    };
  }

  componentDidMount() {
    this.setBreakpoint();
  }

  componentDidUpdate(prevProps) {
    if (haveNavLinksChanged(prevProps, this.props) ||
      hasTitleChanged(prevProps, this.props)) {
      this.setBreakpoint();
    }
  }

  setBreakpoint() {
    const sizes = getRenderedSize(
      <ProjectNavbarWide
        {...this.props}
        style={{
          position: 'absolute',
          visibility: 'hidden'
        }}
      />
    );

    this.setState({
      breakpoint: sizes.width
    });
  }

  render() {
    // 1200 is the max-width for the navbar wrapper
    const doesNavFit = this.state.breakpoint < 1200;
    const isWindowWide = this.props.width > this.state.breakpoint;
    const navbarNarrowProps = { ...this.props, useWideLayoutVariant: !doesNavFit };

    if ((isWindowWide) && (doesNavFit)) {
      return <ProjectNavbarWide {...this.props} />;
    }
    
    return <ProjectNavbarNarrow {...navbarNarrowProps} />;
  }
}

ProjectNavbar.propTypes = {
  navLinks: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string
  })),
  projectTitle: PropTypes.string,
  width: PropTypes.number
};

const mapSizesToProps = ({ width }) => ({
  width
});

export default withSizes(mapSizesToProps)(ProjectNavbar);
