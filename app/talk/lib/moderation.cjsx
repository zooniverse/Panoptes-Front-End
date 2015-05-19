React = require 'react'
ChangeListener = require '../../components/change-listener'
PromiseRenderer = require '../../components/promise-renderer'
authClient = require '../../api/auth'

module?.exports = React.createClass
  displayName: 'Moderation'

  getInitialState: ->
    open: false

  toggleModeration: (e) ->
    @setState open: !@state.open

  render: ->
    <ChangeListener target={authClient}>{=>
      <PromiseRenderer promise={authClient.checkCurrent()}>{(user) =>
        if user? # TODO: if user?.moderator
          <div className="talk-moderation">
            <button onClick={@toggleModeration}>
              <i className="fa fa-#{if @state.open then 'close' else 'warning'}" /> Moderator Controls
            </button>
            <div className="talk-moderation-children #{if @state.open then 'open' else 'closed'}">
              {@props.children}
            </div>
          </div>
      }</PromiseRenderer>
    }</ChangeListener>

