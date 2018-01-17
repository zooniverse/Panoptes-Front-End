React = require 'react'
createReactClass = require 'create-react-class'

DEFAULT_AVATAR = '/assets/simple-avatar.png'

module.exports = createReactClass
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
    @setState src: (user.avatar_src || DEFAULT_AVATAR)

  handleError: ->
    @setState src: DEFAULT_AVATAR

  render: ->
    <img
      src={@state.src}
      alt="Avatar for #{@props.user.display_name}"
      className={"avatar #{@props.className}".trim()}
      style={
        height: @props.size
        width: @props.size
      }
      onError={@handleError}
    />
