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
    console.log @props.nonBreakableCollectionOwnerName
    if @props.user? and @props.user.login == @props.collectionOwnerName
      @lookingAtOwnCollections = true

    <nav className="hero-nav">
      {if @lookingAtOwnCollections
        <Link to="/projects/#{@props.project.slug}/collections/#{@props.user.login}" activeClassName="active">
          <Translate content="collectionsPage.myProjectCollections" user={@props.user.login} project={@props.nonBreakableProjectName} />
        </Link>}
      {if @lookingAtOwnCollections
        <Link to="/projects/#{@props.project.slug}/collections/#{@props.collectionOwnerName}/all" activeClassName="active">
          <Translate content="collectionsPage.allMyCollections" user={@props.nonBreakableCollectionOwnerName} />
        </Link>}
      {if !@lookingAtOwnCollections
        <Link to="/projects/#{@props.project.slug}/collections/#{@props.collectionOwnerName}" activeClassName="active">
          <Translate content="collectionsPage.theirProjectCollections" user={@props.nonBreakableCollectionOwnerName} project={@props.nonBreakableProjectName} />
        </Link>}
      {if !@lookingAtOwnCollections
        <Link to="/projects/#{@props.project.slug}/collections/#{@props.collectionOwnerName}/all" activeClassName="active">
          <Translate content="collectionsPage.allTheirCollections" user={@props.nonBreakableCollectionOwnerName} project={@props.nonBreakableProjectName} />
        </Link>}
      <IndexLink to="/projects/#{@props.project.slug}/collections" activeClassName="active">
        <Translate content="collectionsPage.allProjectCollections" project={@props.nonBreakableProjectName} />
      </IndexLink>
      <Link to="/projects/#{@props.project.slug}/collections/all" activeClassName="active">
        <Translate content="collectionsPage.allCollections" />
      </Link>
      {if @props.user? and !@lookingAtOwnCollections
        <Link to="/projects/#{@props.project.slug}/collections/#{@props.user.login}" activeClassName="active">
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
    "/collections/#{owner}/#{name}"

  listCollections: (collectionOwner) ->
    query = {}
    if collectionOwner?
      query.owner = collectionOwner
      query.include = 'owner'
    else if @props.params?.owner?
      query.owner = @props.params.owner
      query.include = 'owner'

    query.favorite = @props.favorite
    Object.assign query, @props.location.query

    apiClient.type('collections').get query

  getCollectionOwnerName: ->
    if @props.params?.collection_owner?
      return @props.params.collection_owner
    else
      return @props.params.owner

  render: ->
    if @props.project?
      @nonBreakableProjectName = @props.project.display_name.replace /\ /g, "\u00a0"
      @nonBreakableCollectionOwnerName = @getCollectionOwnerName().replace /\ /g, "\u00a0"
      # TODO replace with owner display name
    <OwnedCardList
      {...@props}
      translationObjectName="collectionsPage"
      listPromise={@listCollections(@getCollectionOwnerName())}
      linkTo="collections"
      heroNav={<CollectionsNav user={@props.user} nonBreakableCollectionOwnerName={@nonBreakableCollectionOwnerName} nonBreakableProjectName={@nonBreakableProjectName} project={@props.project} owner={@props.owner} collectionOwnerName={@getCollectionOwnerName()} />}
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
