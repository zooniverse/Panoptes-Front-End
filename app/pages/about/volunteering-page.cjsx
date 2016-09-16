counterpart = require 'counterpart'
React = require 'react'
{Markdown} = (require 'markdownz').default

counterpart.registerTranslations 'en',
  volunteeringPage:
   pageContent: '''
    ## How to Volunteer

    There are several different ways to volunteer with the Zooniverse. The main ways are helping us with classifications on data, being a beta tester on projects we've yet to launch, and being a moderator for a project. For more information about any of these roles, just read below.

    ### Volunteer on a Project
    This is the easiest and most common way of volunteering with the Zooniverse! We always need volunteers to go onto our projects and classify the data contained in them. You can read more about what happens with the classifications and how it helps the scientific community and the progress of science on the [About](/about) page.

    There is no minimum time requirement needed; do as much or as little as you'd like. To get started as a classifications volunteer, just to go to the [Projects](/projects) page, have a look through, find one you like the look of, and get stuck in!

    ### Volunteer as a Beta Tester
    Volunteers also help us test projects before they are launched to check that they work properly. This involves working through some classifications on the beta project to check that it works, looking for any bugs, and filling out a questionnaire at the end. This helps us find any issues in the project that need resolving and also assess how suitable the project is for the Zooniverse. You can read some guidelines on what makes a project suitable on the [Policies](/lab-policies) page, under 'Rules and Regulations'. 

    To sign up as a beta tester, log in, just go to your profile page, select the e-mail tab and tick the box next relating to beta testing. We'll then send you emails when a project is ready to be tested. If you'd like to stop being a beta tester, and stop receiving these emails, just go back to the same page and untick the box.

    ### Volunteer as a Project Moderator
    Volunteer moderators have extra permissions in the Talk board for a particular project. They help moderate discussions and act as a point of contact for the project. Volunteer moderators are selected by the project owner; if you're interested in this role, [contact](/about/contact) Grant Miller, the Zooniverse Communications Lead, and to be put in touch with the researcher. 

    ### Further Information
    If you'd like any more information on any of these different roles, contact us via the [Contact Us](/about/contact) page.


    '''

module.exports = React.createClass
  displayName: 'VolunteeringPage'

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <Markdown>{counterpart "volunteeringPage.pageContent"}</Markdown>
