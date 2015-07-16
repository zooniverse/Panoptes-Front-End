React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
talkClient = require '../../api/talk'

intersect = (arr1, arr2) ->
  arr1.filter (n) -> arr2.indexOf(n) isnt -1

userIsZooniverseAdmin = (usersRoles) ->
  zooniverseAdminRoles = usersRoles.filter (role) ->
    role.section is 'zooniverse' and role.name is 'admin'
  zooniverseAdminRoles.length > 0

userIsModerator = (user, roles, section) -> # User response, Roles Response, Talk Section
  return true if userIsZooniverseAdmin(roles)

  allowedModerationRoles = ['admin', 'moderator']

  moderationRoles = roles
    .filter (role) -> role.section is section
    .map (role) -> role.name

  intersect(moderationRoles, allowedModerationRoles).length > 0

module?.exports = React.createClass
  displayName: 'Moderation'

  propTypes:
    section: React.PropTypes.string.isRequired # talk section

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
