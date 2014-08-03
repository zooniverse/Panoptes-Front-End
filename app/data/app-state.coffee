Store = require './store'

appState = new Store
  showingLoginDialog: false

  notifications: []

  'login-dialog:show': ->
    @showingLoginDialog = true

  'login-dialog:hide': ->
    @showingLoginDialog = false

module.exports = appState
