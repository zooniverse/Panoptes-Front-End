counterpart = require 'counterpart'
React = require 'react'
{Markdown} = (require 'markdownz').default

counterpart.registerTranslations 'en',
  bestPracticesLaunchRushPage:
    content: '''
      # Part II: The Launch Rush

      ----------

      __Understand the importance of the launch period!__ The first few days following the launch of your project are critical. Thousands of volunteers will be trying the project and deciding if they want to become regular classifiers. Your classifications per day will likely spike, then fall and level out; your level of long-term engagement depends largely on what you do during launch.

      __Write an amazing newsletter.__ For new Zooniverse projects, a newsletter will announce the project to over a million volunteers; it can bring huge traffic. Your newsletter should be short and personal, clearly describing the project and its goals. Include links to the project and associated sites (blog, social media, etc.). Don’t use styling or images—plain-text newsletters do best.

      __Have a promotion plan in place.__ The most successful projects will recruit new volunteers from outside the Zooniverse volunteer pool. Coordinate with your organization’s communications department. Try to promote to any existing networks or known interest groups; seek out press attention. Also see if you can leverage connections with related organizations for promotion.

      __"Talk" to your volunteers!__ One appealing element of the Zooniverse is that volunteers can engage directly with professional researchers on the Talk discussion boards. Your presence in these first few days is especially important. By answering questions, you’re helping volunteers feel more comfortable and laying the foundation for those volunteers to teach future newcomers.

      __Prepare your blog, social media, and Talk, and be active.__ These are critical for developing deeper engagement, especially during your launch. Make sure that several boards are set up on Talk and that research team members are prepared to quickly respond to volunteers. During launch, consider daily blog posts and up to five posts per day on social-media accounts.

      __Have a plan to identify and appoint moderators.__ [Moderators](https://docs.google.com/document/d/1L8LwYy_uUxwX1NqE5sXi0fnrjZKG1DZu1fWLath9BOE) have additional authority on Talk and are a resource for new volunteers. They are appointed by you—typically after asking them personally. Choose mods wisely. You might start with a volunteer who is a mod on another project, then add first-timers later. Be sure that your moderators understand your expectations.

      __Expect things to go wrong, and be ready to fix them.__ In the attention that your project receives shortly after launch, you may discover additional issues that you will need to address immediately. Broken projects, or ones with messaging issues, do not engage and retain volunteers well. Update your FAQ with questions that you find yourself frequently responding to.

      __Plan your transition from launch to operating your project.__ After about a week, the launch frenzy will subside and less of your time will be required. However, you will still need to continue to engage with your volunteers and oversee your project. This is discussed further in Part III.
    '''

module.exports = React.createClass
  displayName: 'LabBestPracticesLaunchRushPage'

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <Markdown>{counterpart "bestPracticesLaunchRushPage.content"}</Markdown>
