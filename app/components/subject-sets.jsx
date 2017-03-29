import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import SubjectSetsPage from '../pages/lab/subject-sets';

const DEFAULT_SUBJECT_SET_NAME = 'Untitled subject set';

export default class SubjectSetsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      subjectSetCreationError: null,
      subjectSetCreationInProgress: false,
      subjectSets: []
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.labPath = this.labPath.bind(this);
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
        if (this._isMounted) {
          this.setState({ subjectSetCreationInProgress: false });
        }
      });
  }

  labPath(postFix = '') {
    return `/lab/${this.props.project.id}${postFix}`;
  }

  render() {
    return (
      <SubjectSetsPage
        createNewSubjectSet={this.createNewSubjectSet}
        labPath={this.labPath}
        loading={this.state.loading}
        onPageChange={this.onPageChange}
        project={this.props.project}
        error={this.state.subjectSetCreationError}
        creationInProgress={this.state.subjectSetCreationInProgress}
        subjectSets={this.state.subjectSets}
      />
    );
  }
}

SubjectSetsContainer.contextTypes = {
  router: React.PropTypes.object.isRequired
};

SubjectSetsContainer.defaultProps = {
  project: {}
};

SubjectSetsContainer.propTypes = {
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
