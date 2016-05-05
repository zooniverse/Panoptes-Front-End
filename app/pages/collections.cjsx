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
    countMessage: 'Showing %(count)s collections'
    button: 'View Collection'
    loadMessage: 'Loading Collections'
    notFoundMessage: 'No Collections Found'
    viewOnZooniverseOrg: 'View\u00a0on\u00a0zooniverse.org'
    collections:
      self:
        all: 'All'
        user: 'My\u00a0Collections'
        project: '%(projectDisplayName)s'
        userAndProject: 'My\u00a0%(projectDisplayName)s\u00a0Collections'
      other:
        all: 'All'
        user: '%(collectionOwnerName)s'
        project: '%(projectDisplayName)s'
        userAndProject: '%(collectionOwnerName)s in \u00a0%(projectDisplayName)s'
      short: 'Collections'
    favorites:
      self:
        all: 'All'
        user: 'My\u00a0Favorites'
        project: '%(projectDisplayName)s'
        userAndProject: 'My\u00a0%(projectDisplayName)s\u00a0Favorites'
      other:
        all: 'All'
        user: '%(collectionOwnerName)s'
        project: '%(projectDisplayName)s'
        userAndProject: '%(collectionOwnerName)s in \u00a0%(projectDisplayName)s'
      short: 'Favorites'
    profile:
      self:
        user: 'My\u00a0Profile'
        userAndProject: 'My\u00a0Profile'
      other:
        user: '%(user)s\'s\u00a0Profile'
        userAndProject: '%(collectionOwnerName)s\'s\u00a0Profile'
    title:
      collections:
        all: 'All\u00a0Collections'
        user: '%(collectionOwnerName)s\'s\u00a0Collections'
        project: '\u00a0%(projectDisplayName)s\u00a0Collections'
        userAndProject: '%(collectionOwnerName)s\'s\u00a0%(projectDisplayName)s\u00a0Collections'
      favorites:
        all: 'All\u00a0Favorites'
        user: '%(collectionOwnerName)s\'s\u00a0Favorites'
        project: '\u00a0%(projectDisplayName)s\u00a0Favorites'
        userAndProject: '%(collectionOwnerName)s\'s\u00a0%(projectDisplayName)s\u00a0Favorites'

CollectionsNav = React.createClass
  displayName: 'CollectionsNav'
  keys: {}

  prefixLinkIfNeeded: (link) ->
    if @context.includes("project")
      # keeps project in context
      link = "/projects/#{@props.project.slug}" + link
    return link

  suffixLinkIfNeeded: (link,linkShouldRemoveProjectFilter=false) ->
    if @context.includes("project") and linkShouldRemoveProjectFilter
      # need to remove project from filter, while keeping it in context
      link = link + "/all"
    return link

  getUniqueId: (length=8) ->
    id = ""
    id += Math.random().toString(36).substr(2) while id.length < length
    id.substr 0, length

  createLink: (newFilterType,to,linkType="Link", linkShouldRemoveProjectFilter=false, dontModifyLink=false) ->
    if !dontModifyLink
      to = @suffixLinkIfNeeded(@prefixLinkIfNeeded(to),linkShouldRemoveProjectFilter)
    return {
      to: to
      linkType: linkType
      newFilterType: newFilterType
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
  # candidateLinksForThisType should be an array of links for the desired baseType, keyed by context
  getBestLink: (baseType, candidateLinksForThisType) ->
    switch baseType
      when "favorites"
        if @context.includes("project")
          bestLink = candidateLinksForThisType["project"]
        else
          bestLink = candidateLinksForThisType["all"]
      when "collections","recents" then bestLink = candidateLinksForThisType[@context]
      when "profile"
        switch @context
          when "user-and-project" then bestLink = candidateLinksForThisType["user-and-project"]
          else bestLink = candidateLinksForThisType["user"]
    return bestLink

  convertFilterTypeForMessageKey: (filterType) ->
    if filterType == "user-and-project"
      return "userAndProject"
    else
      return filterType

  # figure out the nav bar, according to current baseType, context, filters and perspective
  getLinksToShow: ->
    # candidatelinks, indexed by baseType then filterType
    candidateLinks = {
      "collections":
        "all": @createLink("all","/collections", "IndexLink",true)
        "user": @createLink("user","/collections/#{@props.collectionOwnerLogin}","Link",true)
        "project": @createLink("project","/collections")
        "user-and-project": @createLink("user-and-project","/collections/#{@props.collectionOwnerLogin}")
      "favorites":
        "all": @createLink("all","/favorites", "IndexLink",true)
        "user": @createLink("user","/favorites/#{@props.collectionOwnerLogin}","Link",true)
        "project": @createLink("project","/favorites")
        "user-and-project": @createLink("user-and-project","/favorites/#{@props.collectionOwnerLogin}")
      "profile":
        "user": @createLink("user","/users/#{@props.collectionOwnerLogin}","Link",true)
        "user-and-project": @createLink("user-and-project","/users/#{@props.collectionOwnerLogin}")
      "recents":
        "all": @createLink("all","/talk/recents")
        "user": @createLink("user","/users/#{@props.collectionOwnerLogin}")
        "project": @createLink("project","/talk/recents")
        "user-and-project": @createLink("user-and-project","/users/#{@props.collectionOwnerLogin}")
    }

    # now we set the message keys, according to context and perspective
    for baseType,links of candidateLinks
      for filterType, to of links
        links[filterType]["messageKey"] = "collectionsPage.#{baseType}.#{@perspective}.#{@convertFilterTypeForMessageKey(filterType)}"

    # now we have to decide which links to show, according to base type, filter, context and perspective
    linksToShow = []

    # first handle collection links
    if @baseType == "collections"
      linksToShow.push candidateLinks[@baseType]["all"]
      if @context.includes("user")
        linksToShow.push candidateLinks[@baseType]["user"]
      if @context.includes("project")
        linksToShow.push candidateLinks[@baseType]["project"]
      if @context == "user-and-project"
        linksToShow.push candidateLinks[@baseType]["user-and-project"]

    # now favorites links
    if @baseType == "favorites"
      if @context.includes("project")
        linksToShow.push candidateLinks[@baseType]["all"]
      if @context.includes("user")
        linksToShow.push candidateLinks[@baseType]["user"]
      if @context.includes("project")
        linksToShow.push candidateLinks[@baseType]["project"]
      if @context == "user-and-project"
        linksToShow.push candidateLinks[@baseType]["user-and-project"]

    # now short links to alternate baseType
    if @baseType != "collections"
      shortCollectionsLink = @getBestLink "collections", candidateLinks["collections"]
      shortCollectionsLink.messageKey = "collectionsPage.collections.short"
      linksToShow.push shortCollectionsLink
    if @baseType != "favorites"
      shortFavoritesLink = @getBestLink "favorites", candidateLinks["favorites"]
      shortFavoritesLink.messageKey = "collectionsPage.favorites.short"
      linksToShow.push shortFavoritesLink

    # now user profile
    if @context.includes("user")
      linksToShow.push @getBestLink "profile", candidateLinks["profile"]

    # now recents
    # if (viewing profile or project recents)
    #  linksToShow.push getBestLink "recents", candidateLinks["recents"]

    # now context removal link
    contextRemovalLink = @createLink(@filterType,@getRemoveProjectContextLink(),"Link",false,true)
    contextRemovalLink["messageKey"] = "collectionsPage.viewOnZooniverseOrg"
    linksToShow.push contextRemovalLink

    return linksToShow

  generateUniqueKeyForLinkInstance: (link) ->
    link.to + "-" + @getUniqueId()

  generateTranslateLink: (messageKey) ->
    if @props.project?
      if @props.collectionOwnerName?
        <Translate content="#{messageKey}" projectDisplayName={@props.unbreakableProjectDisplayName} collectionOwnerName={@props.unbreakableCollectionOwnerName} />
      else
        <Translate content="#{messageKey}" projectDisplayName={@props.unbreakableProjectDisplayName} />
    else
      if @props.collectionOwnerName?
        <Translate content="#{messageKey}" collectionOwnerName={@props.unbreakableCollectionOwnerName} />
      else
        <Translate content="#{messageKey}" />

  renderLink: (link) ->
    key = @generateUniqueKeyForLinkInstance(link)
    if link.linkType == "IndexLink"
      if link.newFilterType==@filterType
        <IndexLink key="#{key}" to="#{link.to}" activeClassName="active">
          {@generateTranslateLink(link.messageKey)}
        </IndexLink>
      else
        <IndexLink key="#{key}" to="#{link.to}">
          {@generateTranslateLink(link.messageKey)}
        </IndexLink>
    else
      if link.newFilterType==@filterType
        <Link key="#{key}" to="#{link.to}" activeClassName="active">
          {@generateTranslateLink(link.messageKey)}
        </Link>
      else
        <Link key="#{key}" to="#{link.to}">
          {@generateTranslateLink(link.messageKey)}
        </Link>

  renderNavBar: ->
    <nav className="hero-nav">
      {@renderNavLinks()}
    </nav>

  renderNavLinks: ->
    navLinks = @getLinksToShow()
    for i, link of navLinks
      @renderLink(link)

  render: ->
    @filterType = @props.situation.filterType
    @perspective = @props.situation.perspective
    @baseType = @props.situation.baseType
    @context = @props.situation.context
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

  convertFilterTypeForMessageKey: (filterType) ->
    if filterType == "user-and-project"
      return "userAndProject"
    else
      return filterType

  listCollections: (collectionOwner,project) ->
    filter = @getFilterFromPath()
    query = {}
    for field, value of filter
      query[field] = value

    query.favorite = @props.favorite
    Object.assign query, @props.location.query

    apiClient.type('collections').get query

  # return the display name of the collection owner (just login name for now)
  getCollectionOwnerLogin: ->
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

  # determine the current situation: context, perspective, baseType and filterType
  determineSituation: ->
    if @props.project?
      if @collectionOwnerLogin? and @collectionOwnerLogin != "all"
        context = "user-and-project"
      else
        context = "project"
    else
      if @collectionOwnerLogin? and @collectionOwnerLogin != "all"
        context = "user"
      else
        context = "all"
    if @viewingOwnCollections
      perspective = "self"
    else
      perspective = "other"
    if @props.favorite
      baseType = "favorites"
    else
      baseType = "collections"
    if @filter?
      if "project_ids" of @filter
        if "owner" of @filter
          filterType = "user-and-project"
        else
          filterType = "project"
      else
        if "owner" of @filter and @filter["owner"] != "all"
          filterType = "user"
        else
          filterType = "all"
    else
      filterType = "all"
    #console.log "context",context,"baseType",baseType,"filterType",filterType,"perspective",perspective
    return {
      context: context
      perspective: perspective
      baseType: baseType
      filterType: filterType
    }

  getTitleMessageKey: ->
    "collectionsPage.title.#{@situation.baseType}.#{@convertFilterTypeForMessageKey(@situation.filterType)}"

  getFilterFromPath: ->
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

  makeTextUnbreakable: (text) ->
    text.replace /\ /g, "\u00a0"

  getUnbreakableProjectDisplayName: ->
    if @props.project?
      return @makeTextUnbreakable(@props.project.display_name)

  getUnbreakableCollectionOwnerName: ->
    if @collectionOwnerLogin? and @collectionOwnerLogin != "all"
      return @makeTextUnbreakable(@collectionOwnerLogin)

  getHeroNavWithAppropriateParams: ->
    if @props.params?.collection_owner? or @props.params?.favorites_owner?
      <CollectionsNav user={@props.user}
                      location={@props.location}
                      situation={@situation}
                      unbreakableProjectDisplayName = {@unbreakableProjectDisplayName}
                      unbreakableCollectionOwnerName = {@unbreakableCollectionOwnerName}
                      filter={@filter}
                      project={@props.project}
                      owner={@props.owner}
                      viewingOwnCollections={@viewingOwnCollections}
                      collectionOwnerName={@collectionOwnerLogin}
                      collectionOwnerLogin={@collectionOwnerLogin} />
    else
      <CollectionsNav user={@props.user}
                      location={@props.location}
                      situation={@situation}
                      unbreakableProjectDisplayName = {@unbreakableProjectDisplayName}
                      unbreakableCollectionOwnerName = {@unbreakableCollectionOwnerName}
                      filter={@filter}
                      project={@props.project}
                      owner={@props.owner}
                      viewingOwnCollections={@viewingOwnCollections} />

  render: ->
    if @props.params?.collection_owner? or @props.params?.favorites_owner?
      @collectionOwnerLogin = @getCollectionOwnerLogin()
    else
      @collectionOwnerLogin = "all"
    @viewingOwnCollections = @props.user? and @props.user.login == @getCollectionOwnerLogin()
    @filter = @getFilterFromPath()
    @situation = @determineSituation()
    @unbreakableProjectDisplayName = @getUnbreakableProjectDisplayName()
    @unbreakableCollectionOwnerName = @getUnbreakableCollectionOwnerName()

    <OwnedCardList
      {...@props}
      translationObjectName = "collectionsPage"
      unbreakableProjectDisplayName = {@getUnbreakableProjectDisplayName()}
      unbreakableCollectionOwnerName = {@getUnbreakableCollectionOwnerName()}
      listPromise = {@listCollections(@collectionOwnerLogin)}
      linkTo = "collections"
      filter = {@filter}
      situation = {@situation}
      titleMessageKey = {@getTitleMessageKey()}
      heroNav = {@getHeroNavWithAppropriateParams()}
      heroClass = "collections-hero"
      ownerName = {@collectionOwnerLogin}
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
