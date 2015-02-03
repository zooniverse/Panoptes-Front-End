counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{Link} = require 'react-router'

counterpart.registerTranslations 'en',
  footer:
    privacyPolicy: 'Privacy policy'

module.exports = React.createClass
  displayName: 'MainFooter'

  render: ->
    <footer className="main-footer">
      <Link to="privacy"><Translate content="footer.privacyPolicy" /></Link>
    </footer>
