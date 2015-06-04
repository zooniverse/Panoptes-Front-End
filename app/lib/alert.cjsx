React = require 'react'
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

  closeButton = <button onClick={defer.resolve}>&times;</button>
  React.render <Dialog className="alert" controls={closeButton} onEscape={defer.resolve}>
    {message}
  </Dialog>, container

  unmount = ->
    underlay.removeEventListener('click', unmount, false)

    React.unmountComponentAtNode container
    container.parentNode.removeChild container
    previousActiveElement?.focus()

  # Close alert if click underlay
  underlay = container.querySelector('.dialog-underlay')
  underlay.addEventListener('click', unmount, false)

  promise.then unmount, unmount
  promise
