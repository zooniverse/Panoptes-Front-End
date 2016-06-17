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
      [ownerName, name] = @props.collection.slug.split('/')
      params = {owner: ownerName, name: name}
      baseLink = "/collections/#{ownerName}/#{name}"
      isOwner = @props.user?.id is owner.id

      <div className="collections-page">
        <nav className="collection-nav tabbed-content-tabs">
          <IndexLink to="#{baseLink}" activeClassName="active" className="tabbed-content-tab" onClick={@logClick?.bind(this, 'view-collection')}>
            <Avatar user={owner} />
            {@props.collection.display_name}
          </IndexLink>

          {if isOwner
            <Link to="#{baseLink}/settings" activeClassName="active" className="tabbed-content-tab" onClick={@logClick?.bind(this, 'settings-collection')}>
              <Translate content="collectionPage.settings" />
            </Link>}

          {if isOwner
            <Link to="#{baseLink}/collaborators" activeClassName="active" className="tabbed-content-tab" onClick={@logClick?.bind(this, 'collab-collection')}>
              <Translate content="collectionPage.collaborators" />
            </Link>}
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
    <div className="content-container">
      {if @state.collection
        <CollectionPage {...@props} collection={@state.collection} roles={@state.roles} />}

      {if @state.error
        <Translate compontent="p" content="collectionsPageWrapper.error" />}

      {if @state.loading
        <Loading />}
    </div>
