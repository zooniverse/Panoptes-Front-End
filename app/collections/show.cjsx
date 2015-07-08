React = require 'react'
talkClient = require '../api/talk'
auth = require '../api/auth'
apiClient = require '../api/client'
Paginator = require '../talk/lib/paginator'
SubjectViewer = require '../components/subject-viewer'
PromiseRenderer = require '../components/promise-renderer'
{Link, RouteHandler} = require 'react-router'
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
    talk: 'Talk'
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

  render: ->
    <PromiseRenderer promise={@props.collection.get('owner')}>{(owner) =>
      params =
        owner: owner.login or owner.name
        name: @props.collection.slug

      isOwner = @props.user?.id is owner.id

      <div className="collections-page">
        <nav className="collection-nav tabbed-content-tabs">
          <Link to="collection-show-list" params={params} className="tabbed-content-tab">
            <Avatar user={owner} />
            {@props.collection.display_name}
          </Link>

          {if isOwner
            <Link to="collection-settings" params={params} className="tabbed-content-tab">
              <Translate content="collectionPage.settings" />
            </Link>}

          {if isOwner
            <Link to="collection-collaborators" params={params} className="tabbed-content-tab">
              <Translate content="collectionPage.collaborators" />
            </Link>}

          <Link to="collection-talk" params={params} className="tabbed-content-tab" style={pointerEvents: 'none', opacity: 0.7}>
            <Translate content="collectionPage.talk" />
          </Link>
        </nav>
        <div className="collection-container">
          <RouteHandler user={@props.user} collection={@props.collection} roles={@props.roles} />
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

  fetchCollection: ->
    @setState loading: true

    apiClient.type('collections')
      .get(owner: @props.params?.owner, slug: @props.params?.name, include: 'owner')
      .then ([collection]) =>
        unless collection then @setState error: true

        apiClient.type('collection_roles')
          .get(collection_id: collection.id)
          .then (roles) =>
            @setState
              collection: collection
              roles: roles
      .catch =>
        @setState error: true
      .then =>
        @setState loading: false

  render: ->
    <div className="cotent-container">
      {if @state.collection
        <CollectionPage {...@props} collection={@state.collection} roles={@state.roles} />}

      {if @state.error
        <Translate compontent="p" content="collectionsPageWrapper.error" />}

      {if @state.loading
        <Loading />}
    </div>
