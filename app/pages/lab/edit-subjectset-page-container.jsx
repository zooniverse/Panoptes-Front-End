import React, { Component, PropTypes } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import EditSubjectSetPage from 'edit-subjectset-page';

// Constants

const propTypes = {};

const defaultProps = {
  params: null
};

const setSubjectSet = (subjectSetId) => {
  return apiClient.type('subject_sets')
  .get(subjectSetId)
  .then((subjectSet) => {
    this.setState({ subjectSet });
  })
  .catch((error) => {
    console.log('Failed to get subject set: ', error);
  });
};

// Component

class EditSubjectSetPageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectSet: null
    };
  }

  componentWillReceiveProps(prevProps, nextProps) {
    if (nextProps.params.subjectSetID !== prevProps.params.subjectSetID) {
      setSubjectSet(nextProps.params.subjectSetID);
    }
  }

  render() {
    return (this.state.subjectSet)
      ? <EditSubjectSetPage {...this.props} subjectSet={this.state.subjectSet} />
      : null;
  }
}

EditSubjectSetPageContainer.propTypes = propTypes;

EditSubjectSetPageContainer.defaultProps = defaultProps;

export default EditSubjectSetPageContainer;
