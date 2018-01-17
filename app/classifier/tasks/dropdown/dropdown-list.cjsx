React = require 'react'
createReactClass = require 'create-react-class'
DragReorderable = require 'drag-reorderable'

DropdownList = createReactClass

  getDefaultProps: ->
    selects: []
    onReorder: ->
    editDropdown: ->
    deleteDropdown: ->

  edit: (index) ->
    @props.editDropdown(index)

  delete: (index) ->
    if window.confirm('Are you sure that you would like to delete this dropdown AND all dropdowns conditional to it?')
      @props.deleteDropdown(index)

  getDependent: (select) ->
    if not select.condition?
      return ""
    condition = @props.selects.filter (dropdown) =>
      dropdown.id is select.condition
    conditionTitle = condition[0].title
    return "(dep. on #{conditionTitle})"

  renderDropdown: (select, i) ->
    <li key={select.id} className="dropdown-task-list-item-container">
      <span className="dropdown-task-list-item-title">{select.title}</span><span className="dropdown-task-list-item-dependency">{@getDependent(select)}</span>
      <button type="button" className="dropdown-task-list-item-edit-button" onClick={@edit.bind(@, i)}>
        <i className="fa fa-pencil fa-fw"></i>
      </button>
      {if i isnt 0
        <button type="button" className="dropdown-task-list-item-reset-button" onClick={@delete.bind(@, i)}>
        <i className="fa fa-trash-o fa-fw"></i>
        </button>}
    </li>

  render: ->
    <DragReorderable tag="ul" className="dropdown-task-list" items={@props.selects} render={@renderDropdown} onChange={@props.onReorder}/>

module.exports = DropdownList
