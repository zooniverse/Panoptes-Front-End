React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
talkClient = require 'panoptes-client/lib/talk-client'
{timeAgo} = require './lib/time'
DisplayRoles = require './lib/display-roles'
Avatar = require '../partials/avatar'
{Link} = require 'react-router'
{Markdown} = require 'markdownz'

PAGE_SIZE = require('./config').discussionPageSize

truncate = (string = '', ending = '', length = 80) ->
  return string if string.trim().length <= length
  string.trim().slice(0, (length - ending.length)) + ending

module.exports = createReactClass
  displayName: 'TalkLatestCommentLink'

  propTypes:
    project: PropTypes.object
    discussion: PropTypes.object
    title: PropTypes.bool
    preview: PropTypes.bool

  contextTypes:
    geordi: PropTypes.object
    router: PropTypes.object.isRequired

  getDefaultProps: ->
    title: false
    preview: false

  getInitialState: ->
    latestCommentText: ''

  logProfileClick: (profileItem) ->
    @context.geordi?.logEvent
      type: profileItem

  projectPrefix: ->
    if @props.project then 'project-' else ''

  lastPage: ->
    Math.ceil @props.discussion.comments_count / PAGE_SIZE

  componentDidMount: ->
    latestCommentText = @refs?.markdownText?.textContent
    @setState({latestCommentText}) if latestCommentText

  discussionLink: (childtext = '', query = {}, className = '') ->
    if className is "latest-comment-time"
      logClick = @context.geordi?.makeHandler? 'discussion-time'
    locationObject =
      pathname: "/talk/#{@props.discussion.board_id}/#{@props.discussion.id}"
      query: query
    if @props.params?.owner and @props.params?.name
      {owner, name} = @props.params
      locationObject.pathname = "/projects/#{owner}/#{name}" + locationObject.pathname

    <Link className={className} onClick={logClick?.bind(this, childtext)} to={@context.router.createHref(locationObject)}>
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
    if @props.project? and @props.project.slug?
      baseLink += "projects/#{@props.project.slug}/"

    <div className="talk-latest-comment-link">
      <div className="talk-discussion-link">
        <div ref="markdownText" className="hidden-markdown">
          <Markdown content={comment.body} />
        </div>

        {if @props.author?
          <Link className="user-profile-link" to="#{baseLink}users/#{@props.author.login}" onClick={@logProfileClick.bind this, 'view-profile-author'}>
            <Avatar user={@props.author} />{' '}{@props.author.display_name}
          </Link>}

        {' '}
        <DisplayRoles roles={@props.roles} section={comment.section} />

        <span>
          {if discussion.title and @props.title
            @discussionLink(discussion.title, linkQuery)}{' '}
        </span>

        {@discussionLink(timeAgo(comment.created_at), linkQuery, "latest-comment-time")}

        {if @props.preview
          @discussionLink(" #{truncate(@state.latestCommentText, '...')}", linkQuery, "latest-comment-preview-link")}

      </div>
    </div>
