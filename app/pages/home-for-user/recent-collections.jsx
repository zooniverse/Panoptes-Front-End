import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import { Link } from 'react-router';
import HomePageSection from './generic-section';
import CollectionCard from '../collections/collection-card';

const RecentCollectionsSection = React.createClass({
  propTypes: {
    onClose: React.PropTypes.func,
  },

  contextTypes: {
    user: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      loading: false,
      error: null,
      collections: [],
      images: {},
    };
  },

  componentDidMount() {
    this.fetchCollections(this.context.user);
  },

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.user !== this.context.user) {
      this.fetchCollections(nextContext.user);
    }
  },

  shared(collection) {
    return this.context.user.id !== collection.links.owner.id
  },

  fetchCollections(user) {
    this.setState({
      loading: true,
      error: null,
      images: {},
      collections: [],
    });

    apiClient.type('collections').get({
      page_size: 8,
      sort: '-updated_at',
      favorite: false,
      current_user_roles: "owner,contributor,collaborator",
    })
    .then((collections) => {
      this.setState({ collections });

      return Promise.all(collections.map((collection) => {
        return apiClient.type('subjects').get({
          collection_id: collection.id,
          page_size: 1,
        })
        .then(([subject]) => {
          let imageSrc;
          if (subject !== undefined) {
            const firstLocationKey = Object.keys(subject.locations[0])[0];
            imageSrc = subject.locations[0][firstLocationKey];
          } else {
            imageSrc = '/simple-avatar.png';
          }
          const imageState = Object.assign({}, this.state.images);
          imageState[collection.id] = imageSrc;
          this.setState({
            images: imageState,
          });
        });
      }));
    })
    .catch((error) => {
      this.setState({
        error: error,
      });
    })
    .then(() => {
      this.setState({
        loading: false,
      });
    });
  },

  render() {
    return (
      <HomePageSection
        title="Recent collections"
        loading={this.state.loading}
        error={this.state.error}
        onClose={this.props.onClose}
      >
        <div className="home-page-section__sub-header">
          <Link to={`/collections/${this.context.user.login}`} className="outlined-button">See all</Link>
        </div>

        {this.state.collections.length === 0 && (
          <div className="home-page-section__header-label">
            <p> You have no collections. </p>
          </div>
        )}

        <div className="collections-card-list">
          {this.state.collections.map((collection) => {
            const subjectCount = collection.links.subjects ? collection.links.subjects.length : 0;
            return <CollectionCard key={collection.id} shared={this.shared(collection)} subjectCount={subjectCount} collection={collection} imagePromise={this.state.images[collection.id]} linkTo={`/collections/${collection.slug}`} translationObjectName="collectionsPage" />;
          })}
        </div>
      </HomePageSection>
    );
  },
});

export default RecentCollectionsSection;
