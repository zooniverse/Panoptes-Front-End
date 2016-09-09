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

    There is no minimum time requirement needed; do as much or as a little as you'd like. To get started as a classifications volunteer, just to go to the [Projects](/projects) page, have a look through, find one you like the look of, and get stuck in!

    [POSSIBLY MOVE THIS BIT TO THE COLLECT PAGE?) There is also our [Talk](/talk) discussion board in which volunteers can talk about how they are finding projects and talk to the researchers behind them. You can mark images that you like as favourites, which means you can create your own gallery of favourite images, and you can also see collections of images that other volunteers have created.

    ### Volunteer as a Beta Tester
    Volunteers also help us test projects before they are launched to check that they work properly. This involves running through the beta project, looking for any bugs, and filling out a questionnaire at the end. This helps us find any issues in the project that need resolving and also assess how suitable the project is for the Zooniverse.

    To sign up as a beta tester, just go to your profile page, select the e-mail tab and tick the box next relating to beta testing. We'll then send you emails when a project is ready to be tested. If you'd like to stop being a beta tester, and stop receiving these emails, just go back to the same page and untick the box.

    ### Volunteer as a Project Moderator
    [NOT TOO SURE HOW THIS BIT WORKS ATM, WILL SPEAK WITH GRANT]


    '''

module.exports = React.createClass
  displayName: 'VolunteeringPage'

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <Markdown>{counterpart "volunteeringPage.pageContent"}</Markdown>
