counterpart = require 'counterpart'
React = require 'react'
{Markdown} = (require 'markdownz').default

counterpart.registerTranslations 'en',
  volunteeringPage:
   pageContent: '''
    ## How to Volunteer

    First of all, everyone who contributes to a Zooniverse project is a volunteer! We have a wonderful, global community who help us do what we do. The main ways of volunteering with us are helping us with classifications on data, being a beta tester on projects we've yet to launch, and being a moderator for a project. For more information about any of these roles, just read below.

    ### Volunteer on a Project
    Volunteering on a project is the easiest and most common way of volunteering. We always need volunteers to go onto our projects and classify the data contained in them. You can read more about what happens with the classifications and how it helps the scientific community and the progress of science on the [About](/about) page.

    There is no minimum time requirement needed; do as much or as little as you'd like. To get started as a classifications volunteer, just to go to the [Projects](/projects) page, have a look through, find one you like the look of, and get stuck in!

    ### Volunteer as a Beta Tester
    Volunteers also help us test projects before they are launched to check that they work properly. This involves working through some classifications on the beta project to check that it works, looking for any bugs, and filling out a questionnaire at the end. This helps us find any issues in the project that need resolving and also assess how suitable the project is for the Zooniverse. You can read some guidelines on what makes a project suitable on the [Policies](/lab-policies) page, under 'Rules and Regulations'.

    To sign up as a beta tester, go to [www.zooniverse.org/settings/email](/settings/email) and tick the box relating to beta testing. We'll then send you emails when a project is ready to be tested. You can change your email settings any time you want using the [same email page](/settings/email) and unticking the box.

    ### Volunteer as a Project Moderator
    Volunteer moderators have extra permissions in the Talk discussion tool for a particular project. They help moderate discussions and act as a point of contact for the project. Moderators are selected by the project owner. If you're interested in becoming a moderator on a project you're taking part in, go to the project's About page and get in touch with the researcher.

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
