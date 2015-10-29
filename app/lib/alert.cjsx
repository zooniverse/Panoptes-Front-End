React = require 'react'
ReactDOM = require 'react-dom'
Dialog = require '../components/dialog'

module.exports = (message) ->
  defer =
    resolve: null
    reject: null

  promise = new Promise (resolve, reject) ->
    defer.resolve = resolve
    defer.reject = reject

  if typeof message is 'function'
    message = message defer.resolve, defer.reject

  container = document.createElement 'div'
  container.classList.add 'dialog-container'
  document.body.appendChild container

  previousActiveElement = document.activeElement

  closeButton = <button aria-label='Close' onClick={defer.resolve}>&times;</button>
  ReactDOM.render <Dialog className="alert" controls={closeButton} onEscape={defer.resolve}>
    {message}
  </Dialog>, container

  unmount = ->
    ReactDOM.unmountComponentAtNode container
    container.parentNode.removeChild container
    previousActiveElement?.focus()

  promise.then unmount, unmount
  promise
