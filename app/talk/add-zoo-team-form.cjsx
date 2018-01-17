React = require 'react'
createReactClass = require 'create-react-class'
ReactDOM = require 'react-dom'
UserSearch = require '../components/user-search.cjsx'
talkClient = require 'panoptes-client/lib/talk-client'
Feedback = require './mixins/feedback'

module.exports = createReactClass
  displayName: 'ModerationsZooniverseTeam'
  mixins: [Feedback]

  getInitialState: ->
    error: ''

  onClickAddZooniverseTeamMember: (e) ->
    return unless window.confirm('Are you sure that you want to add this user to the Zooniverse team?')

    e.preventDefault()
    userId = @userSearch.value().value

    talkClient.type('roles').create({
      name: 'admin'
      section: 'zooniverse'
      user_id: userId
    })
    .save()
    .then((role) =>
      @setFeedback "Zooniverse Team Member Added!"
    )
    .catch((e) =>
      @setState {error: e.message}
    )

  render: ->
    <div className="talk moderations-zooniverse-team content-container">
      <strong>Add a zooniverse team member</strong>

      <p style={color: 'red'}><strong>Careful:</strong> You are about to add someone to the Zooniverse team on Talk, this will grant them magical powers in the Zooniverse wide talk, and label them as 'Zooniverse Team'</p>

      <UserSearch ref={(component) => @userSearch = component} multi={false} />

      <button type="button" onClick={@onClickAddZooniverseTeamMember}>
        Add Member to The Zooniverse Team
      </button>

      {@renderFeedback()}

      {if @state.error
        <p className="talk-error">{@state.error}</p>
        }
    </div>
