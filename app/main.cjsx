React = require 'react'
ReactDOM = require 'react-dom'
apiClient = require 'panoptes-client/lib/api-client'
auth = require 'panoptes-client/lib/auth'
{ applyRouterMiddleware, Router, browserHistory } = require 'react-router'
useScroll = require 'react-router-scroll/lib/useScroll'
routes = require './router'
style = require '../css/main.styl'
{ sugarClient } = require 'panoptes-client/lib/sugar'

# Redux
`import { Provider } from 'react-redux';`
`import configureStore from './redux/store';`
`import { notify, injectSubjects } from './redux/ducks/interventions';`
`import { emptySubjectQueue } from './redux/ducks/classify';`
store = configureStore()
auth.listen('change', () => store.dispatch(emptySubjectQueue()));
apiClient.type('subject_sets').listen('add-or-remove', () => store.dispatch(emptySubjectQueue()));
sugarClient.on('experiment', (message) => store.dispatch(notify(message)));
sugarClient.on('subject-queue', (message) => store.dispatch(injectSubjects(message)));

# Redirect any old `/#/foo`-style URLs to `/foo`.
if location?.hash.charAt(1) is '/'
  location.replace location.hash.slice 1

browserHistory.listen ->
  dispatchEvent new CustomEvent 'locationchange'

# make sure project stats page does not scroll back to the top when the URL changes
shouldUpdateScroll = (prevRouterProps, routerProps) ->
  pathname = routerProps.location.pathname.split('/')
  isStats = ('stats' in pathname) and ('projects' in pathname)
  isSubjectTalk = ('talk' in pathname) and ('subjects' in pathname)
  isLabVisibility = ('lab' in pathname) and ('visibility' in pathname)
  isOrganization = ('organizations' in pathname)
  hashChange = routerProps.location.hash.length
  if isStats or hashChange or isSubjectTalk or isLabVisibility or isOrganization
    false
  else
    true

ReactDOM.render <Provider store={store}><Router history={browserHistory} render={applyRouterMiddleware(useScroll(shouldUpdateScroll))}>{routes}</Router></Provider>,
  document.getElementById('panoptes-main-container')

# Are we connected to the latest back end?
require('./lib/log-deployed-commit')()

# Just for console access:
window?.zooAPI = require 'panoptes-client/lib/api-client'
window?.talkAPI = require 'panoptes-client/lib/talk-client'
require('./lib/split-config')
