import PropTypes from 'prop-types';
import React from 'react';
import Dialog from 'modal-form/dialog';
import ExportWorkflowsDialog from './export-workflows-dialog';

class WorkflowClassificationExportButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exportError: null,
      exportRequested: false
    };

    this.showWorkflowExport = this.showWorkflowExport.bind(this);
    this.handleExportFail = this.handleExportFail.bind(this);
    this.handleExportSuccess = this.handleExportSuccess.bind(this);
  }

  handleExportFail(err) {
    this.setState({ exportError: err, exportRequested: false });
  }

  handleExportSuccess() {
    this.setState({ exportRequested: true, exportError: null });
  }

  showWorkflowExport() {
    this.setState({ exportRequested: false, exportError: null });
    Dialog.alert(
      <ExportWorkflowsDialog project={this.props.project} onSuccess={this.handleExportSuccess} onFail={this.handleExportFail} />,
    );
  }

  render() {
    return (
      <div>
        <button onClick={this.showWorkflowExport}>Request new workflow classification export</button>
        <small className="form-help"> CSV format.</small>
        { this.state.exportRequested ? <div className="form-help success">We’ve received your request, check your email for a link to your data soon!</div> : null }
      </div>
    );
  }
}

WorkflowClassificationExportButton.propTypes = {
  project: PropTypes.shape({ links: PropTypes.object }).isRequired
};

export default WorkflowClassificationExportButton;