React = require 'react'
StepThrough = require '../components/step-through'
MediaCard = require '../components/media-card'
{DISCIPLINES} = require '../components/disciplines'


module.exports = React.createClass
  displayName: 'DisciplineSlider'

  getDefaultProps: ->
    filterCards: DISCIPLINES


  render: ->
    console.log "RENDERING DISCIPLINES SLIDER"
    <StepThrough className={"media-discipline"} >
      {for filter, i in @props.filterCards
        filter._key ?= Math.random()
        <MediaCard className={"media-discipline-card"} key={filter.label } src={"/assets/project-pages/#{filter.value}.svg"} >

        </MediaCard>
      }
    </StepThrough>





