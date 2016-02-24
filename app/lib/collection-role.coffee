apiClient = require 'panoptes-client/lib/api-client'

module.exports =
  hasSettingsRole: ->
    if @props.user?
      apiClient.type('collection_roles').get(collection_id: @props.collection.id, user_id: @props.user.id)
        .then ([userRoles]) ->
          userRoles.roles.some (role) -> role.match ///owner|collaborator///i
        .catch ->
          false
    else
      false
