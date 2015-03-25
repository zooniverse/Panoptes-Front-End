React = require 'react'

module.exports = React.createClass
  displayName: 'EditSubjectSet'

  getDefaultProps: ->
    subjectSet: null

  render: ->
    <div>
      <small>TODO</small><br />
      Name<br />
      <input type="text" placeholder="Subject set name" /><br />
      (Subject set editor)<br />
      <input type="file" />
    </div>
