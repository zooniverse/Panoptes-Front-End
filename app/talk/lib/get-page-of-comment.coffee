module?.exports = (comment, discussion, pageSize) ->
  # comment resource, discussion resource, integer
  comments = discussion.links.comments
  commentNumber = comments.indexOf(comment.id.toString()) + 1
  Math.ceil commentNumber / pageSize
