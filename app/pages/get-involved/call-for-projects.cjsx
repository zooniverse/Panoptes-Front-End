counterpart = require 'counterpart'
React = require 'react'
{Markdown} = require 'markdownz'

counterpart.registerTranslations 'en',
  callForProjects:
   pageContent: '''
    ## Call for Biomedical Project Proposals
    Would your research benefit from the involvement of thousands of volunteers? We are currently seeking proposals for biomedical projects to be developed as part of the Zooniverse platform. The Zooniverse is the world’s largest and most successful online platform for crowd-sourced research; we currently have over 1.5 million registered volunteers working in collaboration with professional researchers on more than 50 research projects across a range of disciplines, from physics to biology.

    Using our unique [Project Builder](/lab) you can create your own Zooniverse project for free with a set of tried and tested tools, including multiple-choice questions and region marking or drawing tools. If we don’t yet offer the tools you need, please propose your project below; we are particularly interested in developing novel projects that extend the functionality of our platform.

    &nbsp;

    ### Project Selection
    We are looking for biomedical projects that will help us expand the functionality of the Zooniverse and build on the selection of tools available to researchers via our platform. Projects may involve a processing task applied to images, graphs, videos or another data format, data collection, or a combination of the two. Successful projects will be developed and hosted by the Zooniverse team, in close collaboration with the applicants.

    Examples of our current biomedical projects include [Microscopy Masters](https://www.zooniverse.org/projects/jbrugg/microscopy-masters), where volunteers classify cryo-electron microscopy images to advance understanding of protein and virus structure, and [Worm Watch Lab](https://www.wormwatchlab.org/), which aims to improve understanding of the relationship between genes and behaviour.

    &nbsp;

    ### Selection Criteria:

    1.	Projects extending the capability of the Zooniverse platform or serving as case studies for crowdsourcing in new areas are encouraged.
    2.  Alignment with biomedical research (long-term aim of research is to improve human health outcomes).
    3.	Merit and usefulness of the data expected to result from the project. 

    &nbsp;

    ### Deadline

    Project proposals are accepted on a rolling basis. Applications will be reviewed at the beginning of each month.

    &nbsp;

    [SUBMIT A BIOMEDICAL PROPOSAL](https://goo.gl/forms/uUGdO5CpWDNFE5Uz2)

    '''

module.exports = React.createClass
  displayName: 'CallForProjects'

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <Markdown>{counterpart "callForProjects.pageContent"}</Markdown>
