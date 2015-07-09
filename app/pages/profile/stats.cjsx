React = require 'react'
ClassificationsRibbon = require '../../components/classifications-ribbon'

module.exports = React.createClass
  getDefaultProps: ->
    user: null

  render: ->
    <div className="content-container">
      <h3>Your contribution stats</h3>
      <p className="form-help">Only you can see your stats.</p>
      <p><ClassificationsRibbon user={@props.user} /></p>
    </div>
