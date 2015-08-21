counterpart = require 'counterpart'
React = require 'react'
TitleMixin = require '../lib/title-mixin'
apiClient = require '../api/client'
OwnedCardList = require '../components/owned-card-list'
Translate = require 'react-translate-component'
{Link} = require 'react-router'

counterpart.registerTranslations 'en',
  collectionsPage:
    title: '%(user)s Collections'
    countMessage: 'Showing %(count)s found'
    button: 'View Collection'
    loadMessage: 'Loading Collections'
    notFoundMessage: 'No Collections Found'
    myCollections: 'My Collections'
    favorites: 'My Favorites'

CollectionsNav = React.createClass
  displayName: 'CollectionsNav'

  render: ->
    <nav className="hero-nav">
      {if @props.user?
        <Link to="collections-user" params={{owner: @props.user.login}}>
          <Translate content="collectionsPage.myCollections" />
        </Link>}
      {if @props.user?
        <Link to="favorites-user" params={{owner: @props.user.login}}>
          <Translate content="collectionsPage.favorites" />
        </Link>}
    </nav>

List = React.createClass
  displayName: 'List'

  imagePromise: (collection) ->
    apiClient.type('subjects').get(collection_id: collection.id, page_size: 1)
      .index(0)
      .then (subject) ->
        firstKey = Object.keys(subject.locations[0])[0]
        subject.locations[0][firstKey]

  cardLink: (collection) ->
    'collection-show'

  listCollections: ->
    query = {}
    query.owner = @props.params.owner if @props.params?.owner?
    query.include = 'owner'
    query.favorite = @props.favorite
    Object.assign query, @props.query

    apiClient.type('collections').get query

  render: ->
    <OwnedCardList
      translationObjectName="collectionsPage"
      listPromise={@listCollections()}
      linkTo="collections"
      heroNav={<CollectionsNav user={@props.user} />}
      heroClass="collections-hero"
      ownerName={@props.params?.owner}
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
