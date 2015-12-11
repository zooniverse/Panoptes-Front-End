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
      <div className={"filter"}>
        {for filter, i in @props.filterCards
          <div className={"discipline discipline-#{filter.value}"} >
            <span key={i} className="icon icon-#{filter.value}"></span>
            <p>{filter.label}</p>
          </div>
        }
      </div>
    </div>






