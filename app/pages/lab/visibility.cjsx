React = require 'react'
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
    router: React.PropTypes.object.isRequired

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

      <hr/>

      <p className="form-label" ref={ (node) => @workflowList = node }>Workflow Settings</p>
      {if @state.loadingWorkflows is true
        <div className="workflow-status-list">Loading workflows...</div>
      else if @state.workflows.length is 0
        <div className="workflow-status-list">No workflows found</div>
      else
        <div className="workflow-status-list">
          <table>
            <thead>
              <tr>
                <th>
                  ID
                </th>
                <th>
                  Name
                </th>
                <th>
                  Status
                </th>
                <th>
                  Completeness statistic
                </th>
                <th>
                  Statistic visibility
                </th>
              </tr>
            </thead>
            <tbody>
            {@state.workflows.map (workflow) =>
              setting = workflow.active
              stats_completeness_type = workflow.configuration.stats_completeness_type ? 'retirement'
              statsVisible = workflow.active
              if workflow.configuration.stats_hidden != undefined
                statsVisible = !workflow.configuration.stats_hidden
              <tr key={workflow.id}>
                <td>
                  {workflow.id}
                  &emsp;
                </td>
                <td>
                  {workflow.display_name}
                  &emsp;
                </td>
                <td>
                  <label style={whiteSpace: 'nowrap'}>
                    <input type="checkbox" name="active" value={setting} checked={setting} onChange={@handleWorkflowSettingChange.bind(this, workflow)} />
                    Active
                  </label>
                  &emsp;
                </td>
                <td>
                  <label style={whiteSpace: 'nowrap'}>
                    <input
                      type="radio"
                      name="stats_completeness_type.#{workflow.id}"
                      value="classification"
                      checked={stats_completeness_type == 'classification'}
                      onChange={@handleSetStatsCompletenessType.bind(this, workflow)}
                    />
                    Classification Count
                  </label>
                  &emsp;
                  <label style={whiteSpace: 'nowrap'}>
                    <input
                      type="radio"
                      name="stats_completeness_type.#{workflow.id}"
                      value="retirement"
                      checked={stats_completeness_type == 'retirement'}
                      onChange={@handleSetStatsCompletenessType.bind(this, workflow)}
                    />
                    Retirement Count
                  </label>
                  &emsp;
                </td>
                <td>
                  <label style={whiteSpace: 'nowrap'}>
                    <input
                      type="checkbox"
                      name="stats_hidden.#{workflow.id}"
                      value={statsVisible}
                      checked={statsVisible}
                      onChange={@handleWorkflowStatsVisibility.bind(this, workflow)}
                    />
                    Show on Stats Page
                  </label>
                  &emsp;
                </td>
              </tr>}
            </tbody>
          </table>
        </div>}

      {if @state.workflows.length > 0
        meta = @state.workflows[0].getMeta()

        <Paginator
          page={meta.page}
          pageCount={meta.page_count}
          onPageChange={@onPageChange}
        />}

      <hr />

      <p className="form-label">Status</p>
      <p className="form-help">In a live project active workflows are available to volunteers and cannot be edited. Inactive workflows can be edited if a project is live or in development.</p>
      <p className="form-help">If an active workflow is the default workflow for the project and is made inactive, then it will be removed as the default workflow.</p>
      <p className="form-label">Completeness statistic</p>
      <p className="form-help">Use this option to change how each workflow's completeness is calculated on the public statistics page.</p>
      <p className="form-help">
        When using "Classification Count" the completeness will increase after each classification. The
        {' '}total number of classifications needed to complete the workflow is estimated assuming a constant retirement limit.
        {' '}If the retirement limit is changed and/or subjects sets are unlinked from a <b>live</b> workflow this estimate will be inaccurate.
        {' '}To avoid these issues completed subject sets should not be removed, instead completed workflows should be deactivated
        {' '}and new ones created for new subject sets (note: workflows can be copied using the <i className="fa fa-copy"/> button at the top of a workflow's edit page).
      </p>
      <p className="form-help">
        When using "Retirement Count" the completeness will increase after each image retires (note: this value is re-calculated once an hour).
        {' '}Since the images are shown to users in a random order, this completeness estimate will be slow to increase until the project is close to being finished.
        {' '}If your project does not have a constant retirement limit (e.g. it uses a custom retiment rule) and/or subject sets
        {' '}have been unlinked from a live workflow, this estimate will be the most accurate.
      </p>
      <p className="form-label">Statistics Visbiility</p>
      <p className="form-help">
        Active workflows are visible on the project's statistics page by default, and inactive projects are hidden by default. If there is a reason to hide an active workflow from the statistics page, such as a workflow being used in an a/b split experiment, or a reason to show an inactive workflow, then toggle the "Show on Stats Page" checkbox.
      </p>
    </div>
