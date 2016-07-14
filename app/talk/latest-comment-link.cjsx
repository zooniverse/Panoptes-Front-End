React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
talkClient = require 'panoptes-client/lib/talk-client'
{timeAgo} = require './lib/time'
DisplayRoles = require './lib/display-roles'
Avatar = require '../partials/avatar'
PromiseRenderer = require '../components/promise-renderer'
{Link, History} = require 'react-router'
{Markdown} = (require 'markdownz').default

PAGE_SIZE = require('./config').discussionPageSize

truncate = (string = '', ending = '', length = 80) ->
  return string if string.trim().length <= length
  string.trim().slice(0, (length - ending.length)) + ending

module.exports = React.createClass
  displayName: 'TalkLatestCommentComment'
  mixins: [History]

  propTypes:
    project: React.PropTypes.object
    discussion: React.PropTypes.object
    title: React.PropTypes.bool
    preview: React.PropTypes.bool

  getDefaultProps: ->
    title: false
    preview: false

  getInitialState: ->
    commentUser: null
    latestCommentText: ''

  contextTypes:
    geordi: React.PropTypes.object

  logProfileClick: (profileItem) ->
    @context.geordi?.logEvent
      type: profileItem

  projectPrefix: ->
    if @props.project then 'project-' else ''

  lastPage: ->
    Math.ceil @props.discussion.comments_count / PAGE_SIZE

  componentWillMount: ->
    comment = @props.comment or @props.discussion?.latest_comment
    return unless comment
    apiClient.type('users').get(comment.user_id).then (commentUser) =>
      @setState {commentUser}

  componentDidMount: ->
    latestCommentText = @refs?.markdownText?.textContent
    @setState({latestCommentText}) if latestCommentText

  discussionLink: (childtext = '', query = {}, className = '') ->
    if className is "latest-comment-time"
      logClick = @context.geordi?.makeHandler? 'discussion-time'
    if @props.params?.owner and @props.params?.name
      {owner, name} = @props.params
      <Link className={className} onClick={logClick?.bind(this, childtext)} to={@history.createHref("/projects/#{owner}/#{name}/talk/#{@props.discussion.board_id}/#{@props.discussion.id}", query)}>
        {childtext}
      </Link>
    else
      <Link className={className} onClick={logClick?.bind(this, childtext)} to={@history.createHref("/talk/#{@props.discussion.board_id}/#{@props.discussion.id}", query)}>
        {childtext}
      </Link>

  render: ->
    {discussion} = @props
    comment = @props.comment or discussion?.latest_comment
    return <div /> unless (discussion and comment)

    linkQuery = if @props.comment
      comment: comment.id
    else
      scrollToLastComment: true, page: @lastPage()

    baseLink = "/"
    if @props.project?
      baseLink += "projects/#{@props.project.slug}/"

    <div className="talk-latest-comment-link">
      <div className="talk-discussion-link">
        <div ref="markdownText" className="hidden-markdown">
          <Markdown content={comment.body} />
        </div>

        {if @state.commentUser?
          <Link className="user-profile-link" to="#{baseLink}users/#{@state.commentUser.login}" onClick={@logProfileClick.bind this, 'view-profile-author'}>
            <Avatar user={@state.commentUser} />{' '}{@state.commentUser.display_name}
          </Link>}

        {' '}

        <PromiseRenderer promise={talkClient.type('roles').get(user_id: comment.user_id, section: ['zooniverse', comment.section], is_shown: true, page_size: 100)}>{(roles) =>
          <DisplayRoles roles={roles} section={comment.section} />
        }</PromiseRenderer>

        <span>
          {if discussion.title and @props.title
            @discussionLink(discussion.title, linkQuery)}{' '}
        </span>

        {@discussionLink(timeAgo(comment.created_at), linkQuery, "latest-comment-time")}

        {if @props.preview
          @discussionLink(" #{truncate(@state.latestCommentText, '...')}", linkQuery, "latest-comment-preview-link")}

      </div>
    </div>
