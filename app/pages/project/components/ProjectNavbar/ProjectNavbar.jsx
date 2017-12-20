import _ from 'lodash';
import getRenderedSize from 'react-rendered-size';
import React, { Component, PropTypes } from 'react';
import withSizes from 'react-sizes';
import ProjectNavbarNarrow from './components/ProjectNavbarNarrow';
import ProjectNavbarWide from './components/ProjectNavbarWide';

function haveNavLinksChanged(oldProps, newProps) {
  const oldNavLinks = _.map(oldProps.navLinks, 'label');
  const newNavLinks = _.map(newProps.navLinks, 'label');
  return _.difference(newNavLinks, oldNavLinks).length > 0;
}

function hasTitleChanged(oldProps, newProps) {
  return oldProps.projectTitle !== newProps.projectTitle;
}

class ProjectNavbar extends Component {
  constructor(props) {
    super(props);
    this.setBreakpoint = this.setBreakpoint.bind(this);
    this.state = {
      breakpoint: false
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
    if (this.props.width > this.state.breakpoint) {
      return <ProjectNavbarWide {...this.props} />;
    }
    return <ProjectNavbarNarrow {...this.props} />;
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
