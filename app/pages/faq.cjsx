counterpart = require 'counterpart'
React = require 'react'
{Markdown} = require 'markdownz'

counterpart.registerTranslations 'en',
  faqPage:
    content: '''

      ### Frequently Asked Questions
      - **Why do researchers need your help? Why can\'t computers do these tasks?**
        Humans are better than computers at many tasks. For most Zooniverse projects, computers just aren’t good enough to do the required task, or they may miss interesting features that a human would spot - this is why we need your help. Some Zooniverse projects are also using human classifications to help train computers to do better at these research tasks in the future. When you participate in a Zooniverse project, you are contributing to real research.
      - **How do I know if I\'m doing this right?**
        For most of the subjects shown in Zooniverse projects, the researchers don\'t know the correct answer and that\'s why they need your help. Human beings are really good at pattern recognition tasks, so generally your first guess is likely the right one. Don’t worry too much about making an occasional mistake - more than one person will review each image, video or graph in a project. Most Zooniverse projects have a Help button, a Frequently Asked Questions (FAQ) page, and a Field Guide with more information to guide you when classifying.
      - **What happens to my classification after I submit it?**
        Your classifications are stored in the Zooniverse\'s secure online database. Later on a project\'s research team accesses and combines the multiple volunteer assessments stored for each subject, including your classifications, together. Once you have submitted your response for a given subject image, graph, or video, you can\'t go back and edit it. Further information can be found on the [Zooniverse User Agreement and Privacy Policy page](/privacy).
      - **What does the Zooniverse do with my account information?**
        The Zooniverse takes very seriously the task of protecting our volunteer\'s personal information and classification data. Details about these efforts can be found on the [Zooniverse User Agreement and Privacy Policy page](/privacy) and the [Zooniverse Security page](/security).
      - **I have a feature request or found a bug; who should I talk to/how do I report it?**
        You can post your suggestions for new features and report bugs via the [Zooniverse Talk](/talk) or through the [Zooniverse Software repository](https://github.com/zooniverse/Panoptes-Front-End/issues).
      - **Is the Zooniverse hiring?**
        The Zooniverse is a collaboration between institutions from the United Kingdom and the United States; all of our team are employed by one or the other of these partner institutions. Check out the [Zoonvierse jobs page](https://jobs.zooniverse.org/) to find out more about employment opportunities within the Zooniverse.
      - **I\'m a project owner/research team member, how do I acknowledge the Zooniverse and the Project Builder Platform in my paper, talk abstract, etc.?**
        You can find more details on how to cite the Zooniverse in research publications using data derived from use of the Zooniverse Project Builder on our [Acknowledgements page](/about/acknowledgements).
      - **What browser version does Zooniverse support?**
        We support major browsers up to the second to last version.

      Didn\'t find the answer to your question? Ask on [Zooniverse Talk](/talk) or [get in touch](/about/contact).

    '''
module.exports = React.createClass
  displayName: 'FaqPage'

  render: ->
    <div className="secondary-page centered-grid">
      <Markdown>{counterpart "faqPage.content"}</Markdown>
    </div>
