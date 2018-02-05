React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
apiClient = require 'panoptes-client/lib/api-client'
SetToggle = require '../../lib/set-toggle'
getWorkflowsInOrder = require '../../lib/get-workflows-in-order'
uniq = require 'lodash/uniq'
Paginator = require '../../talk/lib/paginator'

`import ApplyForBetaForm from './apply-for-beta-form';`

module.exports = createReactClass
  displayName: 'EditProjectVisibility'

  contextTypes:
    router: PropTypes.object.isRequired

  getDefaultProps: ->
    project: null

  getInitialState: ->
    error: null
    setting:
      private: false
      beta_requested: false
      launch_requested: false
    workflows: []
    loadingWorkflows: false

  mixins: [SetToggle]

  setterProperty: 'project'

  componentDidMount: ->
    page = if @props.location?.query?.page? then @props.location.query.page else 1
    @getWorkflowList page

  onPageChange: (page) ->
    nextQuery = Object.assign {}, @props.location.query, { page }
    @context.router.push
      pathname: @props.location.pathname
      query: nextQuery
    @getWorkflowList page
    .then () =>
      @workflowList?.scrollIntoView()

  getWorkflowList: (page) ->
    @setState { loadingWorkflows: true }
    # TODO remove page_size once getWorkflowsInOrder does not override default page_size
    getWorkflowsInOrder(@props.project, { page: page, page_size: 20, fields: 'active,configuration,display_name' })
      .then (workflows) =>
        @setState
          workflows: workflows
          loadingWorkflows: false

  setRadio: (property, value) ->
    @set property, value

  toggleCheckbox: (checkbox) ->
    change = { }
    change[checkbox] = @refs?[checkbox]?.checked
    @setState change

  handleWorkflowSettingChange: (workflow, e) ->
    checked = e.target.checked

    workflow.update({ 'active': checked }).save()
      .catch((error) =>
        @setState {error}
      ).then((workflow) =>
        if not workflow.active and workflow.id is @props.project.configuration?.default_workflow
          @props.project.update({ 'configuration.default_workflow': null })
          @props.project.save()
      ).then(() => @forceUpdate()) # Dislike. Eventually we should refactor to not have to call this.forceUpdate()

  handleSetStatsCompletenessType: (workflow, e) ->
    workflow.update({ 'configuration.stats_completeness_type': e.target.value }).save()
      .catch((error) =>
        @setState {error}
      ).then(() => @forceUpdate())

  handleWorkflowStatsVisibility: (workflow, e) ->
    hidden = !e.target.checked

    workflow.update({ 'configuration.stats_hidden': hidden }).save()
      .catch((error) =>
        @setState { error }
      ).then(() => @forceUpdate())

  render: ->
    looksDisabled =
      opacity: 0.7
      pointerEvents: 'none'

    <div>
      <p className="form-label">Project state and visibility</p>

      {if @state.error
        <p className="form-help error">{@state.error.toString()}</p>}

      <p>
        <label style={whiteSpace: 'nowrap'}>
          <input type="radio" name="private" value={true} data-json-value={true} checked={@props.project.private} disabled={@state.setting.private} onChange={@setRadio.bind this, 'private', true} />
          Private
        </label>
        &emsp;
        <label style={whiteSpace: 'nowrap'}>
          <input type="radio" name="private" value={false} data-json-value={true} checked={not @props.project.private} disabled={@state.setting.private} onChange={@setRadio.bind this, 'private', false} />
          Public
        </label>
      </p>

      <p className="form-help">Only the assigned <strong>collaborators</strong> can view a private project. Anyone with the URL can access a public project.</p>

      <hr/>

      <label style={whiteSpace: 'nowrap'}>
        <input type="radio" name="live" value={true} data-json-value={true} checked={not @props.project.live} disabled={@state.setting.live} onChange={@setRadio.bind this, 'live', false} />
        Development
      </label>
      &emsp;
      <label style={whiteSpace: 'nowrap'}>
        <input type="radio" name="live" value={false} data-json-value={true} checked={@props.project.live} disabled={@state.setting.live} onChange={@setRadio.bind this, 'live', true} />
        Live
      </label>

      <p className="form-help">All workflows can be edited during development, and subjects will never retire. In a live project, active workflows are locked and can no longer be edited, and classifications count toward subject retirement.</p>

      <div>
        <hr />

        <p className="form-label">Beta status</p>

        {if @props.project.beta_approved
          <span>
            <div className="approval-status">
              <span>Beta Approval Status: </span>
              <span className="color-label green">Approved</span>
            </div>
            <p>
              Review status for this project has been approved. To end the review and make changes, switch back to <em>development</em> mode.
              {unless @props.project.launch_requested or @props.project.launch_approved
                <span>If you’re ready to launch this project, see the next section.</span>}
            </p>
          </span>
        else if @props.project.beta_requested
          <div className="approval-status">
            <span>Beta Approval Status: </span>
            <span className="color-label orange">Pending</span>
          </div>
          <span>Review status has been applied for. <button type="button" disabled={@state.setting.beta_requested} onClick={@set.bind this, 'beta_requested', false}>Cancel application</button></span>
        else
          <ApplyForBetaForm project={@props.project} workflows={@state.workflows} applyFn={@set.bind this, 'beta_requested', true} />
        }

      </div>
    </div>
