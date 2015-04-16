React = require 'react'
PrivateMessageForm = require '../talk/private-message-form'
PromiseRenderer = require '../components/promise-renderer'
authClient = require '../api/auth'

module.exports = React.createClass
  displayName: 'UserProfilePage'

  render: ->
    <div>
      User profiles to-do.

      <PromiseRenderer promise={authClient.checkCurrent()}>{(user) =>
        if user?.display_name isnt @props.params?.name
          <PrivateMessageForm {...@props} />
      }</PromiseRenderer>
    </div>
