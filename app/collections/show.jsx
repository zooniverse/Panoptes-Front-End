import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import { IndexLink, Link } from 'react-router';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import Avatar from '../partials/avatar';
import Loading from '../components/loading-indicator';
import TitleMixin from '../lib/title-mixin';
import classNames from 'classnames';

counterpart.registerTranslations('en', {
  collectionPage: {
    settings: 'Settings',
    collaborators: 'Collaborators',
    collectionsLink: '%(user)s\'s Collections',
    favoritesLink: '%(user)s\'s Favorites',
    userLink: '%(user)s\'s Profile',
  },
  collectionsPageWrapper: {
    error: 'There was an error retrieving this collection.',
  },
});

const CollectionPage = React.createClass({

  propTypes: {
    user: React.PropTypes.object,
    collection: React.PropTypes.object.isRequired,
    project: React.PropTypes.object,
    children: React.PropTypes.node,
    roles: React.PropTypes.array,
  },

  contextTypes: {
    geordi: React.PropTypes.object,
  },

  getDefaultProps() {
    return {
      collection: null,
    };
  },

  getInitialState() {
    return {
      owner: null,
    };
  },

  componentWillMount() {
    !!this.props.collection && apiClient.type('users')
      .get(this.props.collection.links.owner.id)
      .then((owner) => {
        this.setState({ owner });
      });
  },

  componentDidMount() {
    document.documentElement.classList.add('on-collection-page');
  },

  componentWillReceiveProps(nextProps, nextContext) {
    if (!!nextContext.geordi && !!nextContext.geordi.makeHandler) {
      this.logClick = nextContext.geordi.makeHandler('about-menu');
    }
  },

  componentWillUnmount() {
    document.documentElement.classList.remove('on-collection-page');
  },

  render() {
    if (!this.state.owner) {
      return null;
    }

    const baseType = this.props.collection.favorite ? 'favorites' : 'collections';
    let baseLink = '';
    if (!!this.props.project) {
      baseLink = `/projects/${this.props.project.slug}`;
    }
    const baseCollectionLink = `${baseLink}/collections/${this.props.collection.slug}`;
    const baseCollectionsLink = `${baseLink}/${baseType}/${this.state.owner.login}`;
    const isOwner = !!this.props.user && this.props.user.id === this.state.owner.id;
    const profileLink = `${baseLink}/users/${this.state.owner.login}`;
    const collectionsLinkMessageKey = `collectionPage.${baseType}Link`;

    return (
      <div className="collections-page">
        <nav className="collection-nav tabbed-content-tabs">
          <IndexLink to={baseCollectionLink} activeClassName="active" className="tabbed-content-tab" onClick={!!this.logClick ? this.logClick.bind(this, 'view-collection') : null}>
            <Avatar user={this.state.owner} />
            {this.props.collection.display_name}
          </IndexLink>
          {isOwner ?
            <span>
              <Link to={`${baseCollectionLink}/settings`} activeClassName="active" className="tabbed-content-tab" onClick={!!this.logClick ? this.logClick.bind(this, 'settings-collection') : null}>
                <Translate content="collectionPage.settings" />
              </Link>
              <Link to={`${baseCollectionLink}/collaborators`} activeClassName="active" className="tabbed-content-tab" onClick={!!this.logClick ? this.logClick.bind(this, 'collab-collection') : null}>
                <Translate content="collectionPage.collaborators" />
              </Link>
            </span> :
            null
          }
          <Link to={baseCollectionsLink} className="tabbed-content-tab">
            <Translate content={collectionsLinkMessageKey} user={this.state.owner.display_name} />
          </Link>
          <Link to={profileLink} activeClassName="active" className="tabbed-content-tab">
            <Translate content="collectionPage.userLink" user={this.state.owner.display_name} />
          </Link>
        </nav>
        <div className="collection-container talk">
          {React.cloneElement(this.props.children, {
            user: this.props.user,
            collection: this.props.collection,
            roles: this.props.roles,
          })}
        </div>
      </div>
    );
  },
});

const CollectionPageWrapper = React.createClass({
  mixins: [TitleMixin],

  propTypes: {
    children: React.PropTypes.node,
    project: React.PropTypes.object,
    user: React.PropTypes.object,
    params: React.PropTypes.shape({
      collection_owner: React.PropTypes.string,
      collection_name: React.PropTypes.string,
    }),
  },

  getDefaultProps() {
    return {
      params: null,
    };
  },

  getInitialState() {
    return {
      collection: null,
      roles: null,
      error: false,
      loading: false,
    };
  },

  componentWillMount() {
    this.fetchCollection();
  },

  componentWillReceiveProps(newProps) {
    if (this.props.user !== newProps.user) {
      this.fetchCollection();
    }
  },

  title() {
    return this.state.collection ? this.state.collection.display_name : '(Loading)';
  },

  fetchCollection() {
    this.setState({
      loading: true,
    });

    apiClient.type('collections')
      .get(
        { slug: `${this.props.params.collection_owner}/${this.props.params.collection_name}` },
        { include: ['owner'] }
      )
      .then(([collection]) => {
        if (collection) {
          return [collection]
        } else {
          return apiClient.type('collections')
          .get({
            id: this.props.params.collection_name,
            include: ['owner']
          })
        }
      })
      .then(([collection]) => {
        return apiClient.type('collection_roles')
          .get({
            collection_id: collection.id,
          })
          .then((roles) => {
            this.setState({
              error: false,
              loading: false,
              collection,
              roles,
            });
          });
      })
      .catch((e) => {
        this.setState({
          error: e,
          loading: false,
        });
      });
  },

  render() {
    const classes = classNames({
      'content-container': true,
      'collection-page-with-project-context': !!this.props.project,
    });
    const { project, user } = this.props;
    let output = null;
    if (this.state.collection) {
      output =
        <CollectionPage project={project} user={user} collection={this.state.collection} roles={this.state.roles}>
          {this.props.children}
        </CollectionPage>;
    }
    if (this.state.error) {
      output = <Translate component="p" content="collectionsPageWrapper.error" />;
    }
    if (this.state.loading) {
      output = <Loading />;
    }
    return (
      <div className={classes}>
        {output}
      </div>
    );
  },
});

export default CollectionPageWrapper;
