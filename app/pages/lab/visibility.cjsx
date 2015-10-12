React = require 'react'
SetToggle = require '../../lib/set-toggle'

module.exports = React.createClass
  displayName: 'EditProjectVisibility'

  getDefaultProps: ->
    project: null

  getInitialState: ->
    error: null
    setting:
      private: false
      beta_requested: false
      launch_requested: false

  mixins: [SetToggle]

  setterProperty: 'project'

  render: ->
    betaApprovalLabel = null
    launchApprovalLabel = null
    looksDisabled =
      opacity: 0.7
      pointerEvents: 'none'

    <div>
      <p className="form-label">Project state and visibility</p>

      {if @state.error
        <p className="form-help error">{@state.error.toString()}</p>}

      <p>
        <label style={whiteSpace: 'nowrap'}>
          <input type="radio" name="private" value={true} data-json-value={true} checked={@props.project.private} disabled={@state.setting.private} onChange={@set.bind this, 'private', true} />
          Private
        </label>
        &emsp;
        <label style={whiteSpace: 'nowrap'}>
          <input type="radio" name="private" value={false} data-json-value={true} checked={not @props.project.private} disabled={@state.setting.private} onChange={@set.bind this, 'private', false} />
          Public
        </label>
      </p>

      <p className="form-help">Only the assigned <strong>collaborators</strong> can view a private project. Anyone with the URL can access a public project.</p>

      <hr />

      <label style={whiteSpace: 'nowrap'}>
        <input type="radio" name="live" value={true} data-json-value={true} checked={not @props.project.live} disabled={@state.setting.live} onChange={@set.bind this, 'live', false} />
        Development
      </label>
      &emsp;
      <label style={whiteSpace: 'nowrap'}>
        <input type="radio" name="live" value={false} data-json-value={true} checked={@props.project.live} disabled={@state.setting.live} onChange={@set.bind this, 'live', true} />
        Live
      </label>

      <p className="form-help">Workflows can be edited during development, and subjects will never retire. In a live project, workflows are locked and can no longer be edited, and classifications count toward subject retirement.</p>

      <div style={looksDisabled if @props.project.private or not @props.project.live}>
        <hr />

        <p>
          <button type="button" className="standard-button" disabled={@props.project.private or not @props.project.live or @state.setting.beta_requested or @props.project.beta_requested or @props.project.beta_approved} onClick={@set.bind this, 'beta_requested', true}>Apply for review</button>{' '}
          {if @props.project.private
            <span>Only <strong>public projects</strong> can apply for review.</span>
          else if not @props.project.live
            <span>Only <strong>live projects</strong> can apply for review.</span>
          else if @props.project.beta_requested
            <span>Review status has been applied for. <button type="button" disabled={@state.setting.beta_requested} onClick={@set.bind this, 'beta_requested', false}>Cancel application</button></span>}
        </p>

        {
          unless @props.project.beta_approved
            <p className="form-help">Pending approval, expose this project to users who have opted in to help test new projects.</p>
        }

        {
          if @props.project.beta_approved
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

        }

        <div style={looksDisabled unless @props.project.beta_approved}>
          <hr />

          <p>
            <button type="button" className="standard-button" disabled={not @props.project.beta_approved or @state.setting.launch_requested or @props.project.launch_requested} onClick={@set.bind this, 'launch_requested', true}>Apply for full launch</button>{' '}

            {
              unless @props.project.beta_approved
                <span>Only <strong>projects in review</strong> can apply for a full launch.</span>
            }

            {
              if @props.project.launch_approved
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
                </span>
            }
          </p>

          {
            unless @props.project.launch_approved
              <p className="form-help">Pending approval, expose this project to the entire Zooniverse through the main projects listing.</p>
          }



        </div>
      </div>
    </div>
