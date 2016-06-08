# When it comes to "context", there are actually a few different related concepts, which are explained here:
#
#  - Base Type   : When looking at user data, we can look at one of two types of set: collections or favorites (which are actually collections under the covers, but have special routes)
#
#  - Context     : Pages such as collections, recents, favorites and user profiles can be viewed either in a "zoo-wide" context (@props.project? will be false)
#                  or in the context of a specific project.
#                  In a project context, the user can be in the context of a particular user, or all users.
#                  This gives four possible contexts at any given time: user, project, user + project or everything (zoo-wide, a.k.a. "all").
#                  When we change context, we don't necessarily change what data is shown, just how it is referred to or presented.
#
#  - Filter      : The filter will determine which collections, favorites or recents are actually shown.
#                  This usually corresponds to the context - but doesn't have to.
#                  We can filter by project, by user, or by user + project, or have no filter in affect.
#                  when we change the filter, we modify the query and actually change what data is shown.
#
#  - Perspective : Pages such as collections, recents and favorites can be viewed in one of three perspectives:
#                  - viewing your *own* collections ("self"), viewing those of other users while logged in ("other"),
#                  or viewing those of any users while logged out ("anonymous")
#                  When we change perspective, we don't change what content is shown, just how it is referred to or presented.
#                  (Caveat: Privacy settings may cause different content to be visible depending on who we are - but this is handled
#                   entirely by the API and is ignored in the front-end except for marking when a collection is Private)
#
# Here is a guide to the various contextual URL routes we are supporting:
#
#   /projects/project_owner/project_name/collections/collection_owner     -> All collection_owner's collections for project_name
#   /projects/project_owner/project_name/collections/                     -> All collections for project_name
#   /collections/collection_owner                                         -> All collections by collection owner
#   /collections/                                                         -> All collections for all users
#   /projects/project_owner/project_name/favorites/collection_owner       -> All collection_owner's favorites for project_name
#   /projects/project_owner/project_name/favorites/                       -> All favorites collections for project_name
#   /favorites/collection_owner                                           -> All collections owner's favorites
#   /favorites/                                                           -> All favorites for all users
#   /users/user_name                                                      -> The profile for user_name, in general Zooniverse context
#   /projects/project_owner/project_name/users/user_name                  -> The profile for user_name, in the context of project_name
#   /projects/project_owner/project_name/talk/recents/user_name           -> All recent comments for user_name made to the Talk of project_name
#   /projects/project_owner/project_name/talk/recents                     -> All recent comments for all users and made to the Talk of project_name
#   /talk/recents/user_name                                               -> All recent comments made by user_name to all projects
#   /talk/recents/board_id                                                -> All recent comments on board_id made by user_name
#   /talk/recents/                                                        -> All recent comments for all users and all projects
#


module.exports =

  
  #  In general, when we are in a user context, that could be the user who we're logged in as or the user whose content 
  # we're viewing. Therefore we can deduce this from props 
  # This method will return the login name of the user whose context we are in
  # This comes from the collection, if present, otherwise from the logged in user if there is one.

  getContextUserLogin: (props) ->
    if props.favorite and props.params?.favorites_owner?
      return props.params.favorites_owner
    else if !props.favorite and props.params?.collection_owner?
      return props.params.collection_owner
    else if !props.project? and props.params?.owner?
      return props.params.owner
    else if props.user?
      return props.user.login
    else
      return props.params.owner # which may be null
  
  # to discourage navigation links from ending up with a line break on small screens, we can swap all spaces for &nbsp;
  makeTextUnbreakable: (text) ->
    text.replace /\ /g, "\u00a0"
    
  # ensures that a link will stay in the project context if we are in the context of a project
  prefixLinkIfNeeded: (props,url) ->
    if props.project?
      # keeps project in context
      url = "/projects/#{props.project.slug}" + url
    return url

  # determines current user/project/user+project filters in effect from the URL.
  # returns the correct format for directly attaching to the query.
  getFiltersFromPath: (props) ->
    filters = {}
    pathParts = @safelyGetPath(props)
    [firstPart, ..., lastPart] = pathParts

    if firstPart == "projects" and pathParts.length < 6 and lastPart != "all"
      filters["project_ids"] = props.project.id
    if firstPart == "collections" and pathParts.length == 2 and pathParts[1] != "" and pathParts[1] != "all"
      filters["owner"] = pathParts[1]
    if firstPart == "favorites" and pathParts.length == 2 and pathParts[1] != "" and pathParts[1] != ""
      filters["owner"] = pathParts[1]
    if pathParts.length>4 and pathParts[3] == "collections" and pathParts[4] != "" and pathParts[4] != "all"
      filters["owner"] = pathParts[4]
    if pathParts.length>4 and pathParts[3] == "favorites" and pathParts[4] != "" and pathParts[4] != "all"
      filters["owner"] = pathParts[4]

    return filters

  # dashes not allowed in message keys, so we map the name. (We keep dashes so we can do things like context.includes("user"). )
  convertFilterTypeOrContextForUseInMessageKey: (filterType) ->
    if filterType == "user-and-project"
      return "userAndProject"
    else
      return filterType

  # get the path, ensuring the last element is never an empty string    
  safelyGetPath: (props) ->
    pathParts = props.location.pathname.split('/')
    [firstPart, ..., lastPart] = pathParts
    if lastPart==""
      pathParts=pathParts.slice 0, -1
    pathParts

  viewingAUsersCollectionsOrFavorites: (props) ->
    [first, ..., penultimate, last] = @safelyGetPath(props)
    return last!="" and (penultimate == "collections" or penultimate == "favorites")

  viewingAUserProfile: (props) ->
    [first, ..., penultimate, last] = @safelyGetPath(props)
    return penultimate == "users"

  viewingRecents: (props) ->
    [first, ..., penultimate, last] = @safelyGetPath(props)
    return last == "recents" or penultimate == "recents"

  # determine current context according to whether we are in a project and whether we are focussed on a user
  getCurrentContext: (props, contextUserLogin=@getContextUserLogin(props)) ->
    if props.project?
      if @viewingAUsersCollectionsOrFavorites(props)
        "user-and-project"
      else
        "project"
    else
      if @viewingAUsersCollectionsOrFavorites(props)
        "user"
      else
        "all"

  # determine current perspective
  getCurrentPerspective: (props) ->
    contextUserLogin=@getContextUserLogin(props)
    if props.user?.login?
      if contextUserLogin==props.user.login
        "self"
      else
        "other"
    else
      "anonymous"

  # determine what type of page we are viewing
  getCurrentBaseType: (props) ->
    if @viewingAUserProfile(props)
      "users"
    else if @viewingRecents(props)
      "talk/recents"
    else if props.favorite
      "favorites"
    else
      "collections"

  # determine what filter(s) are in effect - user, project, user-and-project or none ("all")
  getCurrentFilterType: (props, filter = @getFiltersFromPath(props)) ->
    if filter?
      if "project_ids" of filter
        if "owner" of filter
          "user-and-project"
        else
          "project"
      else
        if "owner" of filter
          "user"
        else
          "all"
    else
      "all"

  # get a link that is the non-project-specific version of current page    
  getRemoveProjectContextLink: (props) ->
    pathParts = @safelyGetPath(props)
    [first, ...] = pathParts
    if first == "projects"
      return pathParts[3...].join("/")
      
  # construct a message key for a link or title
  #
  # message keys are made up as follows:
  #
  # <link|title>.<baseType>.<desiredFilterType>.<currentPerspective>
  #
  # When currentPerspective == "anonymous", we also need the context:
  #
  # <link|title>.<baseType>.<desiredFilterType>.<currentPerspective>.<currentContext>
  #
  getMessageKey: (props,currentContext,desiredBaseType,desiredFilterType,currentPerspective,title=false) ->
    messageKey = ""
    
    if props.translationObjectName?
      messageKey += "#{props.translationObjectName}."
    
    if title
      messageKey += "title"
    else
      messageKey += "link"
      
    messageKey += ".#{desiredBaseType}.#{@convertFilterTypeOrContextForUseInMessageKey(desiredFilterType)}"
    
    if currentPerspective?
      messageKey += ".#{currentPerspective}"

    if currentPerspective=="anonymous"
      messageKey += ".#{@convertFilterTypeOrContextForUseInMessageKey(currentContext)}"
      
    messageKey

  # string summarizing what we would actually be filtering on for the desired filter
  getFilterSummary: (props,
    desiredFilterType=@getCurrentFilterType(props,contextUserLogin),
    desiredBaseType=@getCurrentBaseType(props),
    currentPerspective=@getCurrentPerspective(props)) ->

    if desiredBaseType=="users"
      summaryString = "this user's profile"
    else
      if desiredFilterType.includes("user")
        if currentPerspective=='self'
          summaryString="all my"
        else
          summaryString="all this user\'s"
      else
        summaryString="all"

      if desiredBaseType=="collections" or desiredBaseType=="favorites"
        summaryString += " #{desiredBaseType}"
      else if desiredBaseType=="talk/recents"
        summaryString += " recent comments"

      if desiredFilterType.includes("project")
        summaryString += " within this project"

    return summaryString

  # get message object with needed data for inserts
  getMessageWithData: (props,
    contextUserLogin=@getContextUserLogin(props),
    currentContext=@getCurrentContext(props,contextUserLogin),
    desiredFilterType=@getCurrentFilterType(props),
    desiredBaseType=@getCurrentBaseType(props),
    currentPerspective=@getCurrentPerspective(props),
    title=false) ->

    message = {}
    message.messageKey = @getMessageKey(props,currentContext,desiredBaseType,desiredFilterType,currentPerspective,title)
    message.hoverText = "View #{@getFilterSummary(props,desiredFilterType,desiredBaseType,currentPerspective)}"

    if desiredFilterType.includes("user") or desiredBaseType=="users" or currentContext=="project"
      message.user = {
        login: @makeTextUnbreakable(contextUserLogin)
        displayName: @makeTextUnbreakable(contextUserLogin) # in future we should get the actual display name
      }
    if desiredFilterType.includes("project")
      message.project = {
        id: props.project.id
        slug: props.project.slug
        displayName: @makeTextUnbreakable(props.project.display_name)
      }
    if currentContext?.includes('project') and !desiredFilterType?.includes('project')
      message.messageKey = "removeProjectContext." + message.messageKey
      message.hoverText += " on zooniverse.org"
    message.isATitle = title
    return message

  # used by the following method
  getUniqueId: (length=8) ->
    id = ""
    id += Math.random().toString(36).substr(2) while id.length < length
    id.substr 0, length

  # every link in react needs a unique ID. This creates one.
  generateUniqueKeyForLinkInstance: (url) ->
    tokenizedURL =  url.replace /\//g, "_"
    return "link_#{tokenizedURL}_#{@getUniqueId()}"

  # construct a URL for a link to specified base type with specified filter
  getURL: (props, desiredUserLogin, desiredBaseType, desiredFilterType) ->
    url = "/#{desiredBaseType}/"
    if desiredFilterType.includes("project")
      url = @prefixLinkIfNeeded(props,url)
    if desiredFilterType.includes("user")
      url += "#{desiredUserLogin}/"
    return url

  # returns a new filter type or context, adding in a user filter to whatever is currently present
  addUserToFilterOrContext: (currentValue) ->
    if currentValue=="project"
      return "user-and-project"
    else if currentValue=="all"
      return "user"
    else
      return currentValue

  # get an object with all the necessary information to render a link
  getLink: (props,
    contextUserLogin=@getContextUserLogin(props),
    currentContext=@getCurrentContext(props,contextUserLogin),
    desiredFilterType=@getCurrentFilterType(props),
    desiredBaseType=@getCurrentBaseType(props),
    currentPerspective=@getCurrentPerspective(props),
    title = false) ->

    url = @getURL(props,contextUserLogin,desiredBaseType,desiredFilterType)

    if desiredFilterType=="all" or desiredFilterType=="project"
      linkType="IndexLink"
    else
      linkType="Link"
      
    return {
      message: @getMessageWithData(props,contextUserLogin,currentContext,desiredFilterType,desiredBaseType,currentPerspective,title)
      to: url
      type: linkType
      key: @generateUniqueKeyForLinkInstance(url)
      baseType: desiredBaseType
    }

  getOppositeBaseType: (baseType) ->
    if baseType=="collections"
      return "favorites"
    else if baseType=="favorites"
      return "collections"
    else
      return baseType

  # links to "all collections", "all favorites", "all project collections", "all project favorites" etc.
  getContextualLinksAcrossUsers: (props,
    contextUserLogin=@getContextUserLogin(props),
    currentContext=@getCurrentContext(props,contextUserLogin),
    currentFilterType=@getCurrentFilterType(props),
    currentBaseType=@getCurrentBaseType(props),
    currentPerspective=@getCurrentPerspective(props)) ->

    links = []
    if currentContext.includes("project")
      desiredFilterType="project"
    else
      desiredFilterType="all"
    links.push @getLink(props,contextUserLogin,currentContext,desiredFilterType,currentBaseType,currentPerspective,false)
    if !props.user? and !currentContext.includes("user")
      # if not logged in and not looking at a user, there's room for a link to the other baseType.
      links.push @getLink(props,contextUserLogin,currentContext,desiredFilterType,@getOppositeBaseType(currentBaseType),currentPerspective,false)
    return links

  # links to "user's collections", "user's favorites", "user's project collections", "user's project favorites" etc.
  getContextualLinksForThisUser: (props,
    contextUserLogin=@getContextUserLogin(props),
    currentContext=@getCurrentContext(props,contextUserLogin),
    currentFilterType=@getCurrentFilterType(props),
    currentBaseType=@getCurrentBaseType(props),
    currentPerspective=@getCurrentPerspective(props)) ->
    links = []
    if currentContext.includes("user")
      links.push @getLink(props,contextUserLogin,currentContext,currentFilterType,currentBaseType,currentPerspective,false)
      links.push @getLink(props,contextUserLogin,currentContext,currentFilterType,@getOppositeBaseType(currentBaseType),currentPerspective,false)
    return links

  getSelfIfAvailable: (props) ->
    if props.user?
      return props.user.login

  # links to "my collections", "my favorites", etc. (if not already covered in getContextualLinksForThisUser)
  getContextualLinksForSelf: (props,
    contextUserLogin=@getSelfIfAvailable(props)
    currentContext=@getCurrentContext(props,contextUserLogin),
    currentFilterType=@getCurrentFilterType(props),
    currentBaseType=@getCurrentBaseType(props),
    currentPerspective=@getCurrentPerspective(props)) ->

    links = []
    if props.user? and not (currentContext.includes("user") and currentPerspective=="self")
      desiredFilterType = @addUserToFilterOrContext(currentFilterType)
      links.push @getLink(props,contextUserLogin,currentContext,desiredFilterType,currentBaseType,"self",false)
      if currentContext!="user" and currentPerspective!="other"
        links.push @getLink(props,contextUserLogin,currentContext,desiredFilterType,@getOppositeBaseType(currentBaseType),"self",false)
    return links

  # A project context removal link that will view the same user & baseType in a non-project context
  # If not in project context, return null
  getRemoveProjectContextLink: (props,
    contextUserLogin=@getContextUserLogin(props),
    currentContext=@getCurrentContext(props,contextUserLogin),
    currentFilterType=@getCurrentFilterType(props),
    currentBaseType=@getCurrentBaseType(props),
    currentPerspective=@getCurrentPerspective(props),
    desiredFilterType=@removeProjectFromFilterType(currentFilterType)) ->

    if currentContext.includes("project")
      # if in project context, add "remove project context" link
      return @getLink(props,contextUserLogin,currentContext,desiredFilterType,currentBaseType,currentPerspective,false)
    else
      return null

  removeProjectFromFilterType: (filterType) ->
    filterType = "user" if filterType == "user-and-project"
    filterType = "all" if filterType == "project"
    return filterType

  # sort function that always puts collections before favorites, and leaves everything else untouched.
  sortForCollectionsAndFavorites: (linkA,linkB) ->
    if linkA.baseType == "collections"
        return -1
      else if linkA.baseType == "favorites"
        return 1
      else
        return 0

  # get a title and list of links for a navigation bar, according to the current context, perspective, base type and filter
  getContextualTitleAndNavLinks: (props) ->
    contextUserLogin=@getContextUserLogin(props)
    context = @getCurrentContext(props, contextUserLogin)
    perspective = @getCurrentPerspective(props)
    baseType = @getCurrentBaseType(props)
    filterType = @getCurrentFilterType(props)
    title = @getMessageWithData(props, contextUserLogin, context, filterType, baseType, perspective, true)
    crossUsersContextualLinks = @getContextualLinksAcrossUsers(props,contextUserLogin)
    crossUsersContextualLinks.sort @sortForCollectionsAndFavorites
    thisUserContextualLinks = @getContextualLinksForThisUser(props,contextUserLogin)
    thisUserContextualLinks.sort @sortForCollectionsAndFavorites
    selfContextualLinks = @getContextualLinksForSelf(props)
    selfContextualLinks.sort @sortForCollectionsAndFavorites
    orderedLinks = crossUsersContextualLinks.concat thisUserContextualLinks, selfContextualLinks

    return {
      title: title
      links: orderedLinks
    }

  shouldShowCollectionOwner: (props,
    contextUserLogin=@getContextUserLogin(props),
    currentContext=@getCurrentContext(props,contextUserLogin)) ->
    return !currentContext.includes("user")
    
