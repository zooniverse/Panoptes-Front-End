React = require 'react'

Dialog = React.createClass
  displayName: 'Dialog'

  render: ->
    <div className="dialog-underlay">
      {@transferPropsTo <div className="dialog-content">
        {@props.children}
      </div>}
    </div>

module.exports = Dialog
