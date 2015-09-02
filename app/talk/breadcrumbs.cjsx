React = require 'react'
{Link, Navigation} = require 'react-router'
PromiseRenderer = require '../components/promise-renderer'
merge = require 'lodash.merge'

module?.exports = React.createClass
  displayName: 'TalkBreadcrumbs'
  mixins: [Navigation]

  projectPrefix: ->
    if @props.project then 'project-' else ''

  crumbCatch: (e) ->
    if e.message.indexOf('not allowed to show') isnt -1
      @replaceWith("talk-not-found")

  boardLink: (board) ->
    <Link to="#{@projectPrefix()}talk-board" params={merge({}, {board: board.id}, @props.params)}>{board.title}</Link>

  render: ->
    params = @props.params
    onBoard = params.board?
    onDiscussion = onBoard and params.discussion?
    onRecents = @props.path.match /\/talk\/recents/

    <div className="talk-breadcrumbs">
      <div className="talk-breadcrumbs">
        {if onBoard or onRecents
          <span>
            <Link to="#{@projectPrefix()}talk" params={params}>
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
