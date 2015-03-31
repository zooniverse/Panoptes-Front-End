module?.exports = (user, comment) ->
  user? and (Object.keys(comment.upvotes).indexOf(user.display_name) isnt -1)
