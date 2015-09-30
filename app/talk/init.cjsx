React = require 'react'
BoardPreview = require './board-preview'
ActiveUsers = require './active-users'
talkClient = require '../api/talk'
PromiseRenderer = require '../components/promise-renderer'
HandlePropChanges = require '../lib/handle-prop-changes'
Moderation = require './lib/moderation'
ProjectLinker = require './lib/project-linker'
ROLES = require './lib/roles'
{Link} = require '@edpaget/react-router'
CreateSubjectDefaultButton = require './lib/create-subject-default-button'
CreateBoardForm = require './lib/create-board-form'
Loading = require '../components/loading-indicator'
PopularTags = require './popular-tags'
require '../api/sugar'
ZooniverseTeam = require './lib/zoo-team.cjsx'
alert = require '../lib/alert'
AddZooTeamForm = require './add-zoo-team-form'

module?.exports = React.createClass
  displayName: 'TalkInit'
  mixins: [HandlePropChanges]

  propTypes:
    section: React.PropTypes.string # 'zooniverse' for main-talk, 'project_id' for projects

  propChangeHandlers:
    'section': 'setBoards'
    'user': 'setBoards'

  getInitialState: ->
    boards: []
    loading: true
    moderationOpen: false

  componentWillMount: ->
    sugarClient.subscribeTo('zooniverse') if @props.section is 'zooniverse'

  componentWillUnmount: ->
    sugarClient.unsubscribeFrom('zooniverse') if @props.section is 'zooniverse'

  setBoards: (propValue, props = @props) ->
    talkClient.type('boards').get(section: props.section)
      .then (boards) =>
        @setState {boards, loading: false}

  boardPreview: (data, i) ->
    <BoardPreview {...@props} key={i} data={data} />

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

              <Link
                to="#{if @props.section isnt 'zooniverse' then 'project-' else ''}talk-moderations"
                params={
                  if (@props.params?.owner and @props.params?.name)
                    {owner: @props.params.owner, name: @props.params.name}
                  else
                    {}
                }>
                View Reported Comments
              </Link>

              <CreateBoardForm section={@props.section} onSubmitBoard={=> @setBoards()}/>
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
          <h2>Talk Sidebar</h2>

          <ProjectLinker user={@props.user} />

          <section>
            <PopularTags
              header={<h3>Popular Tags:</h3>}
              section={@props.section}
              params={@props.params} />
          </section>

          <section>
            <ActiveUsers section={@props.section} />
          </section>

          <section>
            <h3>
              {if @props.section is 'zooniverse'
                <Link className="sidebar-link" to="talk-recents" {...@props}>Recent Comments</Link>
              else
                <Link className="sidebar-link" to="project-talk-recents" {...@props}>Recent Comments</Link>
              }
            </h3>
          </section>
        </div>
      </div>
    </div>
