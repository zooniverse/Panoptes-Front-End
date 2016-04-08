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

  listCollections: ->
    query = {}
    if @props.params?.owner?
      query.owner = @props.params.owner
      query.include = 'owner'

    query.favorite = @props.favorite
    Object.assign query, @props.location.query

    apiClient.type('collections').get query

  render: ->
    <OwnedCardList
      {...@props}
      translationObjectName="collectionsPage"
      listPromise={@listCollections()}
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
