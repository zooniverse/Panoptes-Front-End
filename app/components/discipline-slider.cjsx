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
        <div className={"discipline discipline-#{filter.value}"} >
          <span key={i} className="icon icon-#{filter.value}"></span>
          <p>{filter.label}</p>
        </div>
      }
    </div>






