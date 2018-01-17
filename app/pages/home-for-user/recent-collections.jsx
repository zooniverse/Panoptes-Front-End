import PropTypes from 'prop-types';
import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import { Link } from 'react-router';
import HomePageSection from './generic-section';
import CollectionCard from '../collections/collection-card';

class RecentCollectionsSection extends React.Component {
  static propTypes = {
    onClose: PropTypes.func
  };

  static contextTypes = {
    user: PropTypes.object.isRequired
  };

  state = {
    collections: [],
    error: null,
    loading: false
  };

  componentDidMount() {
    this.fetchCollections(this.context.user);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.user !== this.context.user) {
      this.fetchCollections(nextContext.user);
    }
  }

  shared = (collection) => {
    return this.context.user.id !== collection.links.owner.id;
  };

  fetchCollections = (user) => {
    this.setState({
      error: null,
      collections: [],
      loading: true
    });

    apiClient.type('collections').get({
      page_size: 8,
      sort: '-updated_at',
      favorite: false,
      current_user_roles: 'owner,contributor,collaborator,viewer'
    })
    .then((collections) => {
      this.setState({ collections });
    })
    .catch((error) => {
      this.setState({
        error: error
      });
    })
    .then(() => {
      this.setState({
        loading: false
      });
    });
  };

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
            return (
              <CollectionCard
                key={collection.id}
                shared={this.shared(collection)}
                collection={collection}
                linkTo={`/collections/${collection.slug}`}
                translationObjectName="collectionsPage"
              />);
          })}
        </div>
      </HomePageSection>
    );
  }
}

export default RecentCollectionsSection;