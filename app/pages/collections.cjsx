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
    countMessage: 'Showing %(count)s found'
    button: 'View Collection'
    loadMessage: 'Loading Collections'
    notFoundMessage: 'No Collections Found'
    myCollections: 'My Collections'
    favorites: 'My Favorites'
    all: 'All'

CollectionsNav = React.createClass
  displayName: 'CollectionsNav'

  render: ->
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

List = React.createClass

  displayName: 'List'

  contextTypes:
    location: React.PropTypes.object
    history: React.PropTypes.object

  emptyPromise:
    then: ->
    catch: ->

  getInitialState: ->
    viewingCollection: @emptyPromise
    query: @props.location.query

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

  onGridChange: (query) ->
    urlQuery = Object.assign {}, @props.location.query, @state.query, query

    delete urlQuery.sort if urlQuery.sort == '' || urlQuery.sort == 'default'
    delete urlQuery.page if urlQuery.page == '1'

    @setState query: urlQuery, ->
      @context.history.pushState null, @props.location.pathname, urlQuery
      @fetchCollection()

  fetchCollection: ->
    apiQuery = Object.assign {}, @state.query

    if @props.params?.owner?
      apiQuery.owner = @props.params.owner
      apiQuery.include = 'owner'
      apiQuery.favorite = @props.favorite

    @setState viewingCollection: apiClient.type('collections').get apiQuery

  componentDidMount: ->
    @fetchCollection()

  render: ->
    <OwnedCardList
      {...@props}
      translationObjectName="collectionsPage"
      listPromise={@state.viewingCollection}
      onGridChange={@onGridChange}
      linkTo="collections"
      heroNav={<CollectionsNav user={@props.user} />}
      heroClass="collections-hero"
      ownerName={@props.params?.owner}
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
