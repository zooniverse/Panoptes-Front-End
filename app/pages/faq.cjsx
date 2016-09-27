counterpart = require 'counterpart'
React = require 'react'
{Markdown} = (require 'markdownz').default

counterpart.registerTranslations 'en',
  faqPage:
    content: '''

      ### Frequently Asked Questions

      - **What browser version does Zooniverse support?**
        We support major browsers up to the second to last version.

      If you still need help or you want to suggest a frequently asked question - please [get in touch](/about/contact).

    '''

module.exports = React.createClass
  displayName: 'FaqPage'

  render: ->
    <div className="secondary-page centered-grid">
      <Markdown>{counterpart "faqPage.content"}</Markdown>
    </div>
