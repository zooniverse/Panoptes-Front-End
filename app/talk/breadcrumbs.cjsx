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

  render: ->
    params = @props.params

    <div className="talk-breadcrumbs">
      <div className="talk-breadcrumbs">
        {if params.board?
          <span>
            <Link to="#{@projectPrefix()}talk" params={params}>
              {if @props.project then @props.project.display_name else 'Zooniverse'} Talk
            </Link>
            &nbsp;>&nbsp;
          </span>}

        {if params.board? and not params.discussion?
          <PromiseRenderer promise={talkClient.type('boards').get(params.board)} catch={@crumbCatch}>{(board) =>
            <span>{board.title}</span>}
          </PromiseRenderer>}

        {if params.board? and params.discussion?
          <PromiseRenderer promise={talkClient.type('boards').get(params.board)} catch={@crumbCatch}>{(board) =>
            <span>
              <Link to="#{@projectPrefix()}talk-board" params={merge({}, {board: board.id}, params)}>{board.title}</Link>
              &nbsp;>&nbsp;
              <PromiseRenderer promise={talkClient.type('discussions').get(params.discussion)} catch={@crumbCatch}>{(discussion) =>
                <span>{discussion.title}</span>}
              </PromiseRenderer>
            </span>}
          </PromiseRenderer>}
      </div>
    </div>
