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

const CollectionPage = React.createClass({

  propTypes: {
    user: React.PropTypes.object,
    collection: React.PropTypes.object.isRequired,
    project: React.PropTypes.object,
    children: React.PropTypes.node,
    roles: React.PropTypes.array
  },

  contextTypes: {
    geordi: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      collection: null
    };
  },

  getInitialState() {
    return {
      canCollaborate: false,
      owner: null
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
    this.canCollaborate();
  },

  componentWillReceiveProps(nextProps, nextContext) {
    if (!!nextContext.geordi && !!nextContext.geordi.makeHandler) {
      this.logClick = nextContext.geordi.makeHandler('about-menu');
    }
  },

  componentWillUnmount() {
    document.documentElement.classList.remove('on-collection-page');
  },

  canCollaborate() {
    let canCollaborate;
    if (!this.props.user) {
      canCollaborate = false;
    } else {
      canCollaborate = this.props.roles.some((role) => {
        const idMatch = (role.links.owner.id === this.props.user.id);
        const isOwner = role.roles.includes('owner');
        const isCollaborator = role.roles.includes('collaborator');
        return (isOwner || isCollaborator) && idMatch;
      });
    }

    this.setState({ canCollaborate });
  },

  render() {
    if (!this.state.owner) {
      return null;
    }

    const title = `${this.props.collection.display_name} (${this.props.collection.links.subjects ? this.props.collection.links.subjects.length : null})`;
    const baseType = this.props.collection.favorite ? 'favorites' : 'collections';
    let baseLink = '';
    if (!!this.props.project) {
      baseLink = `/projects/${this.props.project.slug}`;
    }
    const baseCollectionLink = `${baseLink}/collections/${this.props.collection.slug}`;
    const baseCollectionsLink = `${baseLink}/${baseType}/${this.state.owner.login}`;
    const profileLink = `${baseLink}/users/${this.state.owner.login}`;
    const collectionsLinkMessageKey = `collectionPage.${baseType}Link`;

    let userRole = [];
    if (!!this.props.user) {
      userRole = this.props.roles.filter((collectionRole) => {
        return collectionRole.links.owner.id === this.props.user.id;
      });
    }

    let displayRole = '';
    if (userRole.length > 0) {
      if (userRole[0].roles.includes('owner')) {
        displayRole = ` (you're the ${userRole[0].roles.join(', ')})`;
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
              BY {this.state.owner.display_name}
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
              <Translate content={collectionsLinkMessageKey} user={this.state.owner.display_name} />
            </Link>
          </nav>
        </div>
        {React.cloneElement(this.props.children, {
          canCollaborate: this.state.canCollaborate,
          user: this.props.user,
          project: this.props.project,
          collection: this.props.collection,
          roles: this.props.roles,
          owner: this.state.owner
        })}
      </div>
    );
  }
});

const CollectionPageWrapper = React.createClass({
  propTypes: {
    children: React.PropTypes.node,
    project: React.PropTypes.object,
    user: React.PropTypes.object,
    params: React.PropTypes.shape({
      collection_owner: React.PropTypes.string,
      collection_name: React.PropTypes.string
    })
  },

  getDefaultProps() {
    return {
      params: null
    };
  },

  getInitialState() {
    return {
      collection: null,
      roles: null,
      error: false,
      loading: false
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

  componentWillUnmount() {
    this.state.collection.stopListening('change', this.listenToCollection);
  },

  listenToCollection() {
    const collection = this.state.collection;
    this.setState({ collection });
  },

  title() {
    return this.state.collection ? this.state.collection.display_name : counterpart('loading');
  },

  fetchCollection() {
    this.setState({
      loading: true
    });

    apiClient.type('collections')
      .get(
        { slug: `${this.props.params.collection_owner}/${this.props.params.collection_name}` },
        { include: ['owner'] }
      )
      .then(([collection]) => {
        if (collection) {
          return [collection];
        } else {
          return apiClient.type('collections')
          .get({
            id: this.props.params.collection_name,
            include: ['owner']
          });
        }
      })
      .then(([collection]) => {
        collection.listen('change', this.listenToCollection);

        return apiClient.type('collection_roles')
          .get({
            collection_id: collection.id
          })
          .then((roles) => {
            this.setState({
              error: false,
              loading: false,
              collection,
              roles
            });
          });
      })
      .catch((e) => {
        this.setState({
          error: e,
          loading: false
        });
      });
  },

  render() {
    const classes = classNames({
      'content-container': true,
      'collection-page-with-project-context': !!this.props.project
    });
    const { project, user } = this.props;
    let output = null;
    if (this.state.collection) {
      output = (
        <CollectionPage project={project} user={user} collection={this.state.collection} roles={this.state.roles}>
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
        <Helmet title={this.title()} />
        {output}
      </div>
    );
  }
});

export default CollectionPageWrapper;
