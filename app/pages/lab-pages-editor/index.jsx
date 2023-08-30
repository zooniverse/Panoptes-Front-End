import React from 'react';
import PropTypes from 'prop-types';
import DataManager from './DataManager.jsx';
import Tester from './Tester.jsx';

function PagesEditor(props) {
  const { params } = props;

  return (
    <div>
      <h5>Pages Editor</h5>
      <DataManager
        key={params?.workflowId || '-'} //
        workflowId={params?.workflowId}
      >
        <h6>
          Workflow
          {' '}
          {params?.workflowId}
        </h6>
        <Tester />
      </DataManager>
    </div>
  );
}

PagesEditor.propTypes = {
  params: PropTypes.shape({
    workflowId: PropTypes.string
  })
};

PagesEditor.defaultProps = {
  params: {}
};

export default PagesEditor;
