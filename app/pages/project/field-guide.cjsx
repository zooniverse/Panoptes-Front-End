React = require 'react'
createReactClass = require 'create-react-class'
classnames = require 'classnames'
{Markdown} = require 'markdownz'
CroppedImage = require('../../components/cropped-image').default

module.exports = createReactClass
  displayName: 'FieldGuide'

  getDefaultProps: ->
    title: null
    content: null
    items: []
    icons: {}
    defaultSelection: [] # Path by indices of selected content, e.g. `[0, 1]`.
    breadcrumbs: false
    onClickClose: ->

  getInitialState: ->
    selection: @props.defaultSelection

  cutSelection: (index) ->
    @setState selection: @state.selection[...index]

  pushSelection: (index) ->
    @setState selection: [].concat @state.selection, index

  # renderBreadcrumbs: (trail) ->
  #   <ul className="field-guide-breadcrumbs">
  #     {trail.map (item, i) =>
  #       jumpBack = @cutSelection.bind this, i + 1
  #       isCurrent = i is trail.length - 1
  #       <li key={i}>
  #         <button type="button" className="field-guide-breadcrumb" onClick={jumpBack} disabled={isCurrent}>
  #           {item.title}
  #         </button>
  #       </li>}
  #   </ul>

  renderItem: ({icon, title, content, items}) ->
    <div className="field-guide-item">
      <header>
        {if @props.icons[icon]?
          <div className="field-guide-item-icon-container">
            <CroppedImage className="field-guide-item-icon" src={@props.icons[icon].src} aspectRatio={1} width="6em" height="6em" />
          </div>}
        {if title?
          <div className="field-guide-item-title-container">
            <Markdown content={title} inline />
          </div>}
      </header>
      {if content?
        <div className="field-guide-item-content-container">
          <Markdown content={content} />
        </div>}
      {if items?.length > 0
        <ul className="field-guide-menu">
          {items.map (item, i) =>
            goTo = @pushSelection.bind this, i
            <li key={i}>
              <button type="button" className="field-guide-menu-item" onClick={goTo}>
                <CroppedImage className="field-guide-menu-item-icon" src={@props.icons[item.icon]?.src} aspectRatio={1} width="4em" height="4em" />
                <span className="field-guide-menu-item-title">
                  {item.title}
                </span>
              </button>
            </li>}
        </ul>}
    </div>

  render: ->
    {icon, title, content} = @props
    { items } = @props.translation
    implicitRootItem = {icon, title, content, items}

    if implicitRootItem.items?.length is 1
      implicitRootItem = implicitRootItem.items[0]

    selectionTrail = [[], @state.selection...].reduce (trail, index) =>
      items = (trail[trail.length - 1] ? implicitRootItem).items
      [].concat trail, items[index]

    selectedItem = selectionTrail[selectionTrail.length - 1] ? implicitRootItem

    levelUp = @cutSelection.bind this, selectionTrail.length - 1
    atRoot = @state.selection.length is 0
    className = classnames({
        "field-guide": true,
        rtl: this.props.rtl
      })

    <div
      className={className}
      lang={this.props.locale}
    >
      <header>
        <button type="button" className="field-guide-header-button" disabled={atRoot} onClick={levelUp}>
          <i className="fa fa-chevron-left fa-fw"></i>
        </button>
        <strong>Field Guide</strong>
        <button type="button" className="field-guide-header-button" onClick={@props.onClickClose}>
          <i className="fa fa-times fa-fw"></i>
        </button>
      </header>

      {@renderItem selectedItem}
    </div>
