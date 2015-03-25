React = require 'react'

module.exports = React.createClass
  displayName: 'EditWorkflow'

  getDefaultProps: ->
    workflow: null

  render: ->
    <div className="columns-container">
      <div>
        <small>TODO</small><br />
        <div>
          Name<br />
          <input type="text" placeholder="Workflow name" />
        </div>
        <div>
          (Retirement rules editor)
        </div>
        <div>
          Associated subject sets
          <table>
            <tr>
              <td><input type="checkbox" checked /></td>
              <td>Subject set display name</td>
            </tr>
          </table>
        </div>
      </div>
      <div className="column">
        Tasks<br />
        (Workflow tasks editor)
      </div>
    </div>
