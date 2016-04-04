React = require 'react'
TriggeredModalForm = require 'modal-form/triggered'
Dialog = require 'modal-form/dialog'
AutoSave = require '../../../components/auto-save'
handleInputChange = require '../../../lib/handle-input-change'
NextTaskSelector = require '../next-task-selector'
{MarkdownEditor} = require 'markdownz'
MarkdownHelp = require '../../../partials/markdown-help'

DropdownList = require './dropdown-list'
DropdownDialog = require './dropdown-dialog'

module?.exports = React.createClass
  displayName: 'DropdownEditor'

  getDefaultProps: ->
    workflow: {}
    task: {}

  getInitialState: ->
    editing: null

  updateTasks: ->
    @props.workflow.update('tasks')
    @props.workflow.save()

  getRelated: (select, related = []) ->
    relatedSelects = @props.task.selects.filter (relatedSelect) =>
      relatedSelect.condition is select.id
    for select in relatedSelects
      related.push select
      @getRelated(select, related)
    related

  createDropdown: ->
    conditionIndex = parseInt(@refs.condition.value, 10)
    selects = @props.task.selects
    selects.splice((conditionIndex + 1), 0,
      {
        id: Math.random().toString(16).split('.')[1]
        title: 'new dropdown title',
        condition: @props.task.selects[conditionIndex].id
        options: {},
        required: true,
        allowCreate: true
      })
    @editDropdown(conditionIndex + 1)

  onReorder: (newSelects) ->
    @props.task.selects = newSelects
    @updateTasks()

  editDropdown: (index) ->
    @setState editing: index

  handleDeletedValues: (deletedValues) ->
    for select in @props.task.selects
      deleteKeys = []
      optionsKeys = Object.keys(select.options)
      for optionsKey in optionsKeys
        arrayOfValues = optionsKey.split(";")
        for value in deletedValues
          if arrayOfValues.indexOf(value) isnt -1
            deleteKeys.push optionsKey
      for deleteKey in deleteKeys
        delete select.options[deleteKey]

  handleSave: (newData) ->
    # needs REVIEW...

    {editSelect, deletedValues} = newData

    @props.task.selects[@state.editing] = editSelect

    if deletedValues.length
      @handleDeletedValues(deletedValues)

    @editDropdown(null)
    @updateTasks()

  deleteDropdown: (index) ->
    select = @props.task.selects[index]
    related = @getRelated(select)
    related.push select
    filteredSelects = @props.task.selects.filter (filteredSelect) =>
      related.indexOf(filteredSelect) is -1

    @props.task.selects = filteredSelects
    @updateTasks()

  render: ->
    handleChange = handleInputChange.bind @props.workflow

    {selects} = @props.task

    <div className="dropdown-editor">
      <div className="dropdown">

        <section>
          <div>
            <AutoSave resource={@props.workflow}>
              <span className="form-label">Main text</span>
              <br />
              <textarea name="#{@props.taskPrefix}.instruction" value={@props.task.instruction} className="standard-input full" onChange={handleChange} />
            </AutoSave>
            <small className="form-help">Describe the task, or ask the question, in a way that is clear to a non-expert. You can use markdown to format this text.</small><br />
          </div>
          <br/>
          <div>
            <AutoSave resource={@props.workflow}>
              <span className="form-label">Help text</span>
              <br />
              <MarkdownEditor name="#{@props.taskPrefix}.help" onHelp={-> alert <MarkdownHelp/>} value={@props.task.help ? ""} rows="4" className="full" onChange={handleChange} />
            </AutoSave>
            <small className="form-help">Add text and images for a help window.</small>
          </div>
          <hr/>
        </section>

        <section>
          <h2 className="form-label">Dropdowns</h2>
          <DropdownList
            selects={selects}
            onReorder={@onReorder}
            editDropdown={@editDropdown}
            deleteDropdown={@deleteDropdown}
          />
          <p>
            <button type="button" className="minor-button" onClick={@createDropdown}><i className="fa fa-plus"/> Add a Dropdown</button>
            <label>
              <span> Dependent On </span><select key={@state.editing} ref="condition" defaultValue="#{selects.length - 1}">
                {selects.map (select, i) ->
                    <option key={select.id} value={i}>{select.title}</option>}
              </select>
            </label>
            <br />

          </p>
        </section>

        {if @state.editing?
          select = selects[@state.editing]
          <Dialog required>
            <DropdownDialog
              selects={selects}
              initialSelect={select}
              related={@getRelated(select)}
              onSave={@handleSave}
              onCancel={@editDropdown.bind this, null}
            />
          </Dialog>}

        <hr/>
      </div>

      <AutoSave resource={@props.workflow}>
        <span className="form-label">Next task</span>
        <br />
        <NextTaskSelector workflow={@props.workflow} name="#{@props.taskPrefix}.next" value={@props.task.next ? ''} onChange={handleInputChange.bind @props.workflow} />
      </AutoSave>

    </div>
