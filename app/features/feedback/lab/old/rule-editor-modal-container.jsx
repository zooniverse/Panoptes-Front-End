import React, { Component, PropTypes } from 'react';
import merge from 'lodash/merge';
import RuleEditorModal from './rule-editor-modal';

class RuleEditorModalContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saveEnabled: false,
    };
  }

  render() {
    return (
      <RuleEditorModal saveEnabled={this.state.saveEnabled} />
    );
  }
}

export default RuleEditorModalContainer;
