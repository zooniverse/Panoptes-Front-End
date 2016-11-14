counterpart = require 'counterpart'
React = require 'react'
{Markdown} = (require 'markdownz').default

counterpart.registerTranslations 'en',
  callForProjects:
   pageContent: '''
    ## Call for Biomedical Project Proposals

    Would your research benefit from the involvement of hundreds or even thousands of volunteers? We are currently seeking proposals for biomedical projects to be developed as part of the Zooniverse.org platform.

    Zooniverse is the world’s largest and most successful online platform for crowd-sourced research; we currently have over 1.5 million registered volunteers working in collaboration with professional researchers on more than 40 research projects across a range of disciplines, from astronomy to biology.

    You can see examples of our current biomedical projects at Zooniverse.org. These include [Microscopy Masters](https://www.zooniverse.org/projects/jbrugg/microscopy-masters), where citizen scientists classify cryo-electron microscopy images to advance understanding of protein and virus structure, and [Worm Watch Lab](https://www.wormwatchlab.org/), which aims to improve understanding of the relationship between genes and behaviour.

    Using our unique [Project Builder](/lab) tool you can now build your own Zooniverse project. If your project requires tools that don’t yet exist on the Zooniverse platform, please propose your project using the form below. We are particularly interested in developing projects that extend the functionality our platform.

    ### Project Selection

    Successful projects will be selected from responses to this call, and will be developed and hosted by the Zooniverse team in close collaboration with the applicants. Project proposals are expected to clearly describe the research question addressed and intended research outputs. Those writing proposals should review the existing range of Zooniverse projects.

    ### Selection Criteria:

    1.	Alignment with biomedical research (long-term aim of research is to improve human health outcomes).
    2.	Merit and usefulness of the data expected to result from the project. 
    3.	Novelty of the problem; projects which require extending the capability of the Zooniverse platform or serve as case studies for crowdsourcing in new areas are encouraged.

    ### Deadline

    We will begin reviewing proposals from December 4th, but project proposals are welcomed until January 31st.


    [SUBMIT A PROPOSAL](https://goo.gl/forms/uUGdO5CpWDNFE5Uz2)


    '''

module.exports = React.createClass
  displayName: 'CallForProjects'

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <Markdown>{counterpart "callForProjects.pageContent"}</Markdown>
