React = require 'react'

module.exports = React.createClass
  displayName: 'EditProjectDetails'

  getDefaultProps: ->
    project: null

  render: ->
    <div className="columns-container">
      <div>
        <div>
          Avatar <button type="button">&times;</button><br />
          <img src="//placehold.it/100x100.png" /><br />
          <input type="file" />
        </div>
        <div>
          Background image <button type="button">&times;</button><br />
          <img src="//placehold.it/100x75.png" /><br />
          <input type="file" />
        </div>
      </div>
      <div className="column">
        <div>
          Name<br />
          <input type="text" placeholder="Project name" />
        </div>
        <div>
          Description<br />
          <textarea />
        </div>
        <div>
          Introduction<br />
          <textarea />
        </div>
      </div>
    </div>
