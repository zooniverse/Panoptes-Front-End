React = require 'react'
talkClient = require 'panoptes-client/lib/talk-client'
apiClient = require 'panoptes-client/lib/api-client'
Paginator = require '../talk/lib/paginator'
SubjectViewer = require '../components/subject-viewer'
PromiseRenderer = require '../components/promise-renderer'
{IndexLink, Link} = require 'react-router'
Translate = require 'react-translate-component'
counterpart = require 'counterpart'
Avatar = require '../partials/avatar'
Loading = require '../components/loading-indicator'
HandlePropChanges = require '../lib/handle-prop-changes'
TitleMixin = require '../lib/title-mixin'
ContextualLinks = require '../lib/contextual-links'

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

  getDefaultProps: ->
    collection: null

  componentDidMount: ->
    document.documentElement.classList.add 'on-collection-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-collection-page'

  getCollectionsLink: (ownerName) ->
    if @props.collection.favorite?
      ContextualLinks.prefixLinkIfNeeded(@props,"/favorites/#{ownerName}")
    else
      ContextualLinks.prefixLinkIfNeeded(@props,"/collections/#{ownerName}")

  getCollectionsLinkMessageKey: ->
    if @props.collection.favorite?
      "collectionPage.favoritesLink"
    else
      "collectionPage.collectionsLink"

  render: ->
    <PromiseRenderer promise={@props.collection.get('owner')}>{(owner) =>
      [ownerName, name] = @props.collection.slug.split('/')
      params = {owner: ownerName, name: name}

      collectionLink = ContextualLinks.prefixLinkIfNeeded(@props,"/collections/#{ownerName}/#{name}")

      isOwner = @props.user?.id is owner.id
      if isOwner
        settingsLink = ContextualLinks.prefixLinkIfNeeded(@props,"/collections/#{ownerName}/#{name}/settings")
        collabLink = ContextualLinks.prefixLinkIfNeeded(@props,"/collections/#{ownerName}/#{name}/collaborators")
      profileLink = ContextualLinks.prefixLinkIfNeeded(@props,"/users/#{ownerName}")
      nonBreakableOwnerName =  owner.display_name.replace /\ /g, "\u00a0"
      <div className="collections-page">
        <nav className="collection-nav tabbed-content-tabs">
          <IndexLink to="#{collectionLink}" activeClassName="active" className="tabbed-content-tab">
            <Avatar user={owner} />
            {@props.collection.display_name}
          </IndexLink>

          {if isOwner
            <Link to="#{settingsLink}" activeClassName="active" className="tabbed-content-tab">
              <Translate content="collectionPage.settings" />
            </Link>}

          {if isOwner
            <Link to="#{collabLink}" activeClassName="active" className="tabbed-content-tab">
              <Translate content="collectionPage.collaborators" />
            </Link>}
          <Link to="#{@getCollectionsLink(ownerName)}" activeClassName="active" className="tabbed-content-tab">
            <Translate content="#{@getCollectionsLinkMessageKey()}" user="#{nonBreakableOwnerName}" />
          </Link>
          <Link to="#{profileLink}" activeClassName="active" className="tabbed-content-tab">
            <Translate content="collectionPage.userLink" user="#{nonBreakableOwnerName}" />
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
    'params.owner': 'fetchCollection'
    'params.name': 'fetchCollection'
    'user': 'fetchCollection'

  getCollectionOwner: ->
    if @props.params.collection_owner?
      @props.params.collection_owner
    else
      @props.params.owner

  getCollectionName: ->
    if @props.params.collection_name?
      @props.params.collection_name
    else
      @props.params.name

  getPageClasses: ->
    if @props.project?
      return "content-container collection-page-with-project-context"
    else
      return "content-container"

  fetchCollection: ->
    @setState
      error: false
      loading: true

    apiClient.type('collections')
      .get(slug: @getCollectionOwner() + '/' + @getCollectionName(), include: 'owner')
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
    <div className="#{@getPageClasses()}">
      {if @state.collection
        <CollectionPage {...@props} collection={@state.collection} roles={@state.roles} />}

      {if @state.error
        <Translate component="p" content="collectionsPageWrapper.error" />}

      {if @state.loading
        <Loading />}
    </div>
