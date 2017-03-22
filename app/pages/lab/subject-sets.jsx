import React from 'react';
import { Link } from 'react-router';
import apiClient from 'panoptes-client/lib/api-client';
import LoadingIndicator from '../../components/loading-indicator';

const DEFAULT_SUBJECT_SET_NAME = 'Untitled subject set';

export default class SubjectSetsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectSetCreationError: null,
      subjectSetCreationInProgress: false,
      subjectSets: []
    };
  }

  componentWillMount() {
    this.props.project.get('subject_sets', { sort: 'display_name', page_size: 250 })
    .then((subjectSets) => {
      this.setState({ subjectSets });
    });
  }

  createNewSubjectSet() {
    const subjectSet = apiClient.type('subject_sets').create({
      display_name: DEFAULT_SUBJECT_SET_NAME,
      links:
        { project: this.props.project.id }
    });

    this.setState({
      subjectSetCreationError: null,
      subjectSetCreationInProgress: true
    });

    subjectSet.save()
      .then(() => {
        this.context.router.push(`/lab/${this.props.project.id}/subject-set/${subjectSet.id}`);
      })
      .catch((error) => {
        this.setState({ subjectSetCreationError: error });
      })
      .then(() => {
        this.props.project.uncacheLink('subject_sets');
        this.setState({ subjectSetCreationInProgress: false });
      });
  }

  labPath(postFix = '') {
    return `/lab/${this.props.project.id}${postFix}`;
  }

  render() {
    return (
      <div>
        <div className="nav-list-header">Subject sets</div>
        <ul className="nav-list">
          {this.state.subjectSets.map((subjectSet) => {
            const subjectSetListLabel = subjectSet.display_name || <i>{'Untitled subject set'}</i>;
            return (
              <li key={subjectSet.id}>
                <Link
                  activeClassName="active"
                  className="nav-list-item"
                  title="A subject is an image (or group of images) to be analyzed."
                  to={this.labPath(`/subject-set/${subjectSet.id}`)}
                >
                  {subjectSetListLabel}
                </Link>
              </li>
            );
          })}
          <li className="nav-list-item">
            <button type="button" onClick={this.createNewSubjectSet} disabled={this.state.subjectSetCreationInProgress} title="A subject is an image (or group of images) to be analyzed.">
              New subject set{' '}
              <LoadingIndicator off={!this.state.subjectSetCreationInProgress} />
            </button>{' '}
            {this.state.subjectSetCreationError && (
              <div className="form-help error">{this.state.subjectSetCreationError.message}</div>
            )}
          </li>
        </ul>
      </div>
    );
  }
}

SubjectSetsPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

SubjectSetsPage.defaultProps = {
  project: {}
};

SubjectSetsPage.propTypes = {
  project: React.PropTypes.shape({
    get: React.PropTypes.func,
    id: React.PropTypes.string,
    uncacheLink: React.PropTypes.func
  })
};
