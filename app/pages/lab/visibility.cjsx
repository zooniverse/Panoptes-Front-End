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
    <div>
      <p className="form-label">Project state and visibility</p>

      {if @state.error
        <p className="form-help error">{@state.error.toString()}</p>}

      <table className="standard-table">
        <tbody>
          <tr>
            <td style={whiteSpace: 'nowrap'}>
              <label>
                <input type="checkbox" name="live" value={true} data-json-value={true} checked={@props.project.live} disabled={@state.setting.live} onChange={(e) => @set 'live', e.target.checked} />
                Live
              </label>
            </td>
            <td className="form-help">No workflow changes can be made a "live" project. Check this when you’ve finished development or want to apply for a beta test.</td>
          </tr>

          <tr>
            <td style={whiteSpace: 'nowrap'}>
              <label>
                <input type="radio" name="private" value={true} data-json-value={true} checked={@props.project.private} disabled={@state.setting.private} onChange={@set.bind this, 'private', true} />
                Private
              </label>
              &emsp;
              <label>
                <input type="radio" name="private" value={false} data-json-value={true} checked={not @props.project.private} disabled={@state.setting.private} onChange={@set.bind this, 'private', false} />
                Public
              </label>
            </td>
            <td className="form-help">Only users with assigned <strong>roles</strong> can view a private project. Anyone with the URL can access a public project.</td>
          </tr>

          <tr>
            <td>
              <button type="button" className="standard-button full" disabled={not @props.project.live or @state.setting.beta or @props.project.beta} onClick={@set.bind this, 'beta', true}>Apply for beta</button>{' '}
            </td>
            <td className="form-help">
              <div>Pending approval, expose this project to users who have opted in to be beta testers.</div>
              {unless @props.project.live
                <div>Only <strong>live projects</strong> can apply for a beta.</div>}
              {if @props.project.beta_approved
                <div>Beta status for this project has been approved.</div>
              else if @props.project.beta
                <div>Beta status has been applied for. <button type="button" disabled={@state.setting.beta} onClick={@set.bind this, 'beta', false}>Cancel application</button></div>}
            </td>
          </tr>

          <tr>
            <td>
              <button type="button" className="standard-button full" disabled={not @props.project.beta_approved or @state.setting.launch or @props.project.launch} onClick={@set.bind this, 'launch', true}>Apply for full launch</button>
            </td>
            <td className="form-help">
              <div>Pending approval, expose this project to the entire Zooniverse through the main projects listing.</div>
              {unless @props.project.beta_approved
                <div>Only <strong>project in beta</strong> can apply for a full launch.</div>}
              {if @props.project.launch_approved
                <div>Beta status for this project has been approved.</div>
              else if @props.project.launch
                <div>Launch is awaiting Zooniverse approval. <button type="button" disabled={@state.setting.launch} onClick={@set.bind this, 'launch', false}>Cancel application</button></div>}
            </td>
          </tr>
        </tbody>
      </table>
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
