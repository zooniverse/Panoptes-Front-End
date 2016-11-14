React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
{IndexLink, Link} = require 'react-router'
Translate = require 'react-translate-component'
counterpart = require 'counterpart'
Avatar = require '../partials/avatar'
Loading = require '../components/loading-indicator'
TitleMixin = require '../lib/title-mixin'
classNames = require 'classnames'

counterpart.registerTranslations 'en',
  collectionPage:
    settings: 'Settings'
    collaborators: 'Collaborators'
    collectionsLink: '%(user)s\'s Collections'
    favoritesLink: '%(user)s\'s Favorites'
    userLink: '%(user)s\'s Profile'
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

  getInitialState: ->
    owner: null

  componentWillMount: ->
    apiClient.type 'users'
      .get @props.collection.links.owner.id
      .then (owner) =>
        @setState {owner}
    
  componentDidMount: ->
    document.documentElement.classList.add 'on-collection-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-collection-page'

  render: ->
    return null unless @state.owner?
    
    baseType = if @props.collection.favorite then "favorites" else "collections"
    baseLink = ""
    if @props.project?
      baseLink = "/projects/#{@props.project.slug}"
    baseCollectionLink = "#{baseLink}/#{baseType}/#{@props.collection.slug}"
    baseCollectionsLink = "#{baseLink}/#{baseType}/#{@state.owner?.login}"
    isOwner = @props.user?.id is @state.owner?.id
    profileLink = "#{baseLink}/users/#{@state.owner?.login}"
    collectionsLinkMessageKey = "collectionPage.#{baseType}Link"

    <div className="collections-page">
      <nav className="collection-nav tabbed-content-tabs">
        <IndexLink to={baseCollectionLink} activeClassName="active" className="tabbed-content-tab" onClick={@logClick?.bind(this, 'view-collection')}>
          <Avatar user={@state.owner} />
          {@props.collection.display_name}
        </IndexLink>
        {if isOwner
          <span>
            <Link to="#{baseCollectionLink}/settings" activeClassName="active" className="tabbed-content-tab" onClick={@logClick?.bind(this, 'settings-collection')}>
              <Translate content="collectionPage.settings" />
            </Link>
            <Link to="#{baseCollectionLink}/collaborators" activeClassName="active" className="tabbed-content-tab" onClick={@logClick?.bind(this, 'collab-collection')}>
              <Translate content="collectionPage.collaborators" />
            </Link>
          </span>}
        <Link to={baseCollectionsLink} className="tabbed-content-tab">
          <Translate content="#{collectionsLinkMessageKey}" user={@props.collection.links.owner.display_name} />
        </Link>
        <Link to={profileLink} activeClassName="active" className="tabbed-content-tab">
          <Translate content="collectionPage.userLink" user={@props.collection.links.owner.display_name} />
        </Link>
      </nav>
      <div className="collection-container talk">
        {React.cloneElement @props.children, {user: @props.user, collection: @props.collection, roles: @props.roles}}
      </div>
    </div>

module.exports = React.createClass
  displayName: 'CollectionPageWrapper'

  mixins: [TitleMixin]

  title: ->
    @state.collection?.display_name ? '(Loading)'

  getDefaultProps: ->
    params: null

  getInitialState: ->
    collection: null
    roles: null
    error: false
    loading: false

  componentWillMount: ->
    @fetchCollection()

  fetchCollection: ->
    @setState
      loading: true

    apiClient.type('collections')
      .get(slug: @props.params.collection_owner + '/' + @props.params.collection_name, include: 'owner')
      .then ([collection]) =>

        apiClient.type('collection_roles')
          .get(collection_id: collection.id)
          .then (roles) =>
            @setState
              error: false
              loading: false
              collection: collection
              roles: roles
      .catch (e) =>
        @setState
          error: true
          loading: false

  render: ->
    classes = classNames {
      "content-container"
      "collection-page-with-project-context": @props.project?
    }
    {project, user} = @props
    <div className={classes}>
      {if @state.collection
        <CollectionPage project={project} user={user} collection={@state.collection} roles={@state.roles}>
          {@props.children}
        </CollectionPage>
      }

      {if @state.error
        <Translate component="p" content="collectionsPageWrapper.error" />}

      {if @state.loading
        <Loading />}
    </div>
