{dispatch} = require '../data/dispatcher'

module.exports =
  showLoginDialog: (tabIndex) ->
    dispatch 'login-dialog:show'
    if tabIndex?
      dispatch 'login-dialog:switch-tab', tabIndex

  hideLoginDialog: ->
    dispatch 'login-dialog:hide'
