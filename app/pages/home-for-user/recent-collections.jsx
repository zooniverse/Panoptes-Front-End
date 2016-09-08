import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import HomePageSection from './generic-section';
import { Link } from 'react-router';
import CollectionCard from '../../partials/collection-card';

const RecentCollectionsSection = React.createClass({
  propTypes: {
    onClose: React.PropTypes.func,
  },

  contextTypes: {
    user: React.PropTypes.object,
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

  fetchCollections(user) {
    this.setState({
      loading: true,
      error: null,
      images: {},
    });

    user.get('collections', {
      page_size: 8,
      sort: '-updated_at',
      favorite: false,
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
            imageSrc = '/simple-avatar.jpg';
          }
          this.state.images[collection.id] = imageSrc;
          this.forceUpdate();
        });
      }));
    })
    .catch((error) => {
      this.setState({
        error: error,
        collections: [],
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

        <div className="collections-card-list">
          {this.state.collections.map((collection) => {
            return <CollectionCard key={collection.id} collection={collection} imagePromise={this.state.images[collection.id]} linkTo="#" translationObjectName="collectionsPage" />;
          })}
        </div>
      </HomePageSection>
    );
  },
});

export default RecentCollectionsSection;
