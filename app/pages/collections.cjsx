counterpart = require 'counterpart'
React = require 'react'
TitleMixin = require '../lib/title-mixin'
apiClient = require 'panoptes-client/lib/api-client'
OwnedCardList = require '../components/owned-card-list'
Translate = require 'react-translate-component'
{Link, IndexLink} = require 'react-router'

counterpart.registerTranslations 'en',
  collectionsPage:
    title: '%(user)s Collections'
    countMessage: 'Showing %(count)s collections'
    button: 'View Collection'
    loadMessage: 'Loading Collections'
    notFoundMessage: 'No Collections Found'
    myCollections: 'My\u00a0Collections'
    favorites: 'My\u00a0Favorites'
    allProjectCollections: 'All\u00a0%(project)s\u00a0Collections'
    myProjectCollections: 'My\u00a0%(project)s\u00a0Collections'
    theirProjectCollections: '%(user)s\'s\u00a0%(project)s\u00a0Collections'
    allMyCollections: 'All\u00a0My\u00a0Collections'
    allTheirCollections: 'All\u00a0%(user)s\'s\u00a0Collections'
    allCollections: 'All\u00a0Collections'

CollectionsNav = React.createClass
  displayName: 'CollectionsNav'

  renderWithProjectContext: ->
    <nav className="hero-nav">
      {if @props.viewingOwnCollections
        <Link to="/projects/#{@props.project.slug}/collections/#{@props.user.login}" activeClassName="active">
          <Translate content="collectionsPage.myProjectCollections" user={@props.user.login} project={@props.nonBreakableProjectName} />
        </Link>}
      {if @props.viewingOwnCollections
        <Link to="/projects/#{@props.project.slug}/collections/#{@props.collectionOwnerName}/all" activeClassName="active">
          <Translate content="collectionsPage.allMyCollections" user={@props.nonBreakableCollectionOwnerName} />
        </Link>}
      {if !@props.viewingOwnCollections
        <Link to="/projects/#{@props.project.slug}/collections/#{@props.collectionOwnerName}" activeClassName="active">
          <Translate content="collectionsPage.theirProjectCollections" user={@props.nonBreakableCollectionOwnerName} project={@props.nonBreakableProjectName} />
        </Link>}
      {if !@props.viewingOwnCollections
        <Link to="/projects/#{@props.project.slug}/collections/#{@props.collectionOwnerName}/all" activeClassName="active">
          <Translate content="collectionsPage.allTheirCollections" user={@props.nonBreakableCollectionOwnerName} project={@props.nonBreakableProjectName} />
        </Link>}
      <IndexLink to="/projects/#{@props.project.slug}/collections" activeClassName="active">
        <Translate content="collectionsPage.allProjectCollections" project={@props.nonBreakableProjectName} />
      </IndexLink>
      <Link to="/projects/#{@props.project.slug}/collections/all" activeClassName="active">
        <Translate content="collectionsPage.allCollections" />
      </Link>
      {if @props.user? and !@props.viewingOwnCollections
        <Link to="/projects/#{@props.project.slug}/collections/#{@props.user.login}/all" activeClassName="active">
          <Translate content="collectionsPage.myCollections" />
        </Link>}
      {if @props.user?
        <Link to="/projects/#{@props.project.slug}/favorites/#{@props.user.login}" activeClassName="active">
          <Translate content="collectionsPage.favorites" />
        </Link>}
    </nav>

  renderWithoutProjectContext: ->
    <nav className="hero-nav">
      <IndexLink to="/collections" activeClassName="active">
        <Translate content="collectionsPage.all" />
      </IndexLink>
      {if @props.user?
        <Link to="/collections/#{@props.user.login}" activeClassName="active">
          <Translate content="collectionsPage.myCollections" />
        </Link>}
      {if @props.user?
        <Link to="/favorites/#{@props.user.login}" activeClassName="active">
          <Translate content="collectionsPage.favorites" />
        </Link>}
    </nav>

  render: ->
    if @props.project? then @renderWithProjectContext() else @renderWithoutProjectContext()


List = React.createClass
  displayName: 'List'

  imagePromise: (collection) ->
    apiClient.type('subjects').get(collection_id: collection.id, page_size: 1)
      .then ([subject]) ->
        if subject?
          firstKey = Object.keys(subject.locations[0])[0]
          subject.locations[0][firstKey]
        else
          '/simple-avatar.jpg'

  cardLink: (collection) ->
    [owner, name] = collection.slug.split('/')
    if @props.project?
      "/projects/#{@props.project.slug}/collections/#{owner}/#{name}"
    else
      "/collections/#{owner}/#{name}"

  listCollections: (collectionOwner,project) ->
    filters = @getFiltersFromPath()
    query = {}
    for field, value of filters
      query[field] = value

    query.favorite = @props.favorite
    Object.assign query, @props.location.query

    apiClient.type('collections').get query

  # return the display name of the collection owner (just login name for now)
  getCollectionOwnerName: ->
    if @props.params?.collection_owner?
      return @props.params.collection_owner
    else
      return @props.params.owner

  getFiltersFromPath: ->
    # /projects/project_owner/project_name/collections/collection_owner/all -> All collection_owner's collections, viewed in context of project_name and collection_owner
    # /projects/project_owner/project_name/collections/collection_owner     -> All collection_owner's collections for project_name, viewed in context of project_name and collection_owner
    # /projects/project_owner/project_name/collections/all                  -> All collections, viewed in context of project_name
    # /projects/project_owner/project_name/collections/                     -> All collections for project_name, viewed in context of project_name
    # /collections/collection_owner                                         -> All collections by collection owner, no context
    # /collections/                                                         -> All collections for all users
    filters = {}
    pathParts = @props.location.pathname.split('/')
    [firstPart, ..., lastPart] = pathParts
    if firstPart == "projects" and pathParts.length < 6 and lastPart != "all"
      filters["project_ids"] = @props.project.id
    if firstPart == "collections" and pathParts.length == 2 and pathParts[1] != ""
      filters["owner"] = pathParts[1]
    if pathParts.length>4 and pathParts[3] == "collections" and pathParts[4] != "" and pathParts[4] != "all"
      filters["owner"] = pathParts[4]
    return filters

  checkIfViewingOwnCollections: ->
    return @props.user? and @props.user.login == @getCollectionOwnerName()

  render: ->
    if @props.project?
      @nonBreakableProjectName = @props.project.display_name.replace /\ /g, "\u00a0"
      @nonBreakableCollectionOwnerName = @getCollectionOwnerName().replace /\ /g, "\u00a0"

    <OwnedCardList
      {...@props}
      translationObjectName="collectionsPage"
      listPromise={@listCollections(@getCollectionOwnerName(),@projectQueryParam)}
      linkTo="collections"
      heroNav={<CollectionsNav user={@props.user} filters={@getFiltersFromPath()} nonBreakableCollectionOwnerName={@nonBreakableCollectionOwnerName} nonBreakableProjectName={@nonBreakableProjectName} project={@props.project} owner={@props.owner} viewingOwnCollections={@checkIfViewingOwnCollections()} collectionOwnerName={@getCollectionOwnerName()} />}
      heroClass="collections-hero"
      ownerName={@getCollectionOwnerName()}
      skipOwner={!@props.params?.owner}
      imagePromise={@imagePromise}
      cardLink={@cardLink} />

FavoritesList = React.createClass
  displayName: 'FavoritesPage'
  mixins: [TitleMixin]
  title: 'Favorites'

  render: ->
    props = Object.assign({}, @props, {favorite: true})
    <List {...props} />

CollectionsList = React.createClass
  displayName: 'CollectionsPage'
  mixins: [TitleMixin]
  title: 'Collections'

  render: ->
    props = Object.assign({}, @props, {favorite: false})
    <List {...props} />

module.exports = {FavoritesList, CollectionsList}
