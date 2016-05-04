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

counterpart.registerTranslations 'en',
  collectionPage:
    settings: 'Settings'
    collaborators: 'Collaborators'
    collectionsLink: '%(user)s\'s\u00a0Collections'
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

  getProjectContextForLinkPrefix: ->
    if @props.project?
      return "/projects/#{@props.params.owner}/#{@props.params.name}"
    else
      return ""

  render: ->
    <PromiseRenderer promise={@props.collection.get('owner')}>{(owner) =>
      [ownerName, name] = @props.collection.slug.split('/')
      params = {owner: ownerName, name: name}

      isOwner = @props.user?.id is owner.id
      nonBreakableOwnerName =  owner.display_name.replace /\ /g, "\u00a0"
      <div className="collections-page">
        <nav className="collection-nav tabbed-content-tabs">
          <IndexLink to="#{@getProjectContextForLinkPrefix()}/collections/#{ownerName}/#{name}" activeClassName="active" className="tabbed-content-tab">
            <Avatar user={owner} />
            {@props.collection.display_name}
          </IndexLink>

          {if isOwner
            <Link to="#{@getProjectContextForLinkPrefix()}/collections/#{ownerName}/#{name}/settings" activeClassName="active" className="tabbed-content-tab">
              <Translate content="collectionPage.settings" />
            </Link>}

          {if isOwner
            <Link to="#{@getProjectContextForLinkPrefix()}/collections/#{ownerName}/#{name}/collaborators" activeClassName="active" className="tabbed-content-tab">
              <Translate content="collectionPage.collaborators" />
            </Link>}

          <Link to="#{@getProjectContextForLinkPrefix()}/collections/#{ownerName}" activeClassName="active" className="tabbed-content-tab">
            <Translate content="collectionPage.collectionsLink" user="#{nonBreakableOwnerName}" />
          </Link>
          <Link to="#{@getProjectContextForLinkPrefix()}/users/#{ownerName}" activeClassName="active" className="tabbed-content-tab">
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

  getClassPerProjectContext: ->
    if @props.project?
      return " collection-page-with-project-context"
    else
      return ""

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
    <div className="content-container#{@getClassPerProjectContext()}">
      {if @state.collection
        <CollectionPage {...@props} collection={@state.collection} roles={@state.roles} />}

      {if @state.error
        <Translate component="p" content="collectionsPageWrapper.error" />}

      {if @state.loading
        <Loading />}
    </div>
