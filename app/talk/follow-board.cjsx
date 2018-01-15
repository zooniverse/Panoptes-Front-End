React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
talkClient = require 'panoptes-client/lib/talk-client'
SingleSubmitButton = require '../components/single-submit-button'

module.exports = createReactClass
  displayName: 'FollowBoard'

  propTypes:
    board: PropTypes.object.isRequired
    user: PropTypes.object.isRequired

  getInitialState: ->
    digest: null

  componentWillMount: ->
    {board} = @props
    @getSubscriptionFor(board.id) if board

  componentWillReceiveProps: (nextProps) ->
    boardId = nextProps.board?.id
    @getPreferences()
    @getSubscriptionFor(boardId) if boardId and boardId isnt @props.board?.id

  toggle: (e) ->
    e.preventDefault()
    if @state.subscription
      @state.subscription.update(enabled: not @state.subscription.enabled).save().then =>
        @getSubscriptionFor @props.board.id
    else
      talkClient.type('subscriptions').create
        source_id: @props.board.id
        source_type: 'Board'
        category: 'started_discussions'
      .save().then =>
        @getSubscriptionFor @props.board.id

  follow: ->
    talkClient.type('subscriptions').create
      source_id: @props.board.id
      source_type: 'Board'
      category: 'started_discussions'
    .save().then =>
      @getSubscriptionFor @props.board.id

  buttonLabel: ->
    if @state.subscription?.enabled
      'Unsubscribe'
    else
      'Subscribe'

  getPreferences: ->
    talkClient.type('subscription_preferences').get().then (preferences) =>
      for preference in preferences
        @setState(digest: preference.email_digest) if preference.category is 'started_discussions'

  getSubscriptionFor: (id) ->
    talkClient.type('subscriptions').get
      source_id: id
      source_type: 'Board'
    .then ([subscription]) =>
      @setState subscription: subscription, loaded: true

  render: ->
    <div className="talk-board-follow">
      {if @props.user and @state.loaded
        <div>
          <SingleSubmitButton onClick={@toggle}>{@buttonLabel()}</SingleSubmitButton>
          <p className="description">
            {if @state.subscription?.enabled
                "You're receiving notifications because you've subscribed to new discussions in this board"
              else
                "Subscribe to receive notifications for new discussions in this board"
            }{' '}
            {"(#{ @state.digest } email)" if @state.digest}
          </p>
        </div>
      }
    </div>
