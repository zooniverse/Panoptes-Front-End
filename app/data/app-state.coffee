Store = require './store'

appState = new Store
  showingLoginDialog: false

  notifications: []

  handlers:
    'login-dialog:show': ->
      @set 'showingLoginDialog', true

    'login-dialog:hide': ->
      @set 'showingLoginDialog', false

module.exports = appState
