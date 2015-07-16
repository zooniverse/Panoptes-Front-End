React = require 'react'

Menu = React.createClass
  displayName: 'DropdownMenu'

  getDefaultProps: ->
    anchor: null
    onClickAway: Function.prototype

  containerStyle:
    background: 'rgba(127, 127, 127, 0.1)'
    bottom: 0
    left: 0
    position: 'fixed'
    right: 0
    top: 0

  componentDidMount: ->
    @reposition()

  render: ->
    <div className="dropdown-menu-container" style={@containerStyle} onClick={@handleClickAway}>
      <div className="dropdown-menu">
        {@props.children}
      </div>
    </div>

  handleClickAway: (e) ->
    if e.target is @getDOMNode()
      @props.onClickAway arguments...

  reposition: ->
    console.log @props.anchor

module.exports = React.createClass
  displayName: 'Dropdown'

  getDefaultProps: ->
    tag: 'button'
    className: 'dropdown'
    label: '···'

  getInitialState: ->
    root: null

  componentWillUnmount: ->
    @close()

  render: ->
    React.createElement @props.tag,
      className: @props.className
      onClick: @open
      @props.label

  open: ->
    root = document.createElement 'div'
    root.classList.add 'dropdown-menu-root'
    document.body.appendChild root

    @setState {root}

    React.render <Menu anchor={@getDOMNode()} onClickAway={@close}>
      {@props.children}
    </Menu>, root

  close: ->
    if @state.root?
      React.unmountComponentAtNode @state.root
      @state.root.parentNode.removeChild @state.root
      @setState root: null
