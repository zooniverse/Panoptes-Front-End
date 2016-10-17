counterpart = require 'counterpart'
React = require 'react'
{Markdown} = (require 'markdownz').default

counterpart.registerTranslations 'en',
  glossary:
    content: '''
      ## Glossary
      A collection of definitions for terms used across the Zooniverse. The terms are split into three different groups; [General Terms](#generalTerms); [People](#people) and [Project-Specific Terms](#projectSpecificTerms).

      ###<a name="generalTerms"></a>GENERAL TERMS

      this is my generalterm...horaay!

      ###<a name="people"></a>PEOPLE


      ###<a name="projectSpecificTerms"></a>PROJECT-SPECIFIC TERMS


    '''

module.exports = React.createClass
  displayName: 'Glossary'

  render: ->
    <div className="secondary-page centered-grid">
      <Markdown>{counterpart "glossary.content"}</Markdown>
    </div>
