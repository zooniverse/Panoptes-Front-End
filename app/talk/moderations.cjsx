React = require 'react'
talkClient = require '../api/talk'
apiClient = require '../api/client'
auth = require '../api/auth'
PromiseRenderer = require '../components/promise-renderer'
ChangeListener = require '../components/change-listener'
Markdown = require '../components/markdown'
CommentLink = require '../pages/profile/comment-link'
Paginator = require './lib/paginator'
Loading = require '../components/loading-indicator'
{Link} = require 'react-router'
PAGE_SIZE = require('./config').moderationsPageSize
{Navigation} = require 'react-router'
merge = require 'lodash.merge'
projectSection = require './lib/project-section'

module?.exports = React.createClass
  displayName: 'TalkModerations'
  mixins: [Navigation]

  getInitialState: ->
    moderations: []
    moderationsMeta: {}
    user: null
    loading: true
    filter: null

  getDefaultProps: ->
    query:
      page: 1

  componentDidMount: ->
    @setModerations(@props.query.page)

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.query.page is @props.query.page
      @setModerations(nextProps.query.page)

  setModerations: (page) ->
    @setState loading: true
    {owner, name} = @props.params

    if (owner and name)
      apiClient.type('projects').get(owner: owner, slug: name).then ([project]) =>
        @setModerationsForSection(page, projectSection(project))
    else
      @setModerationsForSection(page, 'zooniverse')

  setModerationsForSection: (page, section) ->
    moderationParams = merge {},
      {page: page, page_size: PAGE_SIZE},
      if @state.filter? then {state: @state.filter} else {},
      if section then {section} else {}

    auth.checkCurrent().then (user) => if user?
      talkClient.type('moderations').get(moderationParams)
        .then (moderations) =>
          moderationsMeta = moderations[0]?.getMeta()
          @setState {user, moderations, moderationsMeta, loading: false}
        .catch (e) =>
          @setState {loading: false}
          throw new Error(e)

  updateModeration: (moderation, action) ->
    if ['destroy', 'ignore', 'watch', 'open'].indexOf(action) is -1
      throw new Error("Moderation update action must be one of ['destroy', 'ignore', 'watch', 'open']")

    updateParams =
      actions: [{
        user_id: @state.user.id
        action: action
        message: "#{action}ing"
        }]

    moderation.update(updateParams).save()
      .then (updatedModeration) => @setModerations()

  report: (report, i) ->
    <div key={report.id}>
      <PromiseRenderer promise={apiClient.type('users').get(report.user_id.toString())}>{(user) =>
        <li>
          <Link to="user-profile" params={name: user.login}>{user.display_name}</Link>: {report.message}
        </li>
      }</PromiseRenderer>
    </div>

  comment: (comment, moderation) ->
    <div key={comment.id}>
      <h1>Comment {comment.id} Reports</h1>
      <ul>{moderation.reports.map(@report)}</ul>

      <CommentLink comment={comment} />

      <div className="moderations-actions-buttons">
        <p>Status: <strong>{moderation.state}</strong></p>
        {if moderation.state isnt 'closed'
          comment.moderatable_actions
            .filter (action) =>
              (moderation.state.indexOf(action) is -1) and (action isnt 'report')
            .map (action) =>
              if action is 'destroy'
                <button key={action} className="moderations-#{action}" onClick={=>
                  if window.confirm("Are you sure that you want to destroy the reported comment?")
                    @updateModeration(moderation, action)
                }>{action}</button>
              else
                <button key={action} className="moderations-#{action}" onClick={=> @updateModeration(moderation, action)}>{action}</button>
          }

      </div>
    </div>

  moderation: (moderation, i) ->
    <div key={moderation.id} className="talk-module">
      <PromiseRenderer promise={talkClient.type('comments').get(moderation.target_id)}>{(comment) =>
        <div>{@comment(comment, moderation)}</div>
      }</PromiseRenderer>
    </div>

  render: ->
    {moderations} = @state

    <div className="talk moderations">

      <section>
        <button
          key='all-reports'
          onClick={=> @setState filter: null, @setModerations}
          className={if @state.filter is null then 'active' else ''}>
          All reports
        </button>

        {['opened', 'ignored', 'closed'].map (action) =>
          <button
            key={action}
            onClick={=> @setState {filter: action}, @setModerations}
            className={if @state.filter is action then 'active' else ''}>
            {action}
          </button>
          }
      </section>

      {if @state.loading
         <Loading />
       else if moderations?.length > 0
         <div>{moderations?.map(@moderation)}</div>
       else
         <p>There are not currently any reports that require moderation.</p>
         }

      {if +@state.moderationsMeta?.page_count > 1
        <Paginator
          page={@state.moderationsMeta.page}
          pageCount={@state.moderationsMeta.page_count} />
        }
    </div>
