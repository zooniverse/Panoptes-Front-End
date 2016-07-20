React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
PromiseRenderer = require '../components/promise-renderer'
{IndexLink, Link} = require 'react-router'
Translate = require 'react-translate-component'
counterpart = require 'counterpart'
Avatar = require '../partials/avatar'
Loading = require '../components/loading-indicator'
HandlePropChanges = require '../lib/handle-prop-changes'
TitleMixin = require '../lib/title-mixin'
classNames = require 'classnames'

counterpart.registerTranslations 'en',
  collectionPage:
    settings: 'Settings'
    collaborators: 'Collaborators'
    collectionsLink: '%(user)s\'s\u00a0Collections'
    favoritesLink: '%(user)s\'s\u00a0Favorites'
    userLink: '%(user)s\'s\u00a0Profile'
  collectionsPageWrapper:
    error: 'There was an error retrieving this collection.'

CollectionPage = React.createClass
  displayName: 'CollectionPage'

  contextTypes:
    geordi: React.PropTypes.object

  componentWillReceiveProps: (nextProps, nextContext)->
    @logClick = nextContext?.geordi?.makeHandler? 'about-menu'

  getDefaultProps: ->
    collection: null

  componentDidMount: ->
    document.documentElement.classList.add 'on-collection-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-collection-page'

  render: ->
    <PromiseRenderer promise={@props.collection.get('owner')}>{(owner) =>
      baseType = if @props.collection.favorite then "favorites" else "collections"
      baseLink = ""
      if @props.project?
        baseLink = "/projects/#{@props.project.slug}"
      baseCollectionLink = "#{baseLink}/#{baseType}/#{@props.collection.slug}"
      baseCollectionsLink = "#{baseLink}/#{baseType}/#{owner.login}"
      isOwner = @props.user?.id is owner.id
      profileLink = "#{baseLink}/users/#{owner.login}"
      collectionsLinkMessageKey = "collectionPage.#{baseType}Link"

      <div className="collections-page">
        <nav className="collection-nav tabbed-content-tabs">
          <IndexLink to="#{baseCollectionLink}/#" activeClassName="active" className="tabbed-content-tab" onClick={@logClick?.bind(this, 'view-collection')}>
            <Avatar user={owner} />
            {@props.collection.display_name}
          </IndexLink>

          {if isOwner
            <Link to="#{baseCollectionLink}/settings" activeClassName="active" className="tabbed-content-tab" onClick={@logClick?.bind(this, 'settings-collection')}>
              <Translate content="collectionPage.settings" />
            </Link>}

          {if isOwner
            <Link to="#{baseCollectionLink}/collaborators" activeClassName="active" className="tabbed-content-tab" onClick={@logClick?.bind(this, 'collab-collection')}>
              <Translate content="collectionPage.collaborators" />
            </Link>}
          <Link to="#{baseCollectionsLink}/" className="tabbed-content-tab">
            <Translate content="#{collectionsLinkMessageKey}" user="#{@props.collection.links.owner.display_name}" />
          </Link>
          <Link to="#{profileLink}/" activeClassName="active" className="tabbed-content-tab">
            <Translate content="collectionPage.userLink" user="#{@props.collection.links.owner.display_name}" />
          </Link>
        </nav>
        <div className="collection-container talk">
          {React.cloneElement @props.children, {user: @props.user, collection: @props.collection, roles: @props.roles}}
        </div>
      </div>
    }</PromiseRenderer>

module.exports = React.createClass
  displayName: 'CollectionPageWrapper'

  mixins: [TitleMixin, HandlePropChanges]

  title: ->
    @state.collection?.display_name ? '(Loading)'

  getDefaultProps: ->
    params: null

  getInitialState: ->
    collection: null
    roles: null
    error: false
    loading: false

  propChangeHandlers:
    'params.collection_owner': 'fetchCollection'
    'params.collection_name': 'fetchCollection'
    'user': 'fetchCollection'

  fetchCollection: ->
    @setState
      error: false
      loading: true

    apiClient.type('collections')
      .get(slug: @props.params.collection_owner + '/' + @props.params.collection_name, include: 'owner')
      .then ([collection]) =>
        unless collection then @setState error: true

        apiClient.type('collection_roles')
          .get(collection_id: collection.id)
          .then (roles) =>
            @setState
              collection: collection
              roles: roles
      .catch =>
        @setState
          error: true
          collection: null
      .then =>
        @setState loading: false

  render: ->
    classes = classNames {
      "content-container"
      "collection-page-with-project-context": @props.project?
    }
    <div className={classes}>
      {if @state.collection
        <CollectionPage {...@props} collection={@state.collection} roles={@state.roles} />}

      {if @state.error
        <Translate component="p" content="collectionsPageWrapper.error" />}

      {if @state.loading
        <Loading />}
    </div>
