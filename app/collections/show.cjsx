React = require 'react'
PromiseToSetState = require '../lib/promise-to-set-state'
talkClient = require '../api/talk'
apiClient = require '../api/client'
Paginator = require '../talk/lib/paginator'
SubjectViewer = require '../components/subject-viewer'
PromiseRenderer = require '../components/promise-renderer'
{Link, RouteHandler} = require 'react-router'
Translate = require 'react-translate-component'
counterpart = require 'counterpart'
Avatar = require '../partials/avatar'
auth = require '../api/auth'
LoadingIndicator = require '../components/loading-indicator'
HandlePropChanges = require '../lib/handle-prop-changes'
TitleMixin = require '../lib/title-mixin'

counterpart.registerTranslations 'en',
  collectionPage:
    settings: 'Settings'
    collaborators: 'Collaborators'
    talk: 'Talk'
    loading: 'Loading'

CollectionPage = React.createClass
  displayName: 'CollectionPage'

  getDefaultProps: ->
    collection: null

  componentDidMount: ->
    document.documentElement.classList.add 'on-collection-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-collection-page'

  render: ->
    userAndOwner = Promise.all [
      auth.checkCurrent(),
      @props.collection.get 'owner'
    ]

    <PromiseRenderer promise={userAndOwner}>{([user, owner] = []) =>
      params =
        owner: owner.login or owner.name
        name: @props.collection.slug

      isOwner = user.id is owner.id

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
          <RouteHandler collection={@props.collection} />
        </div>
      </div>
    }</PromiseRenderer>

module.exports = React.createClass
  displayName: 'CollectionPageWrapper'

  mixins: [TitleMixin, HandlePropChanges, PromiseToSetState]

  title: ->
    @state.collection?.display_name ? '(Loading)'

  getDefaultProps: ->
    params: null

  getInitialState: ->
    collection: null

  propChangeHandlers:
    'params.owner': 'fetchCollection'
    'params.name': 'fetchCollection'

  fetchCollection: ->
    @promiseToSetState collection: auth.checkCurrent().then =>
      apiClient.type('collections')
        .get(owner: @props.params?.owner, slug: @props.params?.name, include: 'owner')
        .catch ->
          []
        .then ([collection]) =>
          unless collection?
            throw new Error "Couldn't find collection #{@props.params.owner}/#{@props.params.name}"
          collection

  componentDidMount: ->
    auth.listen 'change', @fetchCollection

  componentWillUnmount: ->
    auth.stopListening 'change', @fetchCollection

  render: ->
    if @state.collection?
      <CollectionPage {...@props} collection={@state.collection} />
    else
      <div className="content-container">
        {if @state.rejected.collection?
          <code>{@state.rejected.collection.toString()}</code>
        else
          <LoadingIndicator>
            <Translate content="collectionPage.loading" />
          </LoadingIndicator>}
      </div>
