# mixin --- feedback.cjsx

React = require 'react'

module.exports =
  getInitialState: ->
    feedback: null

  setFeedback: (text) ->
    window.addEventListener 'click', @removeFeedback
    @setState feedback: text

  removeFeedback: ->
    window.removeEventListener 'click', @removeFeedback
    @setState feedback: null

  renderFeedback: ->
    if @state.feedback
      <p className="talk-comment-feedback">{@state.feedback}</p>
