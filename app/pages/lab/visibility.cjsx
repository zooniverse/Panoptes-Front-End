React = require 'react'
PropTypes = require 'prop-types'
{Link} = require 'react-router'
createReactClass = require 'create-react-class'
apiClient = require 'panoptes-client/lib/api-client'
SetToggle = require '../../lib/set-toggle'
uniq = require 'lodash/uniq'
Paginator = require '../../talk/lib/paginator'

ApplyForBetaForm = require('./apply-for-beta').default

module.exports = createReactClass
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

  setRadio: (property, value) ->
    @set property, value

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

      <p className="form-help">
        All workflows can be edited during development, and subjects will never retire.<br />
        In a live project, active workflows are locked and can no longer be edited.<br />
        <small>
          <strong>
            Take care changing a project to development as classifications will not count towards your project.
          </strong>
        </small>
      </p>

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
                <span>If you’re ready to launch this project, please email <a href="mailto:contact@zooniverse.org">contact@zooniverse.org</a> to submit your request.</span>}
            </p>
          </span>
        else if @props.project.beta_requested
          <div className="approval-status">
            <span>Beta Approval Status: </span>
            <span className="color-label orange">Pending</span>
          </div>
          <span>Review status has been applied for. <button type="button" disabled={@state.setting.beta_requested} onClick={@set.bind this, 'beta_requested', false}>Cancel application</button></span>
        else
          <ApplyForBetaForm project={@props.project} applyFn={@set.bind this, 'beta_requested', true} />
        }

      </div>
  
    </div>
