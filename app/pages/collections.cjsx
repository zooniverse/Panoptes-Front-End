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

  # titles/links in the format <link|title>.<baseType>.<desiredFilterType>.<currentPerspective>[.<currentContext>]
  title:
    collections:
      all:
        self: 'All Collections'
        other: 'All Collections'
        anonymous:
          all: 'All Collections'
      project:
        other: '%(projectDisplayName)s Collections'
        self: '%(projectDisplayName)s Collections'
        anonymous:
          project: '%(projectDisplayName)s Collections'
      userAndProject:
        other: '%(collectionOwnerName)s\'s Collections'
        self: '%(collectionOwnerName)s\'s Collections'
        anonymous:
          userAndProject: '%(collectionOwnerName)s\'s Collections'
      user:
        self: 'All %(collectionOwnerName)s\'s Collections'
        other: 'All %(collectionOwnerName)s\'s Collections'
        anonymous:
          user: 'All %(collectionOwnerName)s\'s Collections'
    favorites:
      all:
        self: 'All Favorites'
        other: 'All Favorites'
        anonymous:
          all: 'All Favorites'
      project:
        other: '%(projectDisplayName)s Favorites'
        self: '%(projectDisplayName)s Favorites'
        anonymous:
          project: '%(projectDisplayName)s Favorites'
      userAndProject:
        self: '%(collectionOwnerName)s\'s Favorites'
        other: '%(collectionOwnerName)s\'s Favorites'
        anonymous:
          userAndProject: '%(collectionOwnerName)s\'s Favorites'
      user:
        self: 'All %(collectionOwnerName)s\'s Favorites'
        other: 'All %(collectionOwnerName)s\'s Favorites'
        anonymous:
          user: 'All %(collectionOwnerName)s\'s Favorites'
  link:
    collections:
      all:
        other: 'All\u00a0Collections'
        self: 'All'
        anonymous:
          all: 'Collections'
          user: 'All'
      project:
        other: 'All'
        self: 'All'
        anonymous:
          project: 'Collections'
          userAndProject: 'All'
      userAndProject:
        other: '%(collectionOwnerName)s\'s\u00a0Collections'
        self: 'My\u00a0Collections'
        anonymous:
          userAndProject: '%(collectionOwnerName)s\'s\u00a0Collections'
      user:
        self: 'My\u00a0Collections'
        other: '%(collectionOwnerName)s\'s\u00a0Collections'
        anonymous:
          user: '%(collectionOwnerName)s\'s\u00a0Collections'
    favorites:
      all:
        other: 'All\u00a0Favorites'
        self: 'All'
        anonymous:
          all: 'Favorites'
          user: 'All'
      project:
        other: 'All'
        self: 'All'
        anonymous:
          project: 'Favorites'
          userAndProject: 'All'
      userAndProject:
        other: '%(collectionOwnerName)s\'s\u00a0Favorites'
        self: 'My Favorites'
        anonymous:
          userAndProject: '%(collectionOwnerName)s\'s\u00a0Favorites'
      user:
        self: 'My\u00a0Favorites'
        other: '%(collectionOwnerName)s\'s\u00a0Favorites'
        anonymous:
          user: '%(collectionOwnerName)s\'s\u00a0Favorites'
    removeProjectContext: 'To\u00a0the\u00a0Zooniverse!'


CollectionsNav = React.createClass
  displayName: 'CollectionsNav'
  keys: {}

  # generate a translated message from a contextual-links message object
  generateTranslateLink: (message) ->
    <Translate content="#{message.messageKey}" projectDisplayName={message.project?.displayName} collectionOwnerName={message.user?.displayName} />

  # render a link from a contextual-links link object
  renderLink: (link) ->
    if link.type=="IndexLink"
      <IndexLink key="#{link.key}" to="#{link.to}" title="#{link.message.hoverText}" activeClassName="active">
        {@generateTranslateLink(link.message)}
      </IndexLink>
    else
      <Link key="#{link.key}" to="#{link.to}" title="#{link.message.hoverText}" activeClassName="active">
        {@generateTranslateLink(link.message)}
      </Link>

  renderNavBar: ->
    <nav className="hero-nav">
      {@renderNavLinks(@props.titleAndNavLinks.links)}
    </nav>

  renderNavLinks: (links) ->
    for i, link of links
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

  listCollections: ->
    filters = ContextualLinks.getFiltersFromPath(@props)
    query = {}
    for field, value of filters
      query[field] = value

    query.favorite = @props.favorite
    Object.assign query, @props.location.query

    apiClient.type('collections').get query

  render: ->
    titleAndNavLinks = ContextualLinks.getContextualTitleAndNavLinks(@props)
    contextUserLogin = ContextualLinks.getContextUserLogin(@props)
    <OwnedCardList
      {...@props}
      translationObjectName = "collectionsPage"
      contextUserLogin = {contextUserLogin}
      titleAndNavLinks = {titleAndNavLinks}
      listPromise = {@listCollections()}
      linkTo = "collections"
      titleMessageObject = {titleAndNavLinks.title}
      heroNav={<CollectionsNav {...@props} contextUserLogin={contextUserLogin} titleAndNavLinks={titleAndNavLinks} />}
      heroClass = "collections-hero"
      ownerName = {contextUserLogin}
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
