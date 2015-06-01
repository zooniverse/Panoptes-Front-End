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
      <p>Visibility</p>

      {if @state.error
        <p className="form-help error">{@state.error.toString()}</p>}

      <table className="standard-table">
        <tbody>
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
            <td className="form-help">Only users with assigned <strong>roles</strong> can view a private project.</td>
          </tr>

          <tr>
            <td>
              <button type="button" className="standard-button" disabled={@state.setting.beta or @props.project.beta} onClick={@set.bind this, 'beta', true}>Apply for beta</button>
            </td>
            <td className="form-help">
              <div>Expose this project to beta testers, pending approval.</div>
              {if @props.project.beta_approved
                <div>Beta status for this project has been approved.</div>
              else if @props.project.beta
                <div>Beta status has been applied for. <button type="button" disabled={@state.setting.beta} onClick={@set.bind this, 'beta', false}>Cancel application</button></div>}
            </td>
          </tr>

          <tr>
            <td>
              <button type="button" className="standard-button" disabled={@state.setting.launch or @props.project.launch} onClick={@set.bind this, 'launch', true}>Apply for full launch</button>
            </td>
            <td className="form-help">
              <div>Expose this project to the entire Zooniverse, pending approval.</div>
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
