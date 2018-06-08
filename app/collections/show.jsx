import PropTypes from 'prop-types';
import React from 'react';
import { IndexLink, Link } from 'react-router';
import Translate from 'react-translate-component';
import apiClient from 'panoptes-client/lib/api-client';
import classNames from 'classnames';
import counterpart from 'counterpart';
import { Helmet } from 'react-helmet';
import Loading from '../components/loading-indicator';

counterpart.registerTranslations('en', {
  collectionPage: {
    settings: 'Collection Settings',
    collaborators: 'Collaborators',
    collectionsLink: '%(user)s\'s Collections',
    favoritesLink: '%(user)s\'s Favorites'
  },
  collectionsPageWrapper: {
    error: 'There was an error retrieving this collection.'
  },
  loading: '(Loading)'
});

class CollectionPage extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    collection: PropTypes.object.isRequired,
    project: PropTypes.object,
    children: PropTypes.node,
    roles: PropTypes.array
  };

  static contextTypes = {
    geordi: PropTypes.object
  };

  static defaultProps = {
    collection: null
  };

  state = {
    canCollaborate: false
  };

  componentDidMount() {
    this.canCollaborate();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (!!nextContext.geordi && !!nextContext.geordi.makeHandler) {
      this.logClick = nextContext.geordi.makeHandler('about-menu');
    }
  }

  canCollaborate() {
    const { owner, roles, user } = this.props;
    let canCollaborate = false;
    let isOwner = false;
    if (user && user.id) {
      canCollaborate = roles.some((role) => {
        const idMatch = (role.links.owner.id === user.id);
        const isCollaborator = role.roles.includes('collaborator');
        return isCollaborator && idMatch;
      });
      isOwner = user.id === owner.id;
    }

    this.setState({ canCollaborate: canCollaborate || isOwner });
  }

  render() {
    const title = `${this.props.collection.display_name} (${this.props.collection.links.subjects ? this.props.collection.links.subjects.length : 0})`;
    const baseType = this.props.collection.favorite ? 'favorites' : 'collections';
    let baseLink = '';
    if (!!this.props.project) {
      baseLink = `/projects/${this.props.project.slug}`;
    }
    const baseCollectionLink = `${baseLink}/collections/${this.props.collection.slug}`;
    const baseCollectionsLink = `${baseLink}/${baseType}/${this.props.owner.login}`;
    const profileLink = `${baseLink}/users/${this.props.owner.login}`;
    const collectionsLinkMessageKey = `collectionPage.${baseType}Link`;

    let userRole = [];
    if (!!this.props.user) {
      userRole = this.props.roles.filter((collectionRole) => {
        return collectionRole.links.owner.id === this.props.user.id;
      });
    }

    let displayRole = '';
    if (userRole.length > 0) {
      if (this.props.user && this.props.user.id === this.props.owner.id) {
        displayRole = " you're the owner";
      } else {
        displayRole = ` (you're a ${userRole[0].roles.join(', ')})`;
      }
    }

    return (
      <div className="collections-page">
        <div className="collection-header">
          <div>
            <IndexLink to={baseCollectionLink} className="collection__link collection-title">
              {title}
            </IndexLink>
            <br />
            <Link to={profileLink} className="collection__link collection-owner">
              BY {this.props.owner.display_name}
            </Link>
            {displayRole}
          </div>
          <nav className="collection-nav">
            {this.state.canCollaborate ?
              <Link to={`${baseCollectionLink}/settings`} activeClassName="active" className="collection__link collection-nav-item" onClick={!!this.logClick ? this.logClick.bind(this, 'settings-collection') : null}>
                <Translate content="collectionPage.settings" />
              </Link> : null}
            {this.state.canCollaborate ?
                <Link to={`${baseCollectionLink}/collaborators`} activeClassName="active" className="collection__link collection-nav-item" onClick={!!this.logClick ? this.logClick.bind(this, 'collab-collection') : null}>
                  <Translate content="collectionPage.collaborators" />
                </Link> : null}
            <Link to={baseCollectionsLink} className="collection__link collection-nav-item">
              <Translate content={collectionsLinkMessageKey} user={this.props.owner.display_name} />
            </Link>
          </nav>
        </div>
        {React.cloneElement(this.props.children, {
          canCollaborate: this.state.canCollaborate,
          user: this.props.user,
          project: this.props.project,
          collection: this.props.collection,
          roles: this.props.roles,
          owner: this.props.owner
        })}
      </div>
    );
  }
}

class CollectionPageWrapper extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    project: PropTypes.object,
    user: PropTypes.object,
    params: PropTypes.shape({
      collection_owner: PropTypes.string,
      collection_name: PropTypes.string
    })
  };

  static defaultProps = {
    params: null
  };

  state = {
    collection: null,
    roles: [],
    error: false,
    loading: false,
    owner: null
  };

  componentWillMount() {
    this.fetchCollection();
  }

  componentWillReceiveProps(newProps) {
    if (this.props.user !== newProps.user) {
      this.fetchCollection();
    }
  }

  componentWillUnmount() {
    this.state.collection.stopListening('change', this.listenToCollection);
  }

  listenToCollection = () => {
    const collection = this.state.collection;
    this.setState({ collection });
  };

  fetchCollection = () => {
    this.setState({
      loading: true
    });

    apiClient.type('collections').get({
      slug: `${this.props.params.collection_owner}/${this.props.params.collection_name}`
    }).then(([collection]) => {
      if (collection) {
        return [collection];
      } else {
        // Fallback to use collection id see zooniverse/Panoptes-Front-End#3549
        return apiClient.type('collections').get({
          id: this.props.params.collection_name
        });
      }
    }).then(([collection]) => {
      collection.listen('change', this.listenToCollection);
      this.fetchAllCollectionRoles(collection);
      this.fetchCollectionOwner(collection)
        .then((owner) => {
          this.setState({
            error: false,
            loading: false,
            collection,
            owner
          });
        });
    }).catch((e) => {
      console.error(e);
      this.setState({
        error: e,
        loading: false
      });
    });
  };

  fetchCollectionOwner = (collection) => {
    return apiClient.type('users').get(collection.links.owner.id)
      .then(owner => owner);
  };

  fetchAllCollectionRoles = (collection, _page = 1) => {
    const fetchAllCollectionRoles = this.fetchAllCollectionRoles;
    apiClient.type('collection_roles').get({ collection_id: collection.id, page: _page }).then((collectionRoles) => {
      const meta = collectionRoles[0].getMeta();

      if (meta.page !== meta.page_count) {
        fetchAllCollectionRoles(collection, meta.page + 1);
      }

      // Keep this from setting state more than necessary
      // Further refactoring needs to be done
      if (this.state.roles.length !== collection.links.collection_roles.length) {
        this.setState((prevState) => {
          const roles = prevState.roles.concat(collectionRoles);
          return { roles };
        });
      }
    });
  };

  render() {
    const classes = classNames({
      'content-container': true,
      'collection-page-with-project-context': !!this.props.project
    });
    const { project, user } = this.props;
    let output = null;
    if (this.state.collection) {
      output = (
        <CollectionPage
          params={this.props.params}
          project={project}
          user={user}
          collection={this.state.collection}
          owner={this.state.owner}
          roles={this.state.roles}
        >
          {this.props.children}
        </CollectionPage>);
    }
    if (this.state.error) {
      output = <Translate component="p" content="collectionsPageWrapper.error" />;
    }
    if (this.state.loading) {
      output = <Loading />;
    }
    return (
      <div className={classes}>
        <Helmet title={this.state.collection ? this.state.collection.display_name : counterpart('loading')} />
        {output}
      </div>
    );
  }
}

export default CollectionPageWrapper;