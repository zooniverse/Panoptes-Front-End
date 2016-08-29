React = require 'react'
InterventionMonitor = require './intervention-monitor'

Intervention = React.createClass

  contextTypes:
    interventionMonitor: React.PropTypes.object

  render: ->
    if @context.interventionMonitor?.latestFromSugar
      interventionData = @context.interventionMonitor.latestFromSugar
      <div class="intervention">
        <h3>{interventionData.title}</h3>
        <p>{interventionData.text}</p>
      </div>
    else
      <div className="intervention">
        <p>No intervention detected yet.</p>
      </div>

module.exports = Intervention