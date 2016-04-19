React = require 'react'
moment = require 'moment'
apiClient = require 'panoptes-client/lib/api-client'
talkClient = require 'panoptes-client/lib/talk-client'
{Markdown} = require 'markdownz'
PAGE_SIZE = require('../../talk/config').discussionPageSize

module?.exports = React.createClass
  displayName: 'CommentLink'

  getDefaultProps: ->
    comment: null

  getInitialState: ->
    project: null
    owner: null
    discussion: null
    board: null
    href: ''

  componentDidMount: ->
    @getCommentHREF(@props.comment)

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.comment is @props.comment
      @getCommentHREF(nextProps.comment)

  getCommentHREF: (comment) ->
    [rootType, rootID] = comment.section.split('-')

    talkClient.type('discussions').get(comment.discussion_id).then (discussion) =>
      @setState({discussion})

      talkClient.type('boards').get(discussion.board_id).then (board) =>
        @setState({board})
        href = if rootID?
          if rootType is 'project'
            # TODO: Focus
            apiClient.type('projects').get(rootID).then (project) =>
              @setState({project})
              project.get('owner').then (owner) =>
                @setState({owner})
                [owner, name] = project.slug.split('/')
                "/projects/#{owner}/#{name}/talk/#{board.id}/#{discussion.id}?comment=#{comment.id}"
        else
          Promise.resolve "/talk/#{board.id}/#{discussion.id}?comment=#{comment.id}"
        href.then (href) =>
          @setState
            href: document.baseURI.slice(0, -1) + href

  render: ->
    <div className="profile-feed-comment-link">
      <header>
        <span className="comment-timestamp" title={moment(@props.comment.created_at).toISOString()}>
          {moment(@props.comment.created_at).fromNow()}
        </span>
        {if @state.board?.id and @state.discussion?.id
          <span>
            {' '}in{' '}
            <a href={@state.href}>
              {if @state.project? and @state.owner
                <span>
                  <strong className="comment-project" title="#{@state.owner.display_name}/#{@state.project.display_name}">{@state.project.display_name}</strong>
                  ➞
                </span>}
              <strong className="comment-board">{@state.board?.title}</strong>
              ➞
              <strong className="comment-discussion">{@state.discussion?.title}</strong>
            </a>
          </span>}
      </header>

      <Markdown className="comment-body" content={@props.comment.body} />
    </div>
