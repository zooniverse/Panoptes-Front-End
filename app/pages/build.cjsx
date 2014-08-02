# @cjsx React.DOM

React = require 'react'

module.exports = React.createClass
  displayName: 'BuildPage'

  componentWillMount: ->
    document.documentElement.classList.add 'admin'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'admin'

  render: ->
    <div>
      <div className="content-container">
        <h1>Build the Zooniverse</h1>
        <p>This is the place to build and manage your own citizen science projects.</p>
      </div>
    </div>
