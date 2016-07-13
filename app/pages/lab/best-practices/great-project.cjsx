counterpart = require 'counterpart'
React = require 'react'
{Markdown} = (require 'markdownz').default

counterpart.registerTranslations 'en',
  bestPracticesGreatProjectsPage:
    content: '''
      # Part I: Building a Great Project

      ----------

      __Know that you are making a commitment!__ Building, launching, and (especially) maintaining an engaging project takes time and sustained effort. Before you even start, your project team should be prepared to remain personally involved with your project for its entire lifespan. Reduce your individual workloads by delegating responsibilities to each member of your team.

      __Understand your goals and expectations from the start.__ The end goal of a Zooniverse project generally should be to produce new research from volunteers’ efforts. Be sure that your project design and messaging reflect the tangible goal that you are working towards.

      __Consider reaching out to Zooniverse volunteers early on.__ Some of our most successful projects in terms of engagement have been those built in cooperation with volunteers. You might find volunteers interested in helping with your build on Zooniverse Talk’s [Project Building board](/talk/18).

      __Keep everything short and simple.__ Your volunteers are smart, but most will not be experts. Avoid jargon and complex questions. Make the tasks fairly basic, and consolidate them when possible. Ideally, a 10- or 12-year-old child should be able to understand and do your project.

      __Help text should help volunteers answer the question.__ When volunteers click "Need Some Help?" they are seeking help in answering that question. There are other areas in the project to describe your research; the help text is for visual examples and question-specific guidance. You can (and should) discuss your research goals in depth on your project’s Research page.

      __Use images as examples wherever possible.__ Visual examples of what you are asking volunteers to look for are extremely important to have in addition to text descriptions. Consider offering a variety of examples of "correctly" classified data to educate volunteers.

      __Create informative content and a solid name and tagline.__ The title of your project should be short and punchy; your tagline should try to "hook" volunteers. Use your static pages (Research, FAQs, etc.) to explain your project clearly and resolve the most common questions about it.

      __Be prepared to test and make changes.__ However good your project’s "first draft" is, volunteer testing (including the formal Zooniverse "project review" stage) will reveal things to alter. You should first test your project with contacts, friends, or family who are trying it for the first time—and watch them as they do it! Study your feedback and raw data, and make adjustments.

      __Make your project visually clean and interesting.__ Choose imagery that fits your project’s aesthetic and that you have permission to use. Make sure that text is readable over your background. Also be sure to do a review to make sure that all of your text is displaying properly.
    '''

module.exports = React.createClass
  displayName: 'LabBestPracticesGreatProjectsPage'

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <Markdown>{counterpart "bestPracticesGreatProjectsPage.content"}</Markdown>
