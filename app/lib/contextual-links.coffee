module.exports =
  # ensures that a link will stay in the project context if we are in the context of a project
  prefixLinkIfNeeded: (props,link) ->
    if props.project?
      # keeps project in context
      link = "/projects/#{props.project.slug}" + link
    return link

  # generate a link to the current page, but forcing any project context to be removed
  getRemoveProjectContextLink: (props) ->
    pathParts = props.location.pathname.split('/')
    [first, ..., last] = pathParts
    if first == "projects"
      if last == "all"
        return pathParts[3...-1].join("/")
      else
        return pathParts[3...].join("/")