counterpart = require 'counterpart'
React = require 'react'
{Markdown} = (require 'markdownz').default

counterpart.registerTranslations 'en',
  glossary:
    content: '''
      ## Glossary
      A collection of definitions for terms used across the Zooniverse. The terms are split into three different groups; [General Terms](#general-terms); [People](#people) and [Project-Specific Terms](#project-specific-terms).

      ###GENERAL TERMS <a id="general-terms"></a>


      ###PEOPLE <a id="people"></a>


      ###PROJECT-SPECIFIC TERMS <a id="project-specific-terms"></a>


    '''

module.exports = React.createClass
  displayName: 'Glossary'

  render: ->
    <div className="secondary-page centered-grid">
      <Markdown>{counterpart "glossary.content"}</Markdown>
    </div>
