React = require 'react'
StepThrough = require './step-through'
MediaCard = require './media-card'
{DISCIPLINES} = require './disciplines'
Filmstrip = require './filmstrip'

module.exports = React.createClass
  displayName: 'DisciplineSlider'

  propTypes:
    selectedDiscipline: React.PropTypes.string

  getDefaultProps: ->
    filterCards: DISCIPLINES

  render: ->
    <div>
      <Filmstrip increment={350} />
    </div>






