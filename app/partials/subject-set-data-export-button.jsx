import counterpart from 'counterpart';
import apiClient from 'panoptes-client/lib/api-client';
import React, { Component } from 'react';
import Translate from 'react-translate-component';
import PropTypes from 'prop-types';
import DataExportDownloadLink from './data-export-download-link'

counterpart.registerTranslations('en', {
  dataExportDetails: {
    subjectSetExportId: 'Export for Subject Set ID: '
  }
});

class SubjectSetDataExportButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exportRequested: false,
      exportError: null,
      subjectSet: null
    };
    this.requestDataExport = this.requestDataExport.bind(this);
    this.handleExportSuccess = this.handleExportSuccess.bind(this);
    this.handleExportFail = this.handleExportFail.bind(this);
    this.getSubjectSetResource = this.getSubjectSetResource.bind(this);
  }

  componentDidMount() {
    this.getSubjectSetResource();
  }

  getSubjectSetResource() {
    const { subjectSetId } = this.props;
    apiClient.type('subject_sets').get(subjectSetId)
      .then((subjectSet) => {
        this.setState({ subjectSet });
      });
  }

  requestDataExport() {
    const { subjectSetId, exportType, contentType } = this.props;
    const url = `/subject_sets/${subjectSetId}/${exportType}`;
    apiClient.post(url, { media: { content_type: contentType } })
      .then(() => { this.handleExportSuccess(); })
      .catch((err) => { this.handleExportFail(err); });
  }

  handleExportSuccess() {
    this.setState({ exportRequested: true, exportError: null });
  }

  handleExportFail(err) {
    this.setState({ exportError: err, exportRequested: false });
  }

  render() {
    const { exportRequested, exportError, subjectSet } = this.state;
    const { buttonKey, exportType, subjectSetId } = this.props;
    return (
      <div>
        <div role="doc-subtitle">
          <small className="form-help">
            <Translate content="dataExportDetails.subjectSetExportId" />
            {subjectSetId}
          </small>
        </div>
        <button type="button" disabled={exportRequested} onClick={this.requestDataExport}>
          <Translate content={buttonKey} />
        </button>
        {' '}
        <small className="form-help">
          CSV format.
          {' '}
          {subjectSet && <DataExportDownloadLink resource={subjectSet} exportType={exportType} /> }
          <br />
        </small>
        {(() => {
          if (exportError) {
            return (<div className="form-help error">{exportError.toString()}</div>);
          } else if (exportRequested) {
            return (
              <div className="form-help success">
                We’ve received your request, check your email for a link to your data soon!
              </div>
            );
          }
        })()}
      </div>
    );
  }
}

SubjectSetDataExportButton.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  subjectSetId: PropTypes.string.isRequired,
  buttonKey: PropTypes.string.isRequired,
  exportType: PropTypes.string,
  contentType: PropTypes.string
};

SubjectSetDataExportButton.defaultProps = {
  contentType: 'text/csv',
  exportType: 'classifications_export',
};

export default SubjectSetDataExportButton;
