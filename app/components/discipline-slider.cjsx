React = require 'react'
StepThrough = require '../components/step-through'
MediaCard = require '../components/media-card'
{DISCIPLINES} = require '../components/disciplines'


module.exports = React.createClass
  displayName: 'DisciplineSlider'

  propTypes:
    selectedDiscipline: React.PropTypes.string

  getDefaultProps: ->
    filterCards: DISCIPLINES



  render: ->

    <div className={"filter"}>
      {for filter, i in @props.filterCards
        filterName = filter.value.replace(" ", "-")
        <div className={"discipline discipline-#{filterName}"} >
          <span key={i} className="icon icon-#{filterName}"></span>
          <p>{filter.label}</p>
        </div>
      }
    </div>






