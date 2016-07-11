userIsZooniverseAdmin = require './user-is-zooniverse-admin'

intersect = (arr1, arr2) ->
  arr1.filter (n) -> arr2.indexOf(n) isnt -1

userIsModerator = (user, roles, section) -> # User response, Roles Response, Talk Section
  return true if userIsZooniverseAdmin(roles)

  allowedModerationRoles = ['admin', 'moderator']

  moderationRoles = roles
    .filter (role) -> role.section is section
    .map (role) -> role.name

  intersect(moderationRoles, allowedModerationRoles).length > 0

module.exports = userIsModerator
