React = require 'react'

Dialog = React.createClass
  render: ->
    <div className="dialog-underlay">
      {@transferPropsTo <div className="dialog-content">
        {@props.children}
      </div>}
    </div>

module.exports = Dialog
