module.exports = (user, comment) ->
  user? and (Object.keys(comment.upvotes).indexOf(user.login) isnt -1)
