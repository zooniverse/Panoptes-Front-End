React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
talkClient = require 'panoptes-client/lib/talk-client'
SingleSubmitButton = require '../components/single-submit-button'

module.exports = createReactClass
  displayName: 'FollowDiscussion'

  contextTypes:
    geordi: PropTypes.object

  propTypes:
    discussion: PropTypes.object.isRequired
    user: PropTypes.object.isRequired

  getInitialState: ->
    followed: null
    followedDigest: null
    participating: false
    participatingDigest: null

  componentWillMount: ->
    {discussion} = @props
    @getSubscriptionsFor(discussion.id) if discussion

  componentWillReceiveProps: (nextProps) ->
    discussionId = nextProps.discussion?.id
    @getPreferences()
    @getSubscriptionsFor(discussionId) if discussionId and discussionId isnt @props.discussion?.id

  logSubscribe: ->
    @context.geordi?.logEvent
      type: 'subscribe'

  toggleFollowed: (e) ->
    @logSubscribe()
    e.preventDefault()
    subscription = @state.subscriptions.followed_discussions
    if subscription
      @toggle subscription
    else
      @follow()

  toggleParticipating: (e) ->
    @logSubscribe()
    e.preventDefault()
    @toggle @state.subscriptions.participating_discussions

  toggle: (subscription) ->
    subscription.update(enabled: not subscription.enabled).save().then =>
      @getSubscriptionsFor @props.discussion.id

  follow: ->
    talkClient.type('subscriptions').create
      source_id: @props.discussion.id
      source_type: 'Discussion'
      category: 'followed_discussions'
    .save().then =>
      @getSubscriptionsFor @props.discussion.id

  buttonLabel: ->
    if @state.followed or @state.participating
      'Unsubscribe'
    else
      'Subscribe'

  followedText: ->
    if @state.followed
      "You're receiving notifications because you've subscribed to this discussion"
    else
      "Subscribe to receive notifications for updates to this discussion"

  digestText: (category) ->
    digest = @state["#{ category }Digest"]
    if digest then "(#{ digest } email)" else ''

  getPreferences: ->
    talkClient.type('subscription_preferences').get().then (preferences) =>
      newState = { }
      for preference in preferences
        newState.followedDigest = preference.email_digest if preference.category is 'followed_discussions'
        newState.participatingDigest = preference.email_digest if preference.category is 'participating_discussions'
      @setState newState

  getSubscriptionsFor: (id) ->
    talkClient.type('subscriptions').get
      source_id: id
      source_type: 'Discussion'
    .then (subscriptions) =>
      newState = subscriptions: { }, followed: null, participating: null, loaded: true

      for subscription in subscriptions
        newState.subscriptions[subscription.category] = subscription
        newState.followed = subscription.enabled if subscription.category is 'followed_discussions'
        newState.participating = subscription.enabled if subscription.category is 'participating_discussions'

      @setState newState

  render: ->
    <div className="talk-discussion-follow">
      {if @props.user and @state.loaded
        <div>
          {if @state.participating
            <div>
              <SingleSubmitButton onClick={@toggleParticipating}>{ @buttonLabel() }</SingleSubmitButton>
              <p className="description">You're receiving notifications from this discussion because you've joined it {@digestText 'participating'}</p>
            </div>
          else
            <div>
              <SingleSubmitButton onClick={@toggleFollowed}>{@buttonLabel()}</SingleSubmitButton>
              <p className="description">{@followedText()} {@digestText 'followed'}</p>
            </div>
          }
        </div>
      }
    </div>
