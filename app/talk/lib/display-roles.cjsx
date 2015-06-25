React = require 'react'

zooniverseAdminRole = (role) ->
  role.section is 'zooniverse' and role.name is 'admin'

researcherRole = (role) ->
  userIsResearcher = ['admin', 'scientist', 'owner'].indexOf(role.name) isnt -1
  role.section isnt 'zooniverse' and userIsResearcher

roleDisplayName = (role, section) ->
  if zooniverseAdminRole(role) # show zooniverse admins everywhere as 'team'
    "Zooniverse Team"
  else if researcherRole(role) # project admins, scientists, owners
    "Researcher"
  else if (role.section is section) # other current section roles
    role.name

DisplayRoles = React.createClass
  displayName: 'TalkDisplayRoles'

  propTypes:
    roles: React.PropTypes.array    # roles resources
    section: React.PropTypes.string # talk section

  role: (role, i) ->
    zooTeamName = if zooniverseAdminRole(role) then 'zoo-team'
    <p key={role.id} className="project-role #{zooTeamName ? role.name}">
      {roleDisplayName(role, @props.section)}
    </p>

  render: ->
    <div className="talk-display-roles">
      {@props.roles.map(@role)}
    </div>

module?.exports = DisplayRoles
