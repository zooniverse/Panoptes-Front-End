import React, { Component } from 'react';
import forOwn from 'lodash/forOwn';
import MobileSection from './mobile-section';

const VALID_TASK_TYPES_FOR_MOBILE = ['single', 'multiple'];

class MobileSectionContainer extends Component {
  constructor(props) {
    super(props);
    this.checkShowSection = this.checkShowSection.bind(this);
    this.state = {
      showSection: false,
    };
  }

  componentWillMount() {
    this.checkShowSection();
  }

  componentDidUpdate() {
    this.checkShowSection();
  }

  render() {
    return (this.state.showSection)
      ? <MobileSection />
      : null;
  }

  checkShowSection() {
    const isValidTaskType = VALID_TASK_TYPES_FOR_MOBILE.includes(this.props.task.type);
    this.setState({ showSection: isValidTaskType });
  }

}

export default MobileSectionContainer;
