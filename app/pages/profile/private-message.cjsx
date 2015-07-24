React = require 'react'
PrivateMessageForm = require '../../talk/private-message-form'

module.exports = React.createClass
  displayName: 'PrivateMessagePage'

  render: ->
    <div className="private-message-page">
      {if @props.user?
        <div className="content-container">
          <h2>
            Send a private message to {@props.profileUser.display_name}
            {' '}
            {if @props.user is @props.profileUser
              <span>
                <br />
                <small className="form-help">(Hey wait, that’s you!)</small>
              </span>}
          </h2>

          <PrivateMessageForm {...@props} />
        </div>
      else
        <p>Sign in to send this user a message.</p>}
    </div>
