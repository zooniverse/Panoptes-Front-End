# Since this page appears differently in different situations, here is an explanation of the varying concepts that can affect how this page appears.
#
#  - Base Type   : This page can deal with a base type of collections or of favorites (which are actually collections under the covers, but have special routes)
#
#  - Context     : This page can be viewed in a "zoo-wide" context (@props.project? will be false) or in the context of a specific project.
#                  In a project context, it will appear within the project (project menu still visible) and project filters will be available.
#                  Additionally, we can be in the context of a particular user, or all users. This gives four possible contexts: user, project, user + project or everything (zoo-wide, a.k.a. "all").
#                  When we change context, we don't change what data is shown, just how it is referred to or presented.
#
#  - Filter      : This page can show all the collections or favorites that exist, or it can filter by project, by user, or by user + project.
#                  Here we are talking about actually changing what data is shown when we change the filter.
#
#  - Perspective : This page can be used in three different perspectives - viewing your *own* collections, viewing those of other users while logged in,
#                  or viewing those of any users while logged out
#                  When we change perspective, we don't change what content is shown, just how it is referred to or presented.
#                  (Caveat: Privacy settings may cause different content to be visible depending on who we are - but this is handled
#                   entirely by the API and is ignored in the front end except for marking when a collection is Private)
#

counterpart = require 'counterpart'
React = require 'react'
TitleMixin = require '../lib/title-mixin'
apiClient = require 'panoptes-client/lib/api-client'
OwnedCardList = require '../components/owned-card-list'
Translate = require 'react-translate-component'
{Link, IndexLink} = require 'react-router'

counterpart.registerTranslations 'en',
  collectionsPage:
    title:
      collections:
        generic: 'All\u00a0Collections'
        project:
          ownedBySelf: 'My\u00a0%(project)s\u00a0Collections'
          ownedByOther: '%(owner)s\'s\u00a0%(project)s\u00a0Collections'
          allOwners: '%(project)s\u00a0Collections'
        allProjects:
          ownedBySelf: 'My\u00a0Collections'
          ownedByOther: '%(owner)s\'s\u00a0Collections'
          allOwners: 'All\u00a0Collections'
      favorites:
        generic: 'All\u00a0Favorites'
        project:
          ownedBySelf: 'My\u00a0%(project)s\u00a0Favorites'
          ownedByOther: '%(owner)s\'s\u00a0%(project)s\u00a0Favorites'
          allOwners: '%(project)s\u00a0Favorites'
        allProjects:
          ownedBySelf: 'My\u00a0Favorites'
          ownedByOther: '%(owner)s\'s\u00a0Favorites'
          allOwners: 'All\u00a0Favorites'
    countMessage: 'Showing %(count)s collections'
    button: 'View Collection'
    loadMessage: 'Loading Collections'
    notFoundMessage: 'No Collections Found'
    viewOnZooniverseOrg: 'View\u00a0on\u00a0zooniverse.org'
    collections:
      self:
        all: 'All\u00a0Collections'
        user: 'All\u00a0My\u00a0Collections'
        project: 'All\u00a0%(projectName)s\u00a0Collections'
        userAndProject: 'My\u00a0%(projectName)s\u00a0Collections'
      other:
        all: 'All\u00a0Collections'
        user: 'All\u00a0%(collectionOwnerLogin)s\'s\u00a0Collections'
        project: 'All\u00a0%(projectName)s\u00a0Collections'
        userAndProject: '%(collectionOwnerLogin)s\'s\u00a0%(projectName)s\u00a0Collections'
    favorites:
      self:
        all: 'All\u00a0Favorites'
        user: 'My\u00a0Favorites'
        project: 'All\u00a0%(projectName)s\u00a0Favorites'
        userAndProject: 'My\u00a0%(projectName)s\u00a0Favorites'
      other:
        all: 'All\u00a0Favorites'
        user: 'All\u00a0%(collectionOwnerLogin)s\'s\u00a0Favorites'
        project: 'All\u00a0%(project)s\u00a0Favorites'
        userAndProject: '%(collectionOwnerLogin)s\'s\u00a0%(projectName)s\u00a0Favorites'
    profile:
      self:
        user: 'My\u00a0Profile'
        userAndProject: 'My\u00a0Profile'
      other:
        user: '%(user)s\'s\u00a0Profile'
        userAndProject: '%(collectionOwnerLogin)s\'s\u00a0Profile'

CollectionsNav = React.createClass
  displayName: 'CollectionsNav'
  keys: {}

  determineSituation: ->
    if @props.project?
      if @props.collectionOwnerName?
        @context = "user-and-project"
      else
        @context = "project"
    else
      if @props.collectionOwnerName?
        @context = "user"
      else
        @context = "all"
    if @props.viewingOwnCollections
      @perspective = "self"
    else
      @perspective = "other"
    if @props.favorite
      @baseType = "favorites"
    else
      @baseType = "collections"
    if @props.filter?
      if "project_ids" of @props.filter
        if "owner" of @props.filter
          @filterType = "user-and-project"
        else
          @filterType = "project"
      else
        if "owner" of @props.filter
          @filterType = "user"
        else
          @filterType = "all"
    else
      @filterType = "all"
    console.log "context:",@context,"perspective:",@perspective,"baseType:",@baseType,"filterType:",@filterType,"filter:",@props.filter

  prefixLinkIfNeeded: (link) ->
    if @context=="project"
      # keeps project in context
      link = "/projects/#{@props.project.slug}" + link
    return link

  suffixLinkIfNeeded: (link) ->
    if @context == "project" and !@filterType.includes("project")
      # need to remove project from filter, while keeping it in context
      link = link + "/all"
    return link

  uniqueId: (length=8) ->
    id = ""
    id += Math.random().toString(36).substr(2) while id.length < length
    id.substr 0, length

  createLink: (to,linkType="Link") ->
    return {
      to: @suffixLinkIfNeeded(@prefixLinkIfNeeded(to))
      linkType: linkType
    }

  getRemoveProjectContextLink: ->
    pathParts = @props.location.pathname.split('/')
    [first, ..., last] = pathParts
    if first == "projects"
      if last == "all"
        return pathParts[3...-1].join("/")
      else
        return pathParts[3...].join("/")

  # When viewing collections, we only show one favorites link - and vice versa - to limit menu options.
  # This method will retrieve the best single link that is currently viable, for the specified baseType
  getBestLink: (baseType, candidateLinks) ->
    if baseType == "favorites"
      if @context.includes("projects")
        bestLink = candidateLinks["projects"]
      else
        bestLink = candidateLinks["all"]
    else if baseType == "collections"
      if @context == "user-and-project"
        bestLink = candidateLinks["user-and-project"]
      else if @context == "user"
        bestLink = candidateLinks["user"]
      else if @context == "project"
        bestLink = candidateLinks["project"]
      else
        bestLink = candidateLinks["all"]
    else if baseType == "recents"
      if @context == "user-and-project"
        bestLink = candidateLinks["user-and-project"]
      else if @context == "user"
        bestLink = candidateLinks["user"]
      else if @context == "project"
        bestLink = candidateLinks["project"]
      else
        bestLink = candidateLinks["all"]
    else if baseType == "profile"
      if @context == "user-and-project"
        bestLink = candidateLinks["user-and-project"]
      else
        bestLink = candidateLinks["user"]
    return bestLink

  getCamelCase: (filterType) ->
    if filterType == "user-and-project"
      return "userAndProject"
    else
      return filterType

  # figure out the nav bar, according to current baseType, context, filters and perspective
  getLinksToShow: ->
    # links, indexed by baseType then filterType
    navLinks = {
      "collections":
        "all": @createLink("/collections", "IndexLink")
        "user": @createLink("/collections/#{@props.collectionOwnerLogin}")
        "project": @createLink("/collections")
        "user-and-project": @createLink("/collections/#{@props.collectionOwnerLogin}")
      "favorites":
        "all": @createLink("/favorites", "IndexLink")
        "user": @createLink("/favorites/#{@props.collectionOwnerLogin}")
        "project": @createLink("/favorites")
        "user-and-project": @createLink("/favorites/#{@props.collectionOwnerLogin}")
      "profile":
        "user": @createLink("/users/#{@props.collectionOwnerLogin}")
        "user-and-project": @createLink("/users/#{@props.collectionOwnerLogin}")
      "recents":
        "all": @createLink("/talk/recents")
        "user": @createLink("/users/#{@props.collectionOwnerLogin}")
        "project": @createLink("/talk/recents")
        "user-and-project": @createLink("/users/#{@props.collectionOwnerLogin}")
    }

    # now we set the message keys, according to context and perspective
    for baseType,links of navLinks
      for filterType, to of links
        links[filterType]["messageKey"] = "collectionsPage.#{baseType}.#{@perspective}.#{@getCamelCase(filterType)}"

    # now we have to decide which links to show, according to base type, filter, context and perspective
    linksToShow = []

    # first handle collection links
    if @baseType == "collections"
      candidateLinks = navLinks[@baseType]
      linksToShow.push candidateLinks["all"]
      if @context.includes("user")
        linksToShow.push candidateLinks["user"]
      if @context.includes("project")
        linksToShow.push candidateLinks["user"]
      if @context == "user-and-project"
        linksToShow.push candidateLinks["user-and-project"]
    else
      linksToShow.push @getBestLink "collections", navLinks["collections"]

    # now favorites links
    if @baseType == "favorites"
      candidateLinks = navLinks[@baseType]
      if @context.includes("project")
        linksToShow.push candidateLinks["all"]
      if @context.includes("user")
        linksToShow.push candidateLinks["user"]
      if @context.includes("project")
        linksToShow.push candidateLinks["user"]
      if @context == "user-and-project"
        linksToShow.push candidateLinks["user-and-project"]
    else
      linksToShow.push @getBestLink "favorites", navLinks["favorites"]

    # now user profile
    if @context.includes("user")
      linksToShow.push @getBestLink "profile", navLinks["profile"]

    # now recents
    # if (viewing profile or project recents)
    #  linksToShow.push getBestLink "profile", navLinks["profile"]

    # now context removal link
    contextRemovalLink = @createLink(@getRemoveProjectContextLink())
    contextRemovalLink["messageKey"] = "collectionsPage.viewOnZooniverseOrg"
    linksToShow.push contextRemovalLink

    return linksToShow

  makeTextUnbreakable: (text) ->
    text.replace /\ /g, "\u00a0"

  generateUniqueKeyForLinkInstance: (link) ->
    key = link.to + "-" + @uniqueId()

  generateTranslateLink: (messageKey) ->
    if @props.project?
      if @props.collectionOwnerName?
        <Translate content="#{messageKey}" projectName={@makeTextUnbreakable(@props.project.display_name)} collectionOwnerLogin={@makeTextUnbreakable(@props.collectionOwnerName)} />
      else
        <Translate content="#{messageKey}" projectName={@makeTextUnbreakable(@props.project.display_name)} />
    else
      if @props.collectionOwnerName?
        <Translate content="#{messageKey}" collectionOwnerLogin={@makeTextUnbreakable(@props.collectionOwnerName)} />
      else
        <Translate content="#{messageKey}" />

  renderLink: (link) ->
    key = @generateUniqueKeyForLinkInstance(link)
    if link.linkType == "IndexLink"
      <IndexLink key="#{key}" to="#{link.to}" activeClassName="active">
        {@generateTranslateLink(link.messageKey)}
      </IndexLink>
    else
      <Link key="#{key}" to="#{link.to}" activeClassName="active">
        {@generateTranslateLink(link.messageKey)}
      </Link>

  renderNavBar: ->
    <nav className="hero-nav">
      {@renderNavLinks()}
    </nav>

  renderNavLinks: ->
    @determineSituation()
    navLinks = @getLinksToShow()
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
    if @props.favorite
      if @props.params?.favorites_owner?
        return @props.params.favorites_owner
      else
        return @props.params.owner
    else
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
    # /projects/project_owner/project_name/favorites/collection_owner       -> All collection_owner's favorites, viewed in context of project_name and collection_owner
    # /projects/project_owner/project_name/favorites/                       -> All favorites collections for project_name, viewed in context of project_name
    # /favorites/collection_owner                                           -> All collections owner's favorites, no context
    # /favorites/                                                           -> All favorites collections for all users

    filters = {}
    pathParts = @props.location.pathname.split('/')
    [firstPart, ..., lastPart] = pathParts
    if firstPart == "projects" and pathParts.length < 6 and lastPart != "all"
      filters["project_ids"] = @props.project.id
    if firstPart == "collections" and pathParts.length == 2 and pathParts[1] != ""
      filters["owner"] = pathParts[1]
    if firstPart == "favorites" and pathParts.length == 2 and pathParts[1] != ""
      filters["owner"] = pathParts[1]
    if pathParts.length>4 and pathParts[3] == "collections" and pathParts[4] != "" and pathParts[4] != "all"
      filters["owner"] = pathParts[4]
    if pathParts.length>4 and pathParts[3] == "favorites" and pathParts[4] != ""
      filters["owner"] = pathParts[4]
    return filters

  checkIfViewingOwnCollections: ->
    return @props.user? and @props.user.login == @getCollectionOwnerName()

  getHeroNavWithAppropriateParams: ->
    if @props.params?.collection_owner? or @props.params?.favorites_owner?
      <CollectionsNav user={@props.user} location={@props.location} filter={@getFiltersFromPath()} project={@props.project} owner={@props.owner} viewingOwnCollections={@checkIfViewingOwnCollections()} collectionOwnerName={@getCollectionOwnerName()} collectionOwnerLogin={@getCollectionOwnerName()} />
    else
      <CollectionsNav user={@props.user} location={@props.location} filter={@getFiltersFromPath()} project={@props.project} owner={@props.owner} viewingOwnCollections={@checkIfViewingOwnCollections()} />

  render: ->
    console.log "favorite", @props.favorite
    if @props.params?.collection_owner? or @props.params?.favorites_owner?
      collectionOwnerName = @getCollectionOwnerName()
    else
      collectionOwnerName = "all"

    <OwnedCardList
      {...@props}
      translationObjectName="collectionsPage"
      listPromise={@listCollections(collectionOwnerName)}
      linkTo="collections"
      filter={@getFiltersFromPath()}
      heroNav={@getHeroNavWithAppropriateParams()}
      heroClass="collections-hero"
      ownerName={collectionOwnerName}
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
