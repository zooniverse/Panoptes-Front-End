React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
talkClient = require '../../api/talk'
userIsModerator = require './user-is-moderator'

module?.exports = React.createClass
  displayName: 'Moderation'

  propTypes:
    section: React.PropTypes.string.isRequired # talk section
    user: React.PropTypes.object.isRequired

  getInitialState: ->
    open: false

  toggleModeration: (e) ->
    @setState open: !@state.open

  render: ->
    {section} = @props

    <div>
      <PromiseRenderer pending={null} promise={talkClient.type('roles').get(user_id: @props.user.id, section: ['zooniverse', section], page_size: 100)}>{(roles) =>
        if userIsModerator(@props.user, roles, section)
          <div className="talk-moderation">
            <button onClick={@toggleModeration}>
              <i className="fa fa-#{if @state.open then 'close' else 'warning'}" /> Moderator Controls
            </button>
            <div className="talk-moderation-children #{if @state.open then 'open' else 'closed'}">
              {if @state.open
                  @props.children
                else
                  null}
            </div>
          </div>
      }</PromiseRenderer>
    </div>
