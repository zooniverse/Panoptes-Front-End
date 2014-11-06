React = require 'react'
Dialog = require '../components/dialog'

module.exports = (messages...) ->
  container = document.createElement 'div'
  container.classList.add 'dialog-container'
  document.body.appendChild container

  unmount = ->
    React.unmountComponentAtNode container
    container.parentNode.removeChild container

  React.render <Dialog className="alert">
    {messages}
    <button className="alert-dialog-close-button" onClick={unmount}>&times;</button>
  </Dialog>, container
