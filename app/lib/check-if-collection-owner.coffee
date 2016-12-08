apiClient = require 'panoptes-client/lib/api-client'

checkIfCollectionOwner = (user, collection) ->
  if user?
    apiClient.type('collection_roles').get(collection_id: collection.id, user_id: user.id)
      .then ([userRoles]) ->
        userRoles.roles.some (role) -> role.match ///owner|collaborator///i
      .catch ->
        false
  else
    false

module.exports = checkIfCollectionOwner
