React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
BoardPreview = require './board-preview'
apiClient = require 'panoptes-client/lib/api-client'
talkClient = require 'panoptes-client/lib/talk-client'
HandlePropChanges = require '../lib/handle-prop-changes'
Moderation = require './lib/moderation'
ProjectLinker = require './lib/project-linker'
{Link} = require 'react-router'
CreateSubjectDefaultButton = require './lib/create-subject-default-button'
CreateBoardForm = require './lib/create-board-form'
Loading = require('../components/loading-indicator').default 
SingleSubmitButton = require '../components/single-submit-button'
ZooniverseTeam = require './lib/zoo-team.cjsx'
alert = require('../lib/alert').default
AddZooTeamForm = require './add-zoo-team-form'
DragReorderable = require 'drag-reorderable'
Paginator = require './lib/paginator'

`import ActiveUsers from './active-users';`
`import PopularTags from './popular-tags';`

module.exports = createReactClass
  displayName: 'TalkInit'
  mixins: [HandlePropChanges]

  propTypes:
    section: PropTypes.string # 'zooniverse' for main-talk, 'project_id' for projects

  contextTypes:
    geordi: PropTypes.object

  logTalkClick: (talkItem) ->
    @context.geordi?.logEvent
      type: talkItem

  propChangeHandlers:
    'section': 'setBoards'
    'user': 'setBoards'

  getInitialState: ->
    boards: []
    authors: {}
    author_roles: {}
    boardsMeta: {}
    loading: true
    moderationOpen: false

  getDefaultProps: ->
    location: query: page: 1

  componentWillReceiveProps: (nextProps) ->
    if nextProps.location.query.page isnt @props.location.query.page
      @setBoards({}, nextProps)

  setBoards: (propValue, props = @props) ->
    author_ids = []
    talkClient.type('boards').get(section: props.section, page_size: 20, page: props.location.query.page)
      .then (boards) =>
        boardsMeta = boards[0]?.getMeta()
        @setState {boards, boardsMeta, loading: false}
        boards.map (board) ->
          user_id = board.latest_discussion?.latest_comment.user_id
          author_ids.push user_id if user_id?

        apiClient
          .type 'users'
          .get
            id: author_ids
          .then (users) =>
            users.map (user) =>
              @setState (prevState, props) ->
                prevState.authors[user.id] = user

        talkClient
          .type 'roles'
          .get
            user_id: author_ids
            section: ['zooniverse', @props.section]
            is_shown: true
            page_size: 100
          .then (roles) =>
            roles.map (role) =>
              @setState (prevState, props) ->
                prevState.author_roles[role.user_id] ?= []
                prevState.author_roles[role.user_id].push role

  boardPreview: (data, i) ->
    user_id = data.latest_discussion?.latest_comment.user_id
    roles = @state.author_roles[user_id]
    roles ?= []
    <BoardPreview
      {...@props}
      key={i}
      data={data}
      author={@state.authors[user_id]}
      roles={roles}
    />

  boardOrders: ->
    <DragReorderable
      tag='ul'
      className='talk-reorder-boards'
      items={@state.boards}
      render={@boardOrderItem}
      onChange={@boardOrderChanged}
    />

  boardOrderItem: (board, i) ->
    <li key={board.id}>
      <i className="fa fa-bars bars" />{board.title}
    </li>

  boardOrderChanged: (boards) ->
    @setState boards: boards
    @updateBoardOrder(boards).then =>
      @setBoards()

  updateBoardOrder: (boards) ->
    boardsById = { }
    boardsById[board.id] = board for board in boards

    idsBefore = (board.id for board in @state.boards)
    idsAfter = (board.id for board in boards)

    changes = { }
    changes[id] = i for id, i in idsAfter when id isnt idsBefore[i]

    return Promise.resolve() if changes.length < 1
    Promise.all Object.keys(changes).map (id) =>
      boardsById[id].update(position: changes[id]).save()

  clearBoardOrder: ->
    Promise.all @state.boards.map (board) =>
      board.update(position: 0).save()
    .then =>
      @setState loading: true
      @setBoards()

  render: ->
    <div className="talk-home">
      {if @props.user?
        <div className="talk-moderation">
          <Moderation user={@props.user} section={@props.section}>
            <button onClick={=> @setState moderationOpen: !@state.moderationOpen}>
              <i className="fa fa-#{if @state.moderationOpen then 'close' else 'warning'}" /> Moderator Controls
            </button>
          </Moderation>

          {if @state.moderationOpen
            <div className="talk-moderation-children talk-module">
              <h2>Moderator Zone:</h2>

              {if @props.section isnt 'zooniverse'
                <CreateSubjectDefaultButton
                  section={@props.section}
                  onCreateBoard={=> @setBoards()} />
                }

              <ZooniverseTeam user={@props.user} section={@props.section}>
                <button className="link-style" type="button" onClick={=> alert (resolve) -> <AddZooTeamForm/>}>
                  Invite someone to the Zooniverse team
                </button>
              </ZooniverseTeam>
                {if @props.section isnt 'zooniverse'
                  <Link to="/projects/#{@props.params?.owner}/#{@props.params?.name}/talk/moderations">
                    View Reported Comments
                  </Link>
                else
                  <Link to="/talk/moderations">View Reported Comments</Link>
                  }

              <CreateBoardForm
                section={@props.section}
                user={@props.user}
                onSubmitBoard={=> @setBoards()}/>

              <h3>Reorder Boards:</h3>
              {@boardOrders()}
              <SingleSubmitButton onClick={@clearBoardOrder}>Order by activity</SingleSubmitButton>
            </div>
            }
        </div>
        }

      <div className="talk-list-content">
        <section>
          {if @state.loading
            <Loading />
           else if @state.boards?.length is 0
            <p>There are currently no boards.</p>
           else if @state.boards?.length
             @state.boards.map(@boardPreview)}
        </section>

        <div className="talk-sidebar">
          <section>
            <h3>
              {if @props.section is 'zooniverse'
                <Link className="sidebar-link" onClick={@logTalkClick.bind this, 'recent-comments-sidebar'} to="/talk/recents">Recent Comments</Link>
              else
                <Link className="sidebar-link" onClick={@logTalkClick.bind this, 'recent-comments-sidebar'} to="/projects/#{@props.params.owner}/#{@props.params.name}/talk/recents">Recent Comments</Link>
              }
            </h3>
          </section>

          <section>
            <PopularTags
              header={<h3>Popular Tags:</h3>}
              section={@props.section}
              project={@props.project} />
          </section>

          <section>
            <ActiveUsers section={@props.section} project={@props.project} />
          </section>

          <section>
            <h3>Projects:</h3>
            <div><ProjectLinker user={@props.user} /></div>
          </section>
        </div>
      </div>

      {if +@state.boardsMeta?.page_count > 1
        <Paginator
          page={+@state.boardsMeta?.page}
          pageCount={+@state.boardsMeta?.page_count} />}

    </div>
