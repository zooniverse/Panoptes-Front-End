React = require 'react'
talkClient = require 'panoptes-client/lib/talk-client'
{Link} = require 'react-router'

module.exports = React.createClass
  displayName: 'TalkBreadcrumbs'
  
  getInitialState: ->
    board: null
    discussion: null
  
  componentWillMount: ->
    @updateBoard @props.params.board
    @updateDiscussion @props.params.discussion
  
  componentWillReceiveProps: (newProps) ->
    @updateBoard newProps.params.board if newProps.params.board isnt @props.params.board
    @updateDiscussion newProps.params.discussion if newProps.params.discussion isnt @props.params.discussion

  contextTypes:
    router: React.PropTypes.object.isRequired

  crumbCatch: (e) ->
    if e.message.indexOf('not allowed to show') isnt -1
      @context.router.replace '/talk/not-found'

  boardLink: (board) ->
    <Link to="#{@rootTalkPath()}/#{board.id}">
      {board.title}
    </Link>

  rootTalkPath: ->
    if @props.project
      [owner, name] = @props.project.slug.split('/')
      "/projects/#{owner}/#{name}/talk"
    else
      "/talk"
  
  updateBoard: (boardId) ->
    if boardId?
      talkClient
        .type 'boards'
        .get boardId
        .then (board) =>
          @setState {board}
        .catch @crumbCatch
    else
      @setState board: null

  updateDiscussion: (discussionId) ->
    if discussionId?
      talkClient
        .type 'discussions'
        .get discussionId
        .then (discussion) =>
          @setState {discussion}
        .catch @crumbCatch
    else
      @setState discussion: null
      
  render: ->
    onBoard = @state.board?
    onDiscussion = onBoard and @state.discussion?
    onRecents = @props.route.path.match /\/talk\/recents/

    <div className="talk-breadcrumbs">
      <div className="talk-breadcrumbs">
        {if onBoard or onRecents
          <span>
            <Link to={@rootTalkPath()}>
              {if @props.project then @props.project.display_name else 'Zooniverse'} Talk
            </Link>
            {if onBoard
              <span>&nbsp;>&nbsp;</span>}
          </span>}

        {if onBoard
          <span>
            {if onDiscussion
              <span>
                {@boardLink @state.board}
                <span>&nbsp;>&nbsp;{@state.discussion?.title}</span>
              </span>
            else if not onDiscussion and not onRecents
              <span>{@state.board?.title}</span>}
            {if onRecents
              <span>
                {@boardLink @state.board}
                <span>&nbsp;>&nbsp;Recents</span>
              </span>}
          </span>
        else if onRecents
          <span>&nbsp;>&nbsp;Recents</span>}
      </div>
    </div>
