counterpart = require 'counterpart'
React = require 'react'
{Markdown} = (require 'markdownz').default

counterpart.registerTranslations 'en',
  bestPracticesIntroductionPage:
    content: '''
      # Building, Launching, and Running Your Zooniverse Project:
      # Best Practices for Engagement & Success

      ## Introduction: "Best Practices," What and Why?

      ----------

      Welcome! If you are reading this, you are probably interested in starting a Zooniverse project using the Project Builder. Perhaps your images/subjects are prepared, you have a compelling research case, and you know what information you are looking for... all that you need now is to process those images and turn them into data, so that you can make the breakthrough of the century in your field. We say, great—you’ve come to the right place!

      First, however, take a moment to consider the Zooniverse slogan: __People-Powered Research__.

      Why is that so important? Well, because it’s true. Simply put, __volunteers are the lifeblood of a Zooniverse project__, and only with their efforts can your project accomplish its research goals. Your project’s amateur researchers are not a data-processing machine: they are people with many options for how to spend their free time, who (may) freely choose to help you. Thus, it is critical to the success of your project that you __engage__ your participants as much as possible.

      Volunteer engagement takes many forms, and may differ from project to project. To get you started, this document contains a set of basic "best practices" for engagement that new research teams should consider as they create and manage a project. These best practices were identified by experienced volunteers, researchers, and Zooniverse staff at a Sept. 2015 workshop, funded by the Alfred P. Sloan Foundation, at Chicago’s Adler Planetarium. They are organized into three categories:

      Building your project to be appealing and volunteer-friendly.
      Launching your project and recruiting volunteers.
      Managing your project from post-launch to completion.

      Although these best practices are for the most part __non-mandatory suggestions__, they are drawn from significant experience, and __we strongly recommend reading through this entire article before you start building your project!__ It may be useful to refer back to it later on as well.

      Please read on for how to [Build a Great Project](/lab-best-practices/great-project), and best of luck with your project!

      &mdash; *The Zooniverse Team*
    '''

module.exports = React.createClass
  displayName: 'LabBestPracticesIntroductionPage'

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <Markdown>{counterpart "bestPracticesIntroductionPage.content"}</Markdown>
