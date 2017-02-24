React = require 'react'
WorkflowToggle = require '../../components/workflow-toggle'
SetToggle = require '../../lib/set-toggle'
Dialog = require 'modal-form/dialog'
getWorkflowsInOrder = require '../../lib/get-workflows-in-order'

module.exports = React.createClass
  displayName: 'EditProjectVisibility'

  getDefaultProps: ->
    project: null

  getInitialState: -> {
    error: null,
    setting: {
      private: false,
      beta_requested: false,
      launch_requested: false,
    },
    workflows: null 
  }

  mixins: [SetToggle]

  setterProperty: 'project'

  componentDidMount: ->
    getWorkflowsInOrder(@props.project, fields: 'display_name,active,configuration')
      .then((workflows) =>
        @setState({ workflows })
      )

  isReviewable: ->
    not @props.project.private and
    @props.project.live and not
    @state.setting.beta_requested and not
    @props.project.beta_requested and not
    @props.project.beta_approved and
    @props.project.subject_count >= 100

  canApplyForReview: ->
    @isReviewable() and
    @state.labPolicyReviewed and
    @state.bestPracticesReviewed and
    @state.feedbackReviewed

  setRadio: (property, value) ->
    @set property, value
    unless @isReviewable()
      @setState
        labPolicyReviewed: false
        bestPracticesReviewed: false
        feedbackReviewed: false

  toggleCheckbox: (checkbox) ->
    change = { }
    change[checkbox] = @refs?[checkbox]?.checked
    @setState change

  showFeedbackForm: ->
    Dialog.alert(
      <div>
        <h3>Review Feedback</h3>
        <p>During review, a feedback form will be provided to volunteers that will help you improve your project.</p>
        <p>A <a href="https://docs.google.com/a/zooniverse.org/forms/d/1o7yTqpytWWhSOqQhJYiKaeHIaax7xYVUyTOaG3V0xA4/viewform" target="_blank">sample of the form</a> is provided for your consideration.</p>
      </div>,
      closeButton: true
    )

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
    checked = e.target.checked

    workflow.update({ 'configuration.stats_hidden': checked }).save()
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

      <div style={looksDisabled if @props.project.private or not @props.project.live}>
        <hr />

        <div>
          {if @isReviewable()
            <fieldset className="lab-visibility__policy-reviews">
              <label>
                <input type="checkbox" ref="labPolicyReviewed" onChange={@toggleCheckbox.bind this, 'labPolicyReviewed'} />
                I have reviewed the <a href="/lab-policies" target="_blank">policies</a>
              </label>

              <br />

              <label>
                <input type="checkbox" ref="bestPracticesReviewed" onChange={@toggleCheckbox.bind this, 'bestPracticesReviewed'} />
                I have reviewed the <a href="/lab-best-practices" target="_blank">best practices</a>
              </label>

              <br />

              <label>
                <input type="checkbox" ref="feedbackReviewed" onChange={@toggleCheckbox.bind this, 'feedbackReviewed'} />
                I have reviewed the <button className="link-button" onClick={@showFeedbackForm}>review feedback form</button>
              </label>
            </fieldset>}

          <p>
            <button
              type="button"
              className="standard-button"
              disabled={not @canApplyForReview()}
              onClick={@set.bind this, 'beta_requested', true}
            >Apply for review</button>{' '}

            {if @props.project.private
              <span>Only <strong>public projects</strong> can apply for review.</span>
            else if not @props.project.live
              <span>Only <strong>live projects</strong> can apply for review.</span>
            else if @props.project.beta_requested
              <span>Review status has been applied for. <button type="button" disabled={@state.setting.beta_requested} onClick={@set.bind this, 'beta_requested', false}>Cancel application</button></span>}
          </p>
        </div>

        {unless @props.project.beta_approved
          <p className="form-help">Pending approval, expose this project to users who have opted in to help test new projects.</p>}

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
          </div>}

        <div style={looksDisabled unless @props.project.beta_approved}>
          <hr />

          <p>
            <button type="button" className="standard-button" disabled={not @props.project.beta_approved or @state.setting.launch_requested or @props.project.launch_requested} onClick={@set.bind this, 'launch_requested', true}>Apply for full launch</button>{' '}

            {unless @props.project.beta_approved
              <span>Only <strong>projects in review</strong> can apply for a full launch.</span>}

            {if @props.project.launch_approved
              <span>
              <div className="approval-status">
                <span>Launch Approval Status: </span>
                <span className="color-label green">Approved</span>
              </div>
                This project is available to the whole Zooniverse!
              </span>
            else if @props.project.launch_requested
              <span>
                <div className="approval-status">
                  <span>Launch Approval Status: </span>
                  <span className="color-label orange">Pending</span>
                </div>
                Launch is awaiting Zooniverse approval. <button type="button" disabled={@state.setting.launch_requested} onClick={@set.bind this, 'launch_requested', false}>Cancel application</button>
              </span>}
          </p>

          {unless @props.project.launch_approved
            <p className="form-help">Pending approval, expose this project to the entire Zooniverse through the main projects listing.</p>}

        </div>
      </div>

      <hr/>

      <p className="form-label">Workflow Settings</p>
      {if @state.workflows is null
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
                      value={workflow.configuration.stats_hidden}
                      checked={workflow.configuration.stats_hidden}
                      onChange={@handleWorkflowStatsVisibility.bind(this, workflow)}
                    />
                    Hide on Stats Page
                  </label>
                  &emsp;
                </td>
              </tr>}
            </tbody>
          </table>
        </div>}
      <p className="form-label">Status</p>
      <p className="form-help">In a live project active workflows are available to volunteers and cannot be edited. Inactive workflows can be edited if a project is live or in development.</p>
      <p className="form-help">If an active workflow is the default workflow for the project and is made inactive, then it will be removed as the default workflow.</p>
      <p className="form-help">On a live project, if you want to switch which subjects sets are associated with an active workflow: set the workflow to inactive, next change which subject sets are linked in the Workflow Section within the Project Builder, then return the workflow to active.</p>
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
        Active workflows are visible on the project's statistics page by default. If there is a reason to hide an active workflow from the statistics page, such as a workflow being used in an a/b split experiment, then toggle the "Hide on Stats Page" checkbox.
      </p>
    </div>
