counterpart = require 'counterpart'
React = require 'react'
TitleMixin = require '../lib/title-mixin'
apiClient = require 'panoptes-client/lib/api-client'
OwnedCardList = require '../components/owned-card-list'
Translate = require 'react-translate-component'
{Link, IndexLink} = require 'react-router'
ContextualLinks = require '../lib/contextual-links'

counterpart.registerTranslations 'en',
  collectionsPage:
    countMessage: 'Showing %(count)s collections'
    button: 'View Collection'
    loadMessage: 'Loading Collections'
    notFoundMessage: 'No Collections Found'

CollectionsNav = React.createClass
  displayName: 'CollectionsNav'
  keys: {}

  # generate a translated message from a contextual-links message object
  generateTranslateLink: (message) ->
    <Translate content="#{message.messageKey}" projectDisplayName={message.project?.displayName} collectionOwnerName={message.user?.displayName} />

  # render a link from a contextual-links link object
  renderLink: (link) ->
    <Link key="#{link.key}" to="#{link.to}" activeClassName="active">
      {@generateTranslateLink(link.message)}
    </Link>

  # TODO add message/stats links in the middle here
  renderNavBar: ->
    <nav className="hero-nav">
      {@renderNavLinks(@props.titleAndNavLinks.contextualLinks)}
      {@renderNavLinks(@props.titleAndNavLinks.zooniverseLinks)}
    </nav>

  renderNavLinks: (links) ->
    for i, link of navLinks
      @renderLink(link)

  render: ->
    @renderNavBar()

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
    ContextualLinks.prefixLinkIfNeeded(@props,"/collections/#{owner}/#{name}")

  listCollections: (collectionOwner,project) ->
    filters = ContextualLinks.getFiltersFromPath(@props)
    query = {}
    for field, value of filters
      query[field] = value

    query.favorite = @props.favorite
    Object.assign query, @props.location.query

    apiClient.type('collections').get query

  render: ->
    @props.translationObjectName = "collectionsPage"
    @props.titleAndNavLinks = ContextualLinks.getContextualTitleAndNavLinks(@props)
    @props.contextUserLogin = ContextualLinks.getContextUserLogin(@props)
    <OwnedCardList
      {...@props}
      listPromise = {@listCollections(@props.contextUserLogin)}
      linkTo = "collections"
      titleMessageObject = {@props.titleAndNavLinks.title}
      heroNav={<CollectionsNav {...@props} />}
      heroClass = "collections-hero"
      ownerName = {@props.contextUserLogin}
      skipOwner = {!@props.params?.owner}
      imagePromise = {@imagePromise}
      cardLink = {@cardLink} />

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
