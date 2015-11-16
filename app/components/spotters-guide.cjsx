React = require 'react'
{Markdown} = require 'markdownz'

module.exports = React.createClass
  getDefaultProps: ->
    items: []
    defaultSelection: [] # Path by indices of selected content, e.g. `[0, 1]`.

  getInitialState: ->
    selection: @props.defaultSelection

  cutSelection: (index) ->
    @setState selection: @state.selection[...index]

  pushSelection: (index) ->
    @setState selection: [].concat @state.selection, index

  renderBreadcrumbs: (trail) ->
    <ul className="spotters-guide-breadcrumbs">
      {trail.map (item, i) =>
        jumpBack = @cutSelection.bind this, i + 1
        isCurrent = i is trail.length - 1
        <li key={i}>
          <button type="button" className="spotters-guide-breadcrumb" onClick={jumpBack} disabled={isCurrent}>{item.title}</button>
        </li>}
    </ul>

  renderItem: ({content, items}) ->
    <div className="spotters-guide-content">
      {if content?
        <Markdown content={content} />}
      {if items?.length > 0
        <ul className="spotters-guide-menu">
          {items.map (item, i) =>
            goTo = @pushSelection.bind this, i
            <li key={i}>
              <button type="button" className="spotters-guide-menu-item" onClick={goTo}>{item.title}</button>
            </li>}
        </ul>}
    </div>

  render: ->
    {title, content, items} = @props
    implicitRootItem = {title, content, items}

    if implicitRootItem.items?.length is 1
      implicitRootItem = implicitRootItem.items[0]

    selectionTrail = [[], @state.selection...].reduce (trail, index) =>
      items = (trail[trail.length - 1] ? implicitRootItem).items
      [].concat trail, items[index]

    selectedItem = selectionTrail[selectionTrail.length - 1] ? implicitRootItem

    levelUp = @cutSelection.bind this, selectionTrail.length - 1
    atRoot = @state.selection.length is 0

    <div className="spotters-guide">
      <header>
        <button type="button" onClick={levelUp} disabled={atRoot}>◀</button>
        {@renderBreadcrumbs selectionTrail}
      </header>

      {@renderItem selectedItem}
    </div>
