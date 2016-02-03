React = require 'react'
ReactDOM = require 'react-dom'
talkClient = require 'panoptes-client/lib/talk-client'
apiClient = require 'panoptes-client/lib/api-client'
auth = require 'panoptes-client/lib/auth'
PromiseRenderer = require '../components/promise-renderer'
ChangeListener = require '../components/change-listener'
{Markdown} = require 'markdownz'
CommentLink = require '../pages/profile/comment-link'
Paginator = require './lib/paginator'
Loading = require '../components/loading-indicator'
{Link} = require 'react-router'
PAGE_SIZE = require('./config').moderationsPageSize
{History} = require 'react-router'
merge = require 'lodash.merge'
projectSection = require './lib/project-section'
userIsModerator = require './lib/user-is-moderator'
moment = require 'moment'

actionTaken =
  destroy: 'Deleted'
  destroyed: 'Deleted'
  open: 'Opened'
  opened: 'Opened'
  close: 'Deleted'
  closed: 'Deleted'
  ignore: 'Ignored'
  ignored: 'Ignored'
  watch: 'Watched'
  watched: 'Watched'

module?.exports = React.createClass
  displayName: 'TalkModerations'
  mixins: [History]

  getInitialState: ->
    moderations: []
    moderationsMeta: {}
    user: null
    loading: true

  getDefaultProps: ->
    location: query: page: 1

  componentDidMount: ->
    @props.location.query.state or= 'opened'
    @setModerations(@props.location.query.page)

  componentWillReceiveProps: (nextProps) ->
    @setModerations(nextProps.location.query.page)

  setModerations: (page) ->
    @setState loading: true
    @setModerationsForSection(page, @props.section)

  setModerationsForSection: (page, section) ->
    moderationParams = merge {},
      {page: page, page_size: PAGE_SIZE, state: @props.location.query.state},
      if section then {section} else {}

    delete moderationParams.state if moderationParams.state is 'all'
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

    textarea = ReactDOM.findDOMNode(@).querySelector('.textarea-container textarea')
    message = textarea.value ? null

    updateParams =
      actions: [{
        user_id: @state.user.id
        action: action
        message: message
        }]

    moderation.update(updateParams).save()
      .then (updatedModeration) =>
        textarea.value = ''
        @setModerations()

  report: (report, i) ->
    <div key={"report-#{i}"}>
      <PromiseRenderer promise={apiClient.type('users').get(report.user_id.toString())}>{(user) =>
        <li>
          <Link to="/users/#{user.login}">{user.display_name}</Link>: {report.message}
        </li>
      }</PromiseRenderer>
    </div>

  comment: (comment, moderation) ->
    <div key={"comment-#{comment.id}"}>
      <h1>Comment {comment.id} Reports</h1>
      <ul>{moderation.reports.map(@report)}</ul>

      <span>Reported comment by:{' '}
        <Link to="/users/#{comment.user_login}">
          {comment.user_display_name}
        </Link>:
      </span>

      <CommentLink comment={comment} />

      <div className="moderations-actions-buttons">
        <p>Status: <strong>{actionTaken[moderation.state] ? moderation.state}</strong> {moment(moderation.created_at).fromNow()}</p>

        {if moderation.actions.length
          <div>
            {moderation.actions.map(@action)}
          </div>
          }

        {if moderation.state isnt 'closed'
          <div className="textarea-container">
            <textarea placeholder="Optional message" />
          </div>
          }

        {if moderation.state isnt 'closed'
          comment.moderatable_actions
            .filter (action) =>
              (moderation.state.indexOf(action) is -1) and (action isnt 'report')
            .map (action) =>
              if action is 'destroy'
                <button key={"action-#{comment.id}-#{action}"} className="moderations-#{action}" onClick={=>
                  if window.confirm("Are you sure that you want to delete the reported comment?")
                    @updateModeration(moderation, action)
                }>Delete</button>
              else
                <button key={"action-#{comment.id}-#{action}"} className="moderations-#{action}" onClick={=> @updateModeration(moderation, action)}>{action}</button>
          }
      </div>
    </div>

  action: (action, i) ->
    <PromiseRenderer promise={apiClient.type('users').get(action.user_id.toString())}>{(user) =>
      <div>
        {actionTaken[action.action] ? action.action} by <Link to="/users/#{user.login}">{user.display_name}</Link>
        {if action.message
          <div><i className="fa fa-quote-left"/> {action.message} <i className="fa fa-quote-right"/></div>
          }
      </div>
    }</PromiseRenderer>

  moderatedComment: (moderation) ->
    if moderation.destroyed_target
      Promise.resolve moderation.destroyed_target
    else
      talkClient.type('comments').get moderation.target_id

  moderation: (moderation, i) ->
    <div key={"moderation-#{moderation.id}"} className="talk-module">
      <PromiseRenderer promise={@moderatedComment moderation}>{(comment) =>
        <div>
          {@comment(comment, moderation)}
        </div>
      }</PromiseRenderer>
    </div>

  filterByAction: (action) ->
    {owner, name} = @props.params
    if (owner and name)
      @history.pushState(null, "/projects/#{owner}/#{name}/talk/moderations?state=#{action}")
    else
      @history.pushState(null, "/talk/moderations?state=#{action}")

  render: ->
    {moderations} = @state
    {owner, name} = @props.params

    if @props.user?
      roles = talkClient.type('roles').get(user_id: @props.user.id, page_size: 100)
      <PromiseRenderer promise={roles}>{(roles) =>
        if userIsModerator(@props.user, roles, @props.section)
          <div className="talk moderations">
            <section>
              <button
                key='all-reports'
                onClick={=> @filterByAction('all')}
                className={if @props.location.query.state is 'all' then 'active' else ''}>
                All reports
              </button>

              {['opened', 'ignored', 'closed'].map (action) =>
                <button
                  key={action}
                  onClick={=> @filterByAction(action)}
                  className={if @props.location.query.state is action then 'active' else ''}>
                  {actionTaken[action] ? action}
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
        else
          <p>You must be a moderator to view this page</p>
      }</PromiseRenderer>
    else
      <p>You must be logged in to view this page</p>
