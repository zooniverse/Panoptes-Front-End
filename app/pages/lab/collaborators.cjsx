React = require 'react'

module.exports = React.createClass
  displayName: 'EditProjectCollaborators'

  getDefaultProps: ->
    project: null

  render: ->
    <div>
      Collaborators<br />
      <table>
        <tr>
          <td>User name</td>
          <td><input type="checkbox" /> Admin</td>
          <td><input type="checkbox" /> Scientist</td>
          <td><input type="checkbox" /> Moderator</td>
          <td><input type="checkbox" /> Translator</td>
          <td><button type="button">&times;</button></td>
        </tr>
      </table>
      <div>
        <input type="text" /> <button type="button">Add collaborator</button>
      </div>
    </div>
