React = require 'react'
StepThrough = require './step-through'
MediaCard = require './media-card'
{DISCIPLINES} = require './disciplines'
Filmstrip = require './filmstrip'

module.exports = React.createClass
  displayName: 'DisciplineSlider'

  propTypes:
    filterDiscipline: React.PropTypes.func.isRequired

  getDefaultProps: ->
    filterCards: DISCIPLINES

  render: ->
    <div>
      <Filmstrip increment={350} filterOption={@props.filterDiscipline}/>
    </div>






