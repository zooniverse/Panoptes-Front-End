counterpart = require 'counterpart'
React = require 'react'
{Markdown} = require 'markdownz'
Translate = require 'react-translate-component'

counterpart.registerTranslations 'en',
  security:
    title: 'Zooniverse Security'
    securityIntro: '''
      The Zooniverse takes very seriously the security of our websites and systems, and protecting our users and their personal information is our highest priority. We take every precaution to ensure that the information you give us stays secure, but it is also important that you take steps to secure your own account, including:

      * Do not use the same password on different websites. The password you use for your Zooniverse account should be unique to us.
      * Never give your password to anyone. We will never ask you to send us your password, and you should never enter your Zooniverse password into any website other than ours. Always check your browser's address bar to make sure you have a secure connection to _www.zooniverse.org_.

      For general advice and information about staying safe online, please visit:

      * [Get Safe Online](https://www.getsafeonline.org)
      * [Stay Safe Online](https://www.staysafeonline.org)
      * [US-CERT - Tips](https://www.us-cert.gov/ncas/tips)
    '''

    securityDetails: '''
      ## Reporting Security Issues

      The Zooniverse supports [responsible disclosure](https://en.wikipedia.org/wiki/Responsible_disclosure) of vulnerabilities. If you believe you have discovered a security vulnerability in any Zooniverse software, we ask that this first be reported to [security@zooniverse.org](mailto:security@zooniverse.org) to allow time for vulnerabilities to be fixed before details are published.

      ## Known Vulnerabilities and Incidents

      We believe it is important to be completely transparent about security issues. A complete list of fixed vulnerabilities and past security incidents is given below:

      * _(No entries at this time)_

      New vulnerabilities and incidents will be announced via the [Zooniverse blog in the "technical" category](http://blog.zooniverse.org/category/technical/).
    '''

module.exports = React.createClass
  displayName: 'SecurityPage'

  componentDidMount: ->
    counterpart.onLocaleChange @handleLocaleChange

  componentWillUnmount: ->
    counterpart.offLocaleChange @handleLocaleChange

  handleLocaleChange: ->
    @forceUpdate()

  render: ->
    <div className="content-container">
      <Translate component="h1" content="security.title" />
      <div className="columns-container">
        <Markdown className="column">{counterpart 'security.securityIntro'}</Markdown>
        <Markdown className="column">{counterpart 'security.securityDetails'}</Markdown>
      </div>
    </div>
