React = require 'react'

module.exports = React.createClass
  displayName: 'EditSubjectSet'

  getDefaultProps: ->
    subjectSet: null

  render: ->
    <div>
      <div>
        Name<br />
        <input type="text" placeholder="Subject set name" />
      </div>
      <div>
        (Retirement rules editor)
      </div>
      <div>
        (Subject set editor)
      </div>
    </div>
