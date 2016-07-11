React = require 'react'

DEFAULT_AVATAR = '/assets/simple-avatar.jpg'

module.exports = React.createClass
  displayName: 'Avatar'

  propTypes:
    user: React.PropTypes.object
    size: React.PropTypes.any
    className: React.PropTypes.string

  getDefaultProps: ->
    user: null
    size: ''
    className: ''

  getInitialState: ->
    loading: false
    src: DEFAULT_AVATAR

  componentDidMount: ->
    @props.user.listen 'change', @handleResourceChange
    @handleResourceChange()

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.user is @props.user
      @props.user.stopListening 'change', @handleResourceChange
      nextProps.user.listen 'change', @handleResourceChange
      @handleResourceChange nextProps.user

  componentWillUnmount: ->
    @props.user.stopListening 'change', @handleResourceChange

  handleResourceChange: (user = @props.user) ->
    @setState loading: true
    user.get 'avatar'
      .then ([avatar]) =>
        @setState src: avatar.src
      .catch =>
        @setState src: DEFAULT_AVATAR
      .then =>
        @setState loading: false

  handleError: ->
    @setState src: DEFAULT_AVATAR

  render: ->
    <img
      src={@state.src}
      alt="Avatar for #{@props.user.display_name}"
      className={"avatar #{@props.className}".trim()}
      data-loading={@state.loading || null}
      style={
        height: @props.size
        width: @props.size
      }
      onError={@handleError}
    />
