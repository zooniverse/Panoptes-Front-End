counterpart = require 'counterpart'
React = require 'react'
{Markdown} = (require 'markdownz').default

counterpart.registerTranslations 'en',
  policiesPage:
    content: '''
      ## Glossary
      A collection of definitions for terms used across the Zooniverse. The terms are split into three different groups; <a name="generalTerms">General Terms</a>; <a name="projectSpecificTerms">Project-Specific Terms</a>, and <a name="people">People</a>.

      <a href="#generalTerms">###GENERAL TERMS</a>



      <a href="#people">###PEOPLE</a>



      <a href="projectSpecificTerms">###PROJECT-SPECIFIC TERMS</a>



    '''

module.exports = React.createClass
  displayName: 'LabPoliciesPage'

  render: ->
    <div className="secondary-page centered-grid">
      <Markdown>{counterpart "policiesPage.content"}</Markdown>
    </div>
