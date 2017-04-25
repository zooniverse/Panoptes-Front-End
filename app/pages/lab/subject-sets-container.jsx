import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';

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
    const page = this.props.location.query.page || 1;
    this.getSubjectSets(page);
  }

  componentWillReceiveProps(nextProps) {
    const newPath = nextProps.location.pathname !== this.props.location.pathname;
    const newPage = nextProps.location.query.page;
    const pageChange = newPage !== this.props.location.query.page;
    if (newPath || pageChange) {
      this.getSubjectSets(newPage);
    }
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
        this.setState({
          subjectSetCreationInProgress: false
        });
        this.context.router.push(`/lab/${this.props.project.id}/subject-sets/${subjectSet.id}`);
      })
      .catch((error) => {
        this.setState({
          subjectSetCreationError: error,
          subjectSetCreationInProgress: false
        });
      })
      .then(() => {
        this.props.project.uncacheLink('subject_sets');
      });
  }

  labPath(postFix = '') {
    return `/lab/${this.props.project.id}${postFix}`;
  }

  render() {
    const hookProps = {
      createNewSubjectSet: this.createNewSubjectSet,
      defaultSubjectSetName: DEFAULT_SUBJECT_SET_NAME,
      labPath: this.labPath,
      onPageChange: this.onPageChange
    };

    const allProps = Object.assign({}, this.state, this.props, hookProps);

    return (
      <div>
        {React.cloneElement(this.props.children, allProps)}
      </div>
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
  children: React.PropTypes.node,
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
