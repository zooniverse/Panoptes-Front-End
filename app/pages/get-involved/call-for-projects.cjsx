counterpart = require 'counterpart'
React = require 'react'
{Markdown} = require 'markdownz'

counterpart.registerTranslations 'en',
  callForProjects:
   pageContent: '''
    ## Call for Project Proposals

    Would your research benefit from the involvement of hundreds or even thousands of volunteers? We are currently seeking proposals in two different disciplines: biomedical research, and text transcription projects in the humanities or Galleries/Libraries/Archives/Museums (GLAM) sector, to be developed as part of the Zooniverse platform.

    Zooniverse is the world’s largest and most successful online platform for crowd-sourced research; we currently have over 1.5 million registered volunteers working in collaboration with professional researchers on more than 70 research projects across a range of disciplines, from astronomy to biology.

    Using our unique [Project Builder](/lab) you can now build your own Zooniverse project for free with a set of tried and tested tools, including multiple-choice questions and region marking or drawing tools. If we don’t yet offer the tools you would need, please propose your project below. We are particularly interested in developing projects that extend the functionality of our platform.

    &nbsp;

    ## Call for Biomedical Project Proposals

    You can see examples of our current biomedical projects at Zooniverse.org. These include [Microscopy Masters](https://www.zooniverse.org/projects/jbrugg/microscopy-masters), where citizen scientists classify cryo-electron microscopy images to advance understanding of protein and virus structure, and [Worm Watch Lab](https://www.wormwatchlab.org/), which aims to improve understanding of the relationship between genes and behaviour.

    ### Project Selection

    Successful biomedical projects will be selected from responses to this call, and will be developed and hosted by the Zooniverse team in close collaboration with the applicants. Project proposals are expected to clearly describe the research question addressed and intended research outputs. Those writing proposals should review the existing range of Zooniverse projects and be confident that their project cannot be built with the existing tools.

    ### Selection Criteria:

    1.	Alignment with biomedical research (long-term aim of research is to improve human health outcomes).
    2.	Merit and usefulness of the data expected to result from the project. 
    3.	Novelty of the problem; projects which require extending the capability of the Zooniverse platform or serve as case studies for crowdsourcing in new areas are encouraged.

    ### Deadline

    Applicants can submit project proposals until January 31st, 2017.


    [SUBMIT A BIOMEDICAL PROPOSAL](https://goo.gl/forms/uUGdO5CpWDNFE5Uz2)

    &nbsp;

    ## Call for Text Transcription Project Proposals

    You can see examples of our current text transcription projects at [Zooniverse.org](http://zooniverse.org/). These include [AnnoTate](https://anno.tate.org.uk/#/), where volunteers transcribe twentieth-century British artists’ sketchbooks and papers; [Decoding the Civil War](https://www.decodingthecivilwar.org), in which volunteers transcribe telegrams from the American Civil War, and [Shakespeare’s World](https://www.shakespearesworld.org/#/), where volunteers transcribe documents produced in and around Shakespeare’s lifetime (sixteenth and seventeenth century). The resulting datasets will be incorporated into the Tate and Folger Shakespeare Library’s respective content management systems (CMS), and will also be used for research by humanities specialists. We are particularly keen to work on projects where the data can be incorporated into an existing CMS and used for research purposes.

    ### Project Selection

    Using our free [Project Builder](/lab) you can now build your own Zooniverse project with a set of tried and tested tools such as questions (yes/no; multiple choice) and region marking or drawing tools. More recently we’ve released transcription transcription tools, but are keen to expand their functionality. To that end, we are seeking one or more transcription projects that will help us test and expand the remit of our text transcription tools. These projects need not replicate the functionality of AnnoTate, Decoding the Civil War or Shakespeare’s World. They could involve letter-by-letter transcription using a bespoke keyboard, as in Ancient Lives, the first Zooniverse transcription project, which is now retired.

    ### Selection Criteria:

    1. 	We are looking for projects that harness crowdsourced text transcription for the purposes of unlocking big data currently trapped in GLAM sources that cannot be machine read, and for which human effort is truly necessary.
    2. 	The data extracted must have an audience or usefulness, be this to academic researchers, members of the public or both.
    3. 	Your material must be imaged or there must be funds available to image it. We are not able to fund imaging.
    4. 	Project teams need clear plans for how to make the crowdsourced data openly and publicly available, ideally through a content management system (CMS) or site hosted and maintained by your institution.
    5. 	We will not accept projects for which the material has previously been edited, i.e. the novels of Jane Austen.

    ### Deadline
    Applicants can submit project proposals until January 31st, 2017.


    [SUBMIT A TEXT TRANSCRIPTION PROPOSAL](https://goo.gl/forms/VZX5IdlK59B1eBez2)

    '''

module.exports = React.createClass
  displayName: 'CallForProjects'

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <Markdown>{counterpart "callForProjects.pageContent"}</Markdown>
