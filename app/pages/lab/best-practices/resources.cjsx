counterpart = require 'counterpart'
React = require 'react'
{Markdown} = (require 'markdownz').default

counterpart.registerTranslations 'en',
  bestPracticesAppendixPage:
    content: '''
      # Appendix: Resources and Examples

      ----------

      ### Useful Links, Blog Posts, and Documents:

      - [Project Builder Policies](/lab-policies) &mdash; Official Zooniverse policy about user-built projects.
      - [Examples of Strong Newsletters](https://docs.google.com/document/d/1xB0nNPzwwzNgCwm0_ZufIy-0I6HX3OG2YHkVZ-oBQCo/edit?usp=sharing) &mdash; Samples of newsletters we have used.
      - [What Are Moderators For?](https://docs.google.com/document/d/1L8LwYy_uUxwX1NqE5sXi0fnrjZKG1DZu1fWLath9BOE) &mdash; Learn what moderators are and why you want them.
      - [Measuring Success in Citizen Science Projects: Part 1](http://blog.zooniverse.org/2015/08/24/measuring-success-in-citizen-science-projects-part-1-methods/) and [Part 2](http://blog.zooniverse.org/2015/08/24/measuring-success-in-citizen-science-projects-part-2-results/) &mdash; An analysis of past (and current) Zooniverse projects, demonstrating the importance of engagement.
      - [Who Are The Zooniverse Community? We Asked Them&hellip;](http://blog.zooniverse.org/2015/03/05/who-are-the-zooniverse-community-we-asked-them/) &mdash; A summary of results from a survey of Zooniverse volunteers conducted as part of a master’s thesis in 2014-2015.
      - [Zooniverse GitHub](https://github.com/zooniverse) &mdash; Zooniverse’s code base. You can submit issues and pull requests.
      - [Zooniverse Researchers & Moderators](https://www.facebook.com/groups/123295911357282/) &mdash; Private Facebook group that you may join.
      - [Zooniverse Backchannel Blog](https://zoobackchannel.wordpress.com/) &mdash; Private blog you may request to join. Posts are relatively rare and often concerned with technical details of handling Zooniverse data.
      - [17 Tools for Social Media](https://www.quicksprout.com/2015/08/14/17-tools-thatll-take-your-social-media-marketing-results-to-the-next-level/) &mdash; Social media is important, but can also be time-consuming. These tools can help you pre-schedule, analyze, and get the most out of your posts.
      - [The Power of a Challenge](http://blog.zooniverse.org/2015/08/31/sunspotter-citizen-science-challenge-update-zooniverse-volunteers-are-overachievers/) &mdash; A challenge that got 650,000 classifications in a weekend.
      - [Zooniverse "Meta" Publications](/about/publications) &mdash; for those wishing to know a lot more about research into the practice of citizen science. (Click the "Meta" link on the left side of the page.)
      - [Why We Don’t Have an ‘I Don’t Know’ Button](http://blog.snapshotserengeti.org/2012/12/14/we-need-an-i-dont-know-button/) &mdash; Volunteers often ask for some way to express uncertainty. Using Snapshot Serengeti, this explains why we want a best guess.
      - [Federal Crowdsourcing and Citizen Science Toolkit](https://crowdsourcing-toolkit.sites.usa.gov/) &mdash; Running a citizen science project from within the federal government comes with added constraints. This kit can help.

      ### Examples of Project Builder Projects:

      - [Fossil Finder](/projects/adrianevans/fossil-finder) &mdash; Good example of content: name, tagline, help text/images, info pages.
      - [Whales as Individuals](/projects/tedcheese/whales-as-individuals) &mdash; Good example of tasks/questions with multiple workflows.
      - [Planet Four: Terrains](/projects/mschwamb/planet-four-terrains) &mdash; Has a strong focus on researcher/volunteer interaction on Talk.
      - ["Kitteh Zoo"](/projects/vrooje/kitteh-zoo) &mdash; Lighthearted sample project illustrating many of the Builder’s capabilities.

      ### Examples of Gamized Behavior:

      - [Chimp & See Talk](http://talk.chimpandsee.org/) &mdash; This popular Talk is also used for the "Chimp ID" process: a good example of non-competitive gamized behavior that also serves a research purpose.
      - [My Galaxies](http://writing.galaxyzoo.org/) &mdash; Write text using galaxies as letters; built with volunteer help.
      - Cookie recipes for [Seafloor Explorer](http://blog.seafloorexplorer.org/2013/12/13/crunchy-buttery-sea-stars/), [Worm Watch Lab](http://blog.wormwatchlab.org/2013/12/17/green-eggs-and-worms/) and [Notes From Nature](blog.notesfromnature.org/2013/12/21/cookies-from-nature/).
      - [Snapshot Serengeti Meme Generator](http://blog.snapshotserengeti.org/2013/07/31/save-the-memes/) &mdash; allowed users to caption photos (now defunct).
      - Zooniverse project cocktails for Advent, [part one](http://blog.zooniverse.org/2013/12/22/zooniverse-cocktails/) and [part two](http://blog.zooniverse.org/2011/12/20/zooniverse-cocktail-hour/).
      - [Just for Fun](http://blog.zooniverse.org/category/fun/) &mdash; Various "fun" posts on the Zooniverse blog, many about gamizing.
    '''

module.exports = React.createClass
  displayName: 'LabBestPracticesAppendixPage'

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <Markdown>{counterpart "bestPracticesAppendixPage.content"}</Markdown>
