React = require 'react'

DEFAULT_AVATAR = './assets/simple-avatar.jpg'

module?.exports = React.createClass
  displayName: 'Avatar'

  propTypes:
    user: React.PropTypes.object # User response

  getDefaultProps: ->
    user: null

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
    <img src={@state.src} onError={@handleError} alt="User avatar" className="avatar" data-loading={@state.loading || null} />
