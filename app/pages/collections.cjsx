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

CollectionsNav = React.createClass
  displayName: 'CollectionsNav'

  render: ->
    <nav className="hero-nav">
      {if @props.user
        <Link to="collections-user" params={{owner: @props.user.login}}>
          <Translate content="collectionsPage.myCollections" />
        </Link>}
    </nav>

CollectionsPage = React.createClass
  displayName: 'CollectionsPage'
  mixins: [TitleMixin]
  title: 'Collections'

  imagePromise: (collection) ->
    apiClient.type('subjects').get(collection_id: collection.id, page_size: 1)
    .index(0)
    .then (subject) ->
      # Fixes an error thrown for a subject without a location
      unless subject then return 'https://placeholdit.imgix.net/~text?txtsize=33&txt=350%C3%97150&w=350&h=150'
      firstKey = Object.keys(subject.locations[0])[0]
      subject.locations[0][firstKey]

  cardLink: (collection) ->
    'collection-show'

  listCollections: ->
    query = Object.create @props.query ? {}
    query.owner = @props.params.owner if @props.params?.owner?
    query.include = 'owner'

    apiClient.type('collections').get query

  render: ->
    listProps =
      translationObjectName: 'collectionsPage'
      listPromise: @listCollections()
      linkTo: 'collections'
      heroNav: <CollectionsNav user={@props.user} />
      ownerName: @props.params?.owner
      imagePromise: @imagePromise
      cardLink: @cardLink

    <OwnedCardList {...listProps} />

module.exports = CollectionsPage
