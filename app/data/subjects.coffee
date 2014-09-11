Store = require './store'

EXAMPLE_SUBJECT =
  id: 'GZ_MAIN_SUBJECT'
  location: ['//placehold.it/720x480.png']
  project: 'GZ_PROJECT'
  workflow: 'GZ_MAIN_WORKFLOW'

module.exports = window.subjectsStore = new Store
  root: '/subjects'
  examples: [EXAMPLE_SUBJECT]

  getAny: (workflow) ->
    fetching = @fetch {workflow}
    fetching.then
