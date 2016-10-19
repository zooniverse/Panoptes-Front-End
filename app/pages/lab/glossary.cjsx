counterpart = require 'counterpart'
React = require 'react'
{Markdown} = (require 'markdownz').default

counterpart.registerTranslations 'en',
  policiesPage:
    content: '''
      ## Glossary
      A collection of definitions for terms used across the Zooniverse. The terms are split into three different groups:

      [[toc]]

      ## General Terms


      ## People


      ## Project-Specific Terms



    '''

module.exports = React.createClass
  displayName: 'Glossary'

  render: ->
    <div className="secondary-page centered-grid">
      <Markdown>{counterpart "policiesPage.content"}</Markdown>
    </div>
