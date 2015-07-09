React = require 'react'
PrivateMessageForm = require '../../talk/private-message-form'
ChangeListener = require '../../components/change-listener'
PromiseRenderer = require '../../components/promise-renderer'
auth = require '../../api/auth'

module.exports = React.createClass
  displayName: 'PrivateMessagePage'

  render: ->

    <ChangeListener target={auth} handler={=>
      <PromiseRenderer promise={auth.checkCurrent()} then={(user) =>
        if user?
          <div className="content-container">
            <h2>
              Send a private message to {@props.user.display_name}
              {' '}
              {if user is @props.user
                <span>
                  <br />
                  <small className="form-help">(Hey wait, that’s you!)</small>
                </span>}
            </h2>

            <PrivateMessageForm {...@props} />
          </div>
        else
          <p>Sign in to send this user a message.</p>
      } />
    } />
