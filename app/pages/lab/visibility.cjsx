React = require 'react'

module.exports = React.createClass
  displayName: 'EditProjectVisibility'

  getDefaultProps: ->
    project: null

  getInitialState: ->
    error: null
    setting:
      private: false
      beta: false
      launch: false

  render: ->
    looksDisabled =
      opacity: 0.6
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
          <button type="button" className="standard-button" disabled={@props.project.private or not @props.project.live or @state.setting.beta or @props.project.beta} onClick={@set.bind this, 'beta', true}>Apply for beta</button>{' '}
          {if @props.project.private
            <span>Only <strong>public projects</strong> can apply for a beta.</span>
          else if not @props.project.live
            <span>Only <strong>live projects</strong> can apply for a beta.</span>
          else if @props.project.beta
            <span>Beta status has been applied for. <button type="button" disabled={@state.setting.beta} onClick={@set.bind this, 'beta', false}>Cancel application</button></span>}
        </p>

        <p className="form-help">Pending approval, expose this project to users who have opted in to help test new projects.</p>

        {if @props.project.beta_approved
          <p>
            Beta status for this project has been approved. To end the beta test and make changes, switch back to <em>development</em> mode.
            {unless @props.project.launch or @props.project.launch_approved
              <span>If you’re ready to launch this project, see the next section.</span>}
          </p>}

        <div style={looksDisabled unless @props.project.beta_approved}>
          <hr />

          <p>
            <button type="button" className="standard-button" disabled={not @props.project.beta_approved or @state.setting.launch or @props.project.launch} onClick={@set.bind this, 'launch', true}>Apply for full launch</button>{' '}

            {unless @props.project.beta_approved
              <span>Only <strong>projects in beta</strong> can apply for a full launch.</span>}
            {if @props.project.launch_approved
              <span>This project is available to the whole Zooniverse!</span>
            else if @props.project.launch
              <span>Launch is awaiting Zooniverse approval. <button type="button" disabled={@state.setting.launch} onClick={@set.bind this, 'launch', false}>Cancel application</button></span>}
          </p>

          <p className="form-help">Pending approval, expose this project to the entire Zooniverse through the main projects listing.</p>
        </div>
      </div>
    </div>

  set: (property, value) ->
    @state.error = null
    @state.setting[property] = true
    @forceUpdate()

    changes = {}
    changes[property] = value

    @props.project.update(changes).save()
      .catch (error) =>
        @setState {error}
      .then =>
        @state.setting[property] = false
        @forceUpdate()
