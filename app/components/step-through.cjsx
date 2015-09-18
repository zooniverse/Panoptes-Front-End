React = require 'react'
ReactSwipe = require 'react-swipe'

module.exports = React.createClass
  getDefaultProps: ->
    defaultStep: 0

  getInitialState: ->
    render: false
    step: @props.defaultStep

  componentDidMount: ->
    @refs.swiper.swipe.setup()

  render: ->
    childrenCount = React.Children.count @props.children

    <div className="step-through" {...@props}>
      <ReactSwipe ref="swiper" className="step-through-content" startSlide={@state.step} continuous={false} callback={@handleStep.bind this, childrenCount}>
        {@props.children}
      </ReactSwipe>

      <div className="step-through-controls" style={position: 'relative'}>
        <button type="button" aria-label="Previous step" title="Previous" disabled={@state.step is 0} onClick={@goPrevious}>◀</button>{' '}
        <span className="step-through-pips">
          {for i in [0..childrenCount - 1]
            <label key={i} title="Step #{i + 1}">
              <input type="radio" aria-label="Step #{i + 1} of #{childrenCount}" checked={i is @state.step} autoFocus={i is @state.step} onChange={@goTo.bind this, i} />
              <span className="step-through-pip-label">{i + 1}</span>{' '}
            </label>}
        </span>
        <button type="button" aria-label="Next step" title="Next" disabled={@state.step is childrenCount - 1} onClick={@goNext}>▶</button>
      </div>
    </div>

  goPrevious: ->
    @refs.swiper.swipe.prev()

  goNext: ->
    @refs.swiper.swipe.next()

  goTo: (index) ->
    @refs.swiper.swipe.slide index

  handleStep: (total, index) ->
    @setState
      step: index %% total
