React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
{Link, IndexLink} = require 'react-router'
PromiseRenderer = require '../../components/promise-renderer'
LoadingIndicator = require('../../components/loading-indicator').default
{ Helmet } = require 'react-helmet'
apiClient = require 'panoptes-client/lib/api-client'
counterpart = require 'counterpart'
ChangeListener = require '../../components/change-listener'
workflowActions = require './actions/workflow'
isAdmin = require '../../lib/is-admin'
`import LabStatus from '../../partials/lab-status.jsx';`

DEFAULT_SUBJECT_SET_NAME = 'Untitled subject set'
DELETE_CONFIRMATION_PHRASE = 'I AM DELETING THIS PROJECT'

counterpart.registerTranslations 'en',
  projectLab:
    edit: 'Edit'

EditProjectPage = createReactClass
  displayName: 'EditProjectPage'

  contextTypes:
    router: PropTypes.object.isRequired

  getDefaultProps: ->
    project: id: '2'
    workflowActions: workflowActions

  getInitialState: ->
    deletionError: null
    deletionInProgress: false

  labPath: (postFix = '') ->
    "/lab/#{@props.project.id}#{postFix}"

  render: ->
    linkParams =
      projectID: @props.project.id

    <div className="columns-container content-container">
      <Helmet title="#{counterpart 'projectLab.edit'} » #{@props.project.display_name}" />
      <div>
        <ul className="nav-list">
          <li><div className="nav-list-header">Project #{@props.project.id}</div></li>
          <li>
            <Link to={"/projects/#{@props.project.slug}"} className="standard-button view-project-button" target="_blank" title="Open the current project in a new tab.">View project</Link>
          </li>
          <li><IndexLink to={@labPath()} activeClassName='active' className="nav-list-item" title="Input the basic information about your project, and set up its home page.">
            Project details
          </IndexLink></li>
          <li><Link to={@labPath('/about')} activeClassName='active' className="nav-list-item" title="Enter content for Research, Results, FAQ and Education.">
            About
          </Link></li>
          <li><Link to={@labPath('/collaborators')} activeClassName='active' className="nav-list-item" title="Add people to your team and specify what their roles are so that they have the right access to the tools they need (including access to the project while it’s private).">
            Collaborators
          </Link></li>
          <li><Link to={@labPath('/guide')} activeClassName='active' className="nav-list-item" title="Create a persistent guide that can be viewed within your project">
            Field guide
          </Link></li>
          <li><Link to={@labPath('/tutorial')} activeClassName='active' className="nav-list-item" title="Create a pop-up tutorial for your project’s classification interface">
            Tutorial
          </Link></li>
          {if 'mini-course' in (@props.project.experimental_tools ? [])
            <li><Link to={@labPath('/mini-course')} activeClassName='active' className="nav-list-item" title="Create a pop-up mini-course for your project’s classification interface">
              Mini-course
            </Link></li>}
          <li><Link to={@labPath('/media')} activeClassName='active' className="nav-list-item" title="Add any images you’d like to use in this project’s introduction, science case, results, FAQ, or education content pages.">
            Media
          </Link></li>
          <li><Link to={@labPath('/visibility')} activeClassName='active' className="nav-list-item" title="Decide whether your project is public and whether it's ready to go live.">
            Visibility
          </Link></li>
          <li><Link to={@labPath('/talk')} activeClassName='active' className="nav-list-item" title="Setup project specific discussion boards">
            Talk
          </Link></li>
          <li><Link to={@labPath('/data-exports')} activeClassName='active' className="nav-list-item" title="Get your project's data exports">
            Data Exports
          </Link></li>
          <li><Link to={@labPath('/workflows')} activeClassName='active' className="nav-list-item" title="View your project's workflows">
            Workflows
          </Link></li>
          <li><Link to={@labPath('/subject-sets')} activeClassName='active' className="nav-list-item" title="View your project's subject sets">
            Subject Sets
          </Link></li>
          {if (@props.project.experimental_tools?.indexOf('translator-role') > -1) or isAdmin()
            <li>
              <Link to={@labPath('/translations')} activeClassName='active' className="nav-list-item" title="Preview your project's translations">
                Translations
                </Link>
            </li>
          }

          <li>
            <br />
            <div className="nav-list-header">Need some help?</div>
            <ul className="nav-list">
              <li>
                <a className="nav-list-item" href="https://help.zooniverse.org" target="_blank" ref="noopener nofollow">Read a tutorial</a>
              </li>
              <li>
                <Link to="/talk/18" className="nav-list-item">Ask for help on talk</Link>
              </li>
              <li>
                <a href="https://help.zooniverse.org/getting-started/glossary" target="_blank" ref="noopener nofollow" className="nav-list-item">Glossary</a>
              </li>
            </ul>
          </li>
        </ul>

        <br />
        <div className="nav-list-header">Other actions</div>
        <small><button type="button" className="minor-button" disabled={@state.deletionInProgress} onClick={@deleteProject}>Delete this project <LoadingIndicator off={not @state.deletionInProgress} /></button></small>{' '}
        {if @state.deletionError?
          <div className="form-help error">{@state.deletionError.message}</div>}
      </div>

      <hr />

      <div className="column">
        <LabStatus />
        <ChangeListener target={@props.project} handler={=>
          propsWithoutChildren = Object.assign {}, @props
          delete propsWithoutChildren.children
          React.cloneElement(@props.children, propsWithoutChildren)
        } />
      </div>
    </div>

  deleteProject: ->
    @setState deletionError: null

    confirmed = prompt("""
      You are about to delete this project and all its data!
      Enter #{DELETE_CONFIRMATION_PHRASE} to confirm.
    """) is DELETE_CONFIRMATION_PHRASE

    if confirmed
      @setState deletionInProgress: true

      this.props.project.delete()
        .then =>
          @context.router.push '/lab'
        .catch (error) =>
          @setState deletionError: error
        .then =>
          if @isMounted()
            @setState deletionInProgress: false

module.exports = createReactClass
  displayName: 'EditProjectPageWrapper'

  contextTypes:
    router: PropTypes.object.isRequired

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.user
      @context.router.push '/lab'

  getDefaultProps: ->
    params:
      projectID: '0'

  render: ->
    if @props.user?
      getProject = apiClient.type('projects').get @props.params.projectID

      getOwners = getProject.then (project) =>
        project.get('project_roles', user_id: @props.user.id).then (projectRoles) =>
          owners = for projectRole in projectRoles when 'owner' in projectRole.roles or 'collaborator' in projectRole.roles
            projectRole.get 'owner'
          Promise.all owners

      getProjectAndOwners = Promise.all [getProject, getOwners]

      <PromiseRenderer promise={getProjectAndOwners} pending={=>
        <div className="content-container">
          <p className="form-help">Loading project</p>
        </div>
      } then={([project, owners]) =>
        if @props.user in owners or isAdmin()
          <EditProjectPage {...@props} project={project} />
        else
          <div className="content-container">
            <p>You don’t have permission to edit this project.</p>
          </div>
      } catch={(error) =>
        <div className="content-container">
          <p className="form-help error">{error.toString()}</p>
        </div>
      } />
    else
      <div className="content-container">
        <p>You need to be signed in to use the lab.</p>
      </div>
