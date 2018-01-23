React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
talkClient = require 'panoptes-client/lib/talk-client'
auth = require 'panoptes-client/lib/auth'
Paginator = require './lib/paginator'
Loading = require('../components/loading-indicator').default
page_size = require('./config').moderationsPageSize
updateQueryParams = require './lib/update-query-params'
ModerationComment = require './moderation/comment'

module.exports = createReactClass
  displayName: 'TalkModerations'

  contextTypes:
    router: PropTypes.object.isRequired

  getInitialState: ->
    moderations: []
    moderationsMeta: {}
    user: null
    loading: true

  getDefaultProps: ->
    foo: 'bar'
    location:
      query:
        page: 1
        state: 'opened'

  componentDidMount: ->
    @props.location.query.state or= 'opened'
    @setModerations()

  componentWillReceiveProps: (nextProps) ->
    @setModerations nextProps.location.query

  setModerations: ({page, state} = { }) ->
    page or= @props.location.query.page
    state or= @props.location.query.state
    section = @props.section

    @setState loading: true
    auth.checkCurrent().then (user) =>
      talkClient.type('moderations').get({section, state, page, page_size})
        .then (moderations) =>
          moderationsMeta = moderations[0]?.getMeta()
          @setState {user, moderations, moderationsMeta, loading: false}
        .catch (e) =>
          @setState {loading: false}
          throw new Error(e)

  updateModeration: (moderation, action, message) ->
    user_id = @state.user.id
    moderation.update(actions: [{user_id, action, message}]).save().then =>
      @setModerations()

  filterByAction: (action) ->
    updateQueryParams @context.router, state: action

  nameOf: (action) ->
    switch action
      when 'closed' then 'deleted'
      when 'all' then 'all reports'
      else
        action

  render: ->
    return <p>You must be logged in to view this page</p> unless @props.user
    state = @props.location.query.state

    <div className="talk moderations">
      <section>
        {['all', 'opened', 'ignored', 'closed'].map (action) =>
          <button
            key={action}
            onClick={=> @filterByAction(action)}
            className={if state is action then 'active' else ''}>
            {@nameOf(action)}
          </button>}
      </section>

      <div>
        {if @state.loading
           <Loading />
        else if @state.moderations.length > 0
          <div>
            {for moderation in @state.moderations
              <ModerationComment {...@props}
                key={"moderation-#{moderation.id}"}
                moderation={moderation}
                updateModeration={@updateModeration} />}

            <Paginator
              page={+@state.moderationsMeta.page}
              pageCount={+@state.moderationsMeta.page_count} />
          </div>
        else
          <p>There are not currently any {@nameOf(state) unless state is 'all'} moderations.</p>}
      </div>
    </div>
