React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
talkClient = require 'panoptes-client/lib/talk-client'
userIsModerator = require './user-is-moderator'

module.exports = createReactClass
  displayName: 'Moderation'

  propTypes:
    section: PropTypes.string.isRequired # talk section
    user: PropTypes.object.isRequired
  
  getInitialState: ->
    roles: []

  componentWillMount: ->
    @updateRoles @props

  componentWillReceiveProps: (newProps) ->
    @updateRoles newProps

  updateRoles: (props) ->
    {section, user} = props
    talkClient.type 'roles'
      .get
        user_id: user.id
        section: ['zooniverse', section]
        page_size: 100
      .then (roles) =>
        @setState {roles}

  render: ->
    {section, user} = @props
    {roles} = @state
    if userIsModerator(user, roles, section)
      @props.children
    else
       null
