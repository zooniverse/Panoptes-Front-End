# @cjsx React.DOM

React = require 'react'
Link = require '../lib/link'

module.exports = React.createClass
  displayName: 'BuildPage'

  render: ->
    <div>
      <div className="content-container">
        <h1>Build the Zooniverse</h1>
      </div>
      <hr />
      <div className="content-container">
        <h2>Your projects</h2>
        <ul>
          <li><a href="#/build/Galaxy%20Zoo">Zooniverse/Galaxy Zoo</a></li>
        </ul>
      </div>
    </div>
