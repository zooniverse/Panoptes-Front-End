import PropTypes from 'prop-types';
import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import SubjectPage from './subject-page';

export default class SubjectPageContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collections: null,
      isFavorite: false,
      subject: null
    };

    this.setSubject = this.setSubject.bind(this);
    this.getCollections = this.getCollections.bind(this);
  }

  componentDidMount() {
    this.setSubject();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params && nextProps.params && nextProps.params.id !== this.props.params.id) {
      this.setSubject();
    }

    if (nextProps.location.query.collections_page !== this.props.location.query.collections_page) {
      this.getCollections(this.state.subject, nextProps.location.query.collections_page);
    }
  }

  onCollectionsPageChange(page) {
    this.getCollections(this.state.subject, page);
  }

  setSubject() {
    const subjectId = this.props.params.id.toString();
    apiClient.type('subjects').get(subjectId, { include: 'project' })
      .then((subject) => {
        this.setState({ subject });
        this.getCollections(subject, this.props.location.query.collections_page);
      });
  }

  getCollections(subject, page) {
    const query = {
      subject_id: subject.id,
      page_size: 6,
      sort: '-created_at',
      include: 'owner'
    };

    if (page) {
      query.page = page;
    }

    apiClient.type('collections').get(query)
      .then((collections) => {
        let isFavorite = false;
        if (collections && this.props.user) {
          const favoriteCollection = collections.filter((collection) => {
            return (
              collection.favorite &&
              collection.links.owner.id === this.props.user.id &&
              collection.links.projects.includes(this.props.project.id));
          });
          if (favoriteCollection.length > 0) {
            isFavorite = favoriteCollection[0].links.subjects.includes(subject.id);
          }
        }
        this.setState({ collections, isFavorite });
      });
  }

  render() {
    return (
      <SubjectPage
        collections={this.state.collections}
        isFavorite={this.state.isFavorite}
        project={this.props.project}
        section={this.props.section}
        subject={this.state.subject}
        user={this.props.user}
        {...this.props}
      />
    );
  }
}

SubjectPageContainer.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.shape({
      collections_page: PropTypes.string
    })
  }),
  params: PropTypes.shape({
    id: PropTypes.string
  }),
  project: PropTypes.shape({
    id: PropTypes.string
  }),
  section: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.string
  })
};