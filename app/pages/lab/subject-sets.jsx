import React from 'react';
import { Link } from 'react-router';
import apiClient from 'panoptes-client/lib/api-client';
import LoadingIndicator from '../../components/loading-indicator';
import Paginator from '../../talk/lib/paginator';

const DEFAULT_SUBJECT_SET_NAME = 'Untitled subject set';

export default class SubjectSetsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      subjectSetCreationError: null,
      subjectSetCreationInProgress: false,
      subjectSets: []
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.createNewSubjectSet = this.createNewSubjectSet.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    const page = this.props.location.query.page || 1;
    this.getSubjectSets(page);
  }

  componentWillReceiveProps(nextProps) {
    const newPage = nextProps.location.query.page;
    if (newPage !== this.props.location.query.page) {
      this.getSubjectSets(newPage);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onPageChange(page) {
    const nextQuery = Object.assign({}, this.props.location.query, { page });
    this.context.router.push({
      pathname: this.props.location.pathname,
      query: nextQuery
    });
  }

  getSubjectSets(page = 1) {
    this.props.project.get('subject_sets', { sort: 'display_name', page })
    .then((subjectSets) => {
      this.setState({ subjectSets, loading: false });
    });
  }

  createNewSubjectSet() {
    const subjectSet = apiClient.type('subject_sets').create({
      display_name: DEFAULT_SUBJECT_SET_NAME,
      links:
        { project: 999999999999 }
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
        if (this._isMounted) {
          this.setState({ subjectSetCreationInProgress: false });
        }
      });
  }

  labPath(postFix = '') {
    return `/lab/${this.props.project.id}${postFix}`;
  }

  render() {
    const meta = this.state.subjectSets.length ? this.state.subjectSets[0].getMeta() : {};

    return (
      <div>
        <div className="form-label">Subject sets</div>
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

          {(this.state.subjectSets.length === 0 && this.state.loading === false) && (
            <p> No subject sets are currently associated with this project. </p>
          )}

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

        {this.state.subjectSets.length > 0 && (
          <Paginator
            className="talk"
            page={meta.page}
            onPageChange={this.onPageChange}
            pageCount={meta.page_count}
          />
        )}

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
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string,
    query: React.PropTypes.object
  }),
  project: React.PropTypes.shape({
    get: React.PropTypes.func,
    id: React.PropTypes.string,
    uncacheLink: React.PropTypes.func
  })
};
