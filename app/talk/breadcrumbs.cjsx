React = require 'react'
talkClient = require 'panoptes-client/lib/talk-client'
{Link} = require 'react-router'
PromiseRenderer = require '../components/promise-renderer'
merge = require 'lodash.merge'

module?.exports = React.createClass
  displayName: 'TalkBreadcrumbs'

  crumbCatch: (e) ->
    if e.message.indexOf('not allowed to show') isnt -1
      @history.replaceState(null, "/talk/not-found")

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

  render: ->
    params = @props.params
    onBoard = params.board?
    onDiscussion = onBoard and params.discussion?
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
          <PromiseRenderer promise={talkClient.type('boards').get(params.board)} catch={@crumbCatch}>{(board) =>
            <span>
              {if onDiscussion
                <span>
                  {@boardLink board}
                  <PromiseRenderer promise={talkClient.type('discussions').get(params.discussion)} catch={@crumbCatch}>{(discussion) =>
                    <span>&nbsp;>&nbsp;{discussion.title}</span>}
                  </PromiseRenderer>
                </span>
              else if not onDiscussion and not onRecents
                <span>{board.title}</span>}

              {if onRecents
                <span>
                  {@boardLink board}
                  <span>&nbsp;>&nbsp;Recents</span>
                </span>}
            </span>}
          </PromiseRenderer>
        else if onRecents
          <span>&nbsp;>&nbsp;Recents</span>}
      </div>
    </div>
