counterpart = require 'counterpart'
React = require 'react'
{Markdown} = (require 'markdownz').default

counterpart.registerTranslations 'en',
  volunteeringPage:
   pageContent: '''
    ## How to Volunteer

    Blihjhjsdgfjgsdhjfg'''

module.exports = React.createClass
  displayName: 'VolunteeringPage'

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <Markdown>{counterpart "volunteeringPage.pageContent"}</Markdown>
