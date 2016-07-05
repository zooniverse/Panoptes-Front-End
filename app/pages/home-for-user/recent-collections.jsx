import React from 'react';
import HomePageSection from './generic-section';

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
    };
  },

  componentDidMount() {
    this.fetchCollections(this.context.user);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.context.user) {
      this.fetchCollections(nextProps.user);
    }
  },

  fetchCollections(user) {
    this.setState({
      loading: true,
      error: null,
    });

    user.get('collections', {
      page_size: 8,
      sort: '-updated_at',
    })
    .then((collections) => {
      this.setState({
        collections,
      });
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
        {this.state.collections.map((collection) => {
          return (
            <div key={collection.id}>
              {collection.id}
            </div>
          );
        })}
      </HomePageSection>
    );
  },
});

export default RecentCollectionsSection;
