React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
{Link} = require 'react-router'
counterpart = require 'counterpart'
TalkBreadcrumbs = require './breadcrumbs.cjsx'
TalkSearchInput = require './search-input'
TalkFootnote = require './footnote'
{sugarClient} = require 'panoptes-client/lib/sugar'
{ Helmet } = require 'react-helmet'

counterpart.registerTranslations 'en',
  talkPage:
    title: 'Talk'

module.exports = createReactClass
  displayName: 'Talk'

  contextTypes:
    geordi: PropTypes.object

  logTalkView: ->
    @context.geordi?.logEvent
      type: "talk-view"

  componentWillMount: ->
    sugarClient.subscribeTo @props.section or 'zooniverse'
    @logTalkView()

  componentDidMount: ->
    @context.geordi?.remember projectToken: 'zooTalk'

  componentWillUnmount: ->
    sugarClient.unsubscribeFrom @props.section or 'zooniverse'
    @context.geordi?.forget ['projectToken']

  render: ->
    logClick = @context.geordi?.makeHandler? 'breadcrumb'
    <div className="talk content-container" lang="en">
      <Helmet title={counterpart 'talkPage.title'} />
      <h1 className="talk-main-link">
        <Link to="/talk" onClick={logClick?.bind(this, '')}>Zooniverse Talk</Link>
      </h1>

      <TalkBreadcrumbs {...@props} />

      <TalkSearchInput {...@props} placeholder={'Search the Zooniverse...'}/>

      {React.cloneElement @props.children, {section: 'zooniverse', user: @props.user}}

      <TalkFootnote />
    </div>
