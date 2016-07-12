counterpart = require 'counterpart'
React = require 'react'
{Markdown} = (require 'markdownz').default

counterpart.registerTranslations 'en',
  bestPracticesTheLongHaulPage:
    content: '''
      # Part III: In For the Long Haul

      ----------

      __Even after launch, running your project demands a time investment.__ You should dedicate time each week to volunteer engagement. Set up a plan in advance for who on your team will do what, and how often. Commit to your plan, and hold each other to it!

      __Send occasional reminder emails to your volunteers.__ Sometimes volunteers do forget about projects. The Zooniverse Communications team can help you send newsletters to your volunteers. Newsletters are proven to bring people back to projects and boost classifications.

      __Give people a reason to join your community.__ Volunteers who discuss your project on Talk, social media, etc. often remain more devoted. You may be able to entice more people to do this if, in addition to your posting regularly, you give them a specific purpose. For instance, volunteers could collect examples of rare objects, or find the same animal in multiple images.

      __Make it fun to be a part of your project.__ Your research may be serious, but that doesn’t mean taking part can’t be fun! Instead of competitive gamification (a turnoff for some), try 'gamizing' instead, with wry commentary, puns, captions, or other whimsical non-competitive amusement.

      __Don’t be afraid of volunteers!__ Just as your volunteers are better at classifying than they think, you are better at communicating to them than you think. As a professional researcher, you will command an automatic degree of respect to volunteers; use it to educate and engage.

      __Report back to volunteers on what they’ve accomplished.__ In a survey, over 90&#37; of Zoo volunteers said they classify to help advance research. Use blogs and social media posts to illustrate how their work is having a tangible effect and helping make discoveries. Encouraging new volunteers is especially important. Updates don’t have to be detailed; brief reports are fine!

      __Pay close attention to your project metrics.__ Your metrics are a valuable tool in evaluating the success of your engagement initiatives. Use them to inform decisions. Currently, a classification counter is available, and you can obtain additional information by querying your database.

      __Consider giving volunteers more ways to contribute.__ Some Zooniverse volunteers have conducted in-depth data analyses, written sorting algorithms, and become co-authors with researchers on peer-reviewed papers. Volunteers can also help with blogs and social media.

      __End your project and do right by your volunteers.__ When your project has been completed, thank your volunteers and explain what happens next. We expect researchers to use the results of the project in peer-reviewed research, and to share results with the community. Classification data should also be made open after a proprietary period. More information can be found [here](/lab-policies).
    '''

module.exports = React.createClass
  displayName: 'LabBestPracticesTheLongHaulPage'

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <Markdown>{counterpart "bestPracticesTheLongHaulPage.content"}</Markdown>
