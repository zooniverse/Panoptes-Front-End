React = require 'react'
ChangeListener = require '../components/change-listener'
PromiseRenderer = require '../components/promise-renderer'
auth = require '../api/auth'
apiClient = require '../api/client'
InPlaceForm = require '../components/in-place-form'
MarkdownEditor = require '../components/markdown-editor'

ProjectEditor = React.createClass
  displayName: 'ProjectEditor'

  propTypes:
    project: React.PropTypes.object.isRequired # TODO: Expose JSONAPIClient.Resource.

  getInitialState: ->
    saving: false

  render: ->
    <div className="content-container">
      <ChangeListener target={auth} handler={@renderAuthTest} />
    </div>

  renderAuthTest: ->
    <PromiseRenderer promise={auth.checkCurrent()} then={@renderPermissions}>
      <p>Checking permissions...</p>
    </PromiseRenderer>

  renderPermissions: (user) ->
    if user?
      if @props.project.id in user.links.projects
        <ChangeListener target={@props.project} eventName="change" handler={@renderProjectEditor} />
      else
        <p>You don’t have permission to edit this project.</p>
    else
      <p>You’re not signed in.</p>

  renderProjectEditor: (project) ->
    {project} = @props

    <div>
      <InPlaceForm onSubmit={@handleSubmit}>
        <table>
          <tbody>
            <tr>
              <th>id</th>
              <td><code>{JSON.stringify project.id}</code></td>
            </tr>

            <tr>
              <th>created_at</th>
              <td><code>{JSON.stringify project.created_at}</code></td>
            </tr>

            <tr>
              <th>updated_at</th>
              <td><code>{JSON.stringify project.updated_at}</code></td>
            </tr>

            <tr>
              <th>name</th>
              <td><code>{JSON.stringify project.name}</code></td>
            </tr>

            <tr>
              <th>display_name</th>
              <td><input type="text" name="display_name" value={project.display_name} required="required" onChange={@handleInputChange} /></td>
            </tr>

            <tr>
              <th>user_count</th>
              <td><code>{JSON.stringify project.user_count}</code></td>
            </tr>

            <tr>
              <th>classification_count</th>
              <td><code>{JSON.stringify project.classification_count}</code></td>
            </tr>

            <tr>
              <th>activated_state</th>
              <td><code>{JSON.stringify project.activated_state}</code></td>
            </tr>

            <tr>
              <th>primary_language</th>
              <td><code>{JSON.stringify project.primary_language}</code></td>
            </tr>

            <tr>
              <th>visible_to</th>
              <td><code>{JSON.stringify project.visible_to}</code></td>
            </tr>

            <tr>
              <th>title</th>
              <td><code>{JSON.stringify project.title}</code></td>
            </tr>

            <tr>
              <th>description</th>
              <td><MarkdownEditor name="description" value={project.description} onChange={@handleInputChange} /></td>
            </tr>

            <tr>
              <th>introduction</th>
              <td><MarkdownEditor name="introduction" value={project.introduction} onChange={@handleInputChange} /></td>
            </tr>

            <tr>
              <th>science_case</th>
              <td><MarkdownEditor name="science_case" value={project.science_case} onChange={@handleInputChange} /></td>
            </tr>

            <tr>
              <th>team_members</th>
              <td><code>{JSON.stringify project.team_members}</code></td>
            </tr>

            <tr>
              <th>guide</th>
              <td><code>{JSON.stringify project.guide}</code></td>
            </tr>
          </tbody>
        </table>

        <p><button type="submit" disabled={@state.saving}>Save project</button></p>
        <hr />
        <p><small><button type="button" onClick={@handleDelete}>Delete this project</button></small></p>
      </InPlaceForm>
    </div>

  # TODO: Abstract this out somewhere, it'll be used a lot.
  handleInputChange: (e) ->
    valueProperty = switch e.target.type
      when 'radio', 'checkbox' then 'checked'
      when 'file' then 'files'
      else 'value'

    changes = {}
    changes[e.target.name] = e.target[valueProperty]

    @props.project.update changes

  handleSubmit: ->
    @setState saving: true, =>
      @props.project.save().then =>
        @setState saving: false

  handleDelete: ->
    # TODO: Make this nicer.
    confirmation = prompt "To confirm PERMANENT deletion of this project, enter #{@props.project.display_name.replace(/[^A-Z]/gi, '').toUpperCase()} here."
    if confirmation is @props.project.display_name.replace(/[^A-Z]/gi, '').toUpperCase()
      @setState saving: true, =>
        @props.project.delete().then =>
          location.hash = '/build'
    else
      alert "You entered #{confirmation} instead. Project not deleted."

module.exports = React.createClass
  displayName: 'EditProjectPage'

  render: ->
    <PromiseRenderer promise={apiClient.createType('projects').get @props.params.id} then={@renderProjectEditor}>
      <div className="content-container">
        <p>Loading project <code>{@props.params.id}</code>...</p>
      </div>
    </PromiseRenderer>

  renderProjectEditor: (project) ->
    <ProjectEditor project={project} />
