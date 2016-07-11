userIsZooniverseAdmin = (usersRoles) ->
  zooniverseAdminRoles = usersRoles.filter (role) ->
    role.section is 'zooniverse' and role.name is 'admin'
  zooniverseAdminRoles.length > 0

module.exports = userIsZooniverseAdmin
