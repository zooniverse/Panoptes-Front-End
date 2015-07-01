module?.exports = (comment, discussion, pageSize) ->
  # comment resource, discussion resource, integer
  comments = discussion.links.comments
  commentNumber = comments.indexOf(comment.id) + 1
  Math.ceil commentNumber / pageSize
