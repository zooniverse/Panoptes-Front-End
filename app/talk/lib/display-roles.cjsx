React = require 'react'

zooniverseAdminRole = (role) ->
  role.section is 'zooniverse' and role.name is 'admin'

researcherRole = (role) ->
  userIsResearcher = ['admin', 'scientist', 'owner'].indexOf(role.name) isnt -1
  role.section isnt 'zooniverse' and userIsResearcher

getDisplayRoles = (roles, section) ->
  roles.reduce((roleList, role) ->
    if zooniverseAdminRole(role) # show zooniverse admins everywhere as 'team'
      roleList.concat "Zooniverse Team"
    else if researcherRole(role) # project admins, scientists, owners
      roleList.concat "Researcher"
    else if (role.section is section) # other current section roles
      roleList.concat role.name
  , [])

DisplayRoles = React.createClass
  displayName: 'TalkDisplayRoles'

  propTypes:
    roles: React.PropTypes.array    # roles resources
    section: React.PropTypes.string # talk section

  roleName: (name, i) ->
    <p key={i} className="project-role">{name}</p>

  render: ->
    roleNames = getDisplayRoles(@props.roles, @props.section)

    <div className="talk-display-roles">
      {roleNames.map(@roleName)}
    </div>

module?.exports = DisplayRoles
