React = require 'react'
StepThrough = require '../components/step-through'
MediaCard = require '../components/media-card'
{DISCIPLINES} = require '../components/disciplines'


module.exports = React.createClass
  displayName: 'DisciplineSlider'

  propTypes:
    selectedDiscipline: React.PropTypes.string
    filterDiscipline: React.PropTypes.func.isRequired

  getDefaultProps: ->
    filterCards: DISCIPLINES



  render: ->
    <div className={"filter"}>
      <div className="discipline discipline-all" onClick={@props.filterDiscipline.bind this, ""} > 
        <p>All<br/>Disciplines</p>
      </div>
      {for filter, i in @props.filterCards
        filterName = filter.value.replace(" ", "-")
        <div className={"discipline discipline-#{filterName}"} onClick={@props.filterDiscipline.bind this, filter.value}  >
          <span key={i} className="icon icon-#{filterName}"></span>
          <p>{filter.label}</p>
        </div>
      }
    </div>






