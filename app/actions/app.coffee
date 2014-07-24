{dispatch} = require '../data/dispatcher'

module.exports =
  showLoginDialog: (tabIndex) ->
    dispatch 'login-dialog:show'
    if typeof tabIndex is 'number'
      dispatch 'login-dialog:switch-tab', tabIndex

  hideLoginDialog: ->
    dispatch 'login-dialog:hide'
