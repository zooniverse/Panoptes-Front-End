counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{Markdown} = require 'markdownz'

counterpart.registerTranslations 'en',
  contactPage:
    content: '''
      ## Contact & Social Media

      Most of the time, the best way to reach the Zooniverse team, or any project teams, especially about any project-specific issues, is through the discussion boards.

      If you need to contact the Zooniverse team about a general matter, you can also send an email to the team at [contact@zooniverse.org](mailto:contact@zooniverse.org). Please understand that the Zooniverse team is relatively small and very busy, so unfortunately we cannot reply to all of the emails we receive.

      If you are interested in collaborating with the Zooniverse, for instance on a custom-built project, please email [collab@zooniverse.org](mailto:collab@zooniverse.org). (Note that our [Project Builder](/lab) offers an effective way to set up a new project without needing to contact the team!)

      For press inquires, please contact the Zooniverse directors Chris Lintott at [chris@zooniverse.org](mailto:chris@zooniverse.org) or +44 (0) 7808 167288 or Laura Trouille at [trouille@zooniverse.org](mailto:trouille@zooniverse.org) or +1 312 322 0820.

      If you want to keep up to date with what's going on across the Zooniverse and our latest results, check out the [Daily Zooniverse](http://daily.zooniverse.org/) or the main [Zooniverse blog](http://blog.zooniverse.org/). You can also follow the Zooniverse on [Twitter](http://twitter.com/the_zooniverse), [Facebook](http://facebook.com/therealzooniverse), and [Google+](https://plus.google.com/+ZooniverseOrgReal).
    '''

module.exports = React.createClass
  displayName: 'ContactPage'

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <Markdown>{counterpart "contactPage.content"}</Markdown>
