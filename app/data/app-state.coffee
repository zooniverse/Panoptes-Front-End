Store = require './store'

appState = new Store
  showLoginDialog: false

  handlers:
    'current-user:sign-in:succeed': ->
      @set 'showLoginDialog', false

module.exports = appState
