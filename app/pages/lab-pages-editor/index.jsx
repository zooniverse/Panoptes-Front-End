// ESLint: don't import global React, and don't use .defaultProps.
/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */

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

export default PagesEditor;
