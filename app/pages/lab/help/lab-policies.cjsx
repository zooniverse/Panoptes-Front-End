counterpart = require 'counterpart'
React = require 'react'
createReactClass = require 'create-react-class'
{Markdown} = require 'markdownz'

counterpart.registerTranslations 'en',
  policiesPage:
    content: '''
      ## How to Launch your Project and Zooniverse Policies
      This page is for people who have used our Project Builder, and would now like to share their project with the Zooniverse community or their own crowd of collaborators or volunteers.
      &nbsp;

      ### How to Launch your Project
      A live project can exist in three different states, it may be a:
      1. Public Project
      2. Review Project
      3. Zooniverse Project

      Each of these project states is discussed below.
      &nbsp;

      **1. Public Project**
      Do you have your own crowd of volunteers, or only want members of your collaboration to classify your data? You can make your project public simply by sharing your project’s URL with those you want to take part.

      _If you're planning a big public launch, or you think your project might attract significant attention, you should [let us know](/about/contact) so we can support you properly. Please note, there is a limit of 10,000 subjects per user - [contact us](/about/contact) if you'd like to host more._
      &nbsp;

      **2. Review Project**
      If you would like the Zooniverse volunteer community to contribute to your project, the first step is to apply for review. You can do this in the project builder by clicking the “Apply for review” button within the “Visibility” section. At this point, your project is considered a “Review Project”.

      Your project will then be subject to two stages of review – firstly, the Zooniverse team will check your project complies with Zooniverse rules (see below). Typically, we will respond to you within two weeks. If successful, your project will then be shared with a group of volunteer project testers who will provide feedback. We will contact you when a slot becomes available for volunteer review (this currently takes one to four weeks). Once your project has been shared with our volunteer project testers, the majority of project feedback is typically received within a week. This will be made immediately accessible to you.

      During this process you should address the formal feedback provided by the volunteer project testers, as well as any comments on your project’s Talk discussion pages. Any technical issues can be reported to us via the [GitHub repository](https://github.com/zooniverse/Panoptes-Front-End), but please consider carefully any comments on workflow design.

      It is important you review the results produced at this stage to ensure they are of sufficient quality for your research. If they aren’t, please consider re-approaching your project design, make any changes, and submit for review again.
      &nbsp;

      **3. Zooniverse Project**
      Once your project has been successfully reviewed and you have a final version of your project, you can apply for your project to be launched as an official Zooniverse project. To do this, click “Apply for full launch” in the “Visibility” section of the project builder.

      Your project will then undergo a final review process. This may include requesting information from you about your plan for using the results, and examining the results from the review phase. We may also carry out a peer review of your project. This review process can take a variable amount of time, from weeks to months.

      Once the project has passed review, it will appear in the [Zooniverse project list](/projects/). We will consider including your project in our Zooniverse Newsletter and other promotional material. If you want your project to be promoted, note that we favour projects whose researchers are proactive in engaging with their community, on the Talk discussion forums and elsewhere.

      _If you'd like your project to launch on a particular day, perhaps to coincide with a press release, please [get in touch](/about/contact)._
      &nbsp;

      ### Zooniverse Policies
      At present, we provide the Zooniverse Project Builder software and hosting for free. **We reserve the right to remove content for any reason whatsoever**. We will remove content and projects where:
      - The content is not legal.
      - The content is likely to cause offense, or is suitable only for an adult audience.
      - The copyright on material uploaded to the site is not clear; please only use content you have the right to use.

      We reserve the right to decide which projects appear on the main project page and which are promoted to the Zooniverse community. In particular, if you have a project that is very close to an existing Zooniverse project, please [contact us](/about/contact) to discuss.

      Projects promoted to the Zooniverse community **must**:

      - Have the goal of producing useful research; your study needs to be well designed, and you must intend to analyze and write up your results as a formal publication.
      - Make their classification data open after a proprietary period, normally lasting two years from project launch.
      - Communicate research findings to their communities, via open access publication, a blog or elsewhere.
      - Acknowledge Zooniverse in any publications. Please use the following text:
      "_This publication uses data generated via the [Zooniverse.org](https://www.zooniverse.org/) platform, development of which is funded by generous support, including a Global Impact Award from Google, and by a grant from the Alfred P. Sloan Foundation._"
      - Report publications using Zooniverse-produced data to us via this [form](https://docs.google.com/forms/d/18jwLbtV_6M5HCM74xNFtFbiiszWAxpC5IGHaToYjeiw/viewform).
      &nbsp;

      If you have any questions relating to the content of this page, please [get in touch](/about/contact).
    '''

module.exports = createReactClass
  displayName: 'LabPoliciesPage'

  render: ->
    <div className="secondary-page">
      <Markdown>{counterpart "policiesPage.content"}</Markdown>
    </div>
